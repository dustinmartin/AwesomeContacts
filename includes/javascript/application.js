(function(window, document, $, _, undefined){

	"use strict";

	var model = {};
	var view = {};
	var controller = {};
	var utility = {};

	// **********************************************************
	// **********************************************************
	// Models
	// **********************************************************
	// **********************************************************

	model.Contact = function(id, firstName, lastName, phone, email){
		this.id = "";
		this.firstName = "";
		this.lastName = "";
		this.phone = "";
		this.email = "";

		if( id ){ this.id = id; }
		if( firstName ){ this.firstName = firstName; }
		if( lastName ){ this.lastName = lastName; }
		if( phone ){ this.phone = phone; }
		if( email ){ this.email = email; }
	};
	model.Contact.prototype = {
		validate: function(){
			var errors = {};

			// Some *extremely naive* regexes for validation.
			// These should be replaced by something much more thorough later
			var phoneRegex = new RegExp("^(1-)?[0-9]{3}(\s|\.|-){1}[0-9]{3}(-|\.){1}[0-9]{4}$");
			var emailRegex = new RegExp("^[a-zA-Z0-9-_\.]+@[a-zA-Z0-9-_\.]+");
			var nameRegex = new RegExp("^[a-zA-Z- ]+$");

			if( !nameRegex.test(this.firstName) ){
				errors.firstName = "Enter a valid first name";
			}

			if( !nameRegex.test(this.lastName) ){
				errors.lastName = "Enter a valid last name";
			}

			if( !phoneRegex.test(this.phone) ){
				errors.phone = "Enter a valid phone number";
			}

			if( !emailRegex.test(this.email) ){
				errors.email = "Enter a valid email address";
			}

			return errors;
		},
		save: function(options){
			var self = this;
			var verb = "post";
			var url = "api/contacts.cfm/";

			// If there is an ID do a update
			if( this.id !== "" ){
				verb = "put";
				url = url + this.id;
			}

			$.ajax({
				url: url,
				type: verb,
				dataType: "json",
				data: {
					id: self.id,
					firstName: self.firstName,
					lastName: self.lastName,
					phone: self.phone,
					email: self.email
				},
				success: function(data, textStatus, jqXHR){
					if( options.success ){
						options.success();
					}
				},
				error: function(){
					if( options.error ){
						options.error();
					}
				}
			});					
		},
		destroy: function(options){
			var self = this;
			$.ajax({
				url: "api/contacts.cfm/" + self.id,
				type: "delete",
				dataType: "json",
				success: function(data, textStatus, jqXHR){
					if( options.success ){
						options.success();
					}
				},
				error: function(){
					if( options.error ){
						options.error();
					}
				}
			});			
		},
		refresh: function(){
			var self = this;

			if( this.id && this.id !== "" ){
				$.ajax({
					url: "api/contacts.cfm/" + self.id,
					type: "get",
					dataType: "json",
					success: function(data, textStatus, jqXHR){
						self.firstName = data.FirstName;
						self.lastName = data.LastName;
						self.phone = data.phone;
						self.email = data.email;
					}
				});	
			}
		}
	};

	// ----------------------------------------------------------

	model.ContactCollection = function(){
		this.contacts = [];
	};
	model.ContactCollection.prototype = {
		fetch: function(options){
			var self = this;
			$.ajax({
				url: "api/contacts.cfm",
				type: "get",
				dataType: "json",
				success: function(data, textStatus, jqXHR){
					self.reset();

					$.each(data,function(index,contact){
						self.contacts.push( new model.Contact(
							contact.ID,
							contact.FirstName,
							contact.LastName,
							contact.Phone,
							contact.Email
						));
					});

					if( options.success ){
						options.success();
					}
				}
			});
		},
		get: function(id){
			for( var i=0; i<=this.contacts.length-1; i++ ){
				if( this.contacts[i].id == id ){ // Use == to allow type coercion
					return this.contacts[i];
				}
			}
		},
		load: function(contacts){
			this.contacts = contacts;
		},
		add: function(contact){
			this.contacts.push(contact);
		},
		contains: function(contact){
			for( var i=0; i<=this.contacts.length-1; i++ ){
				if( this.contacts[i].id === contact.id ){
					return true;
				}				
			}

			return false;
		},
		reset: function(){
			this.contacts = [];
		},
		filter: function(searchTerm){
			var self = this;

			// Return a new collection rather than updating the current collection
			var collection = new model.ContactCollection();
			
			// Split the search term into words
			searchTerm = searchTerm.split(" ");

			// Build the new collection that matches the search term
			$.each(searchTerm,function(index,value){
				if( value !== "" ){
					var wordRegex = new RegExp( value, "i" );

					self.each(function(contact){
						if( wordRegex.test(contact.firstName) || 
							wordRegex.test(contact.lastName) ){

							if( !collection.contains(contact) ){
								collection.add( contact );
							}
						}
					});
				}
			});

			return collection;
		},
		each: function(fn){
			$.each(this.contacts,function(index,value){
				fn(value);
			});
		}
	};

	// **********************************************************
	// **********************************************************
	// Views
	// **********************************************************
	// **********************************************************

	view.ContactList = function(model){
		this.model = model;
		this.template = _.template( $('#contact-list-template').html() );
		this.element = null;
	};
	view.ContactList.prototype = {	
		render: function(){
			this.element = $( this.template() );
			this.renderItems( this.model );
			this.bindEvents();
			
			return this;
		},
		renderItems: function(collection){
			var self = this;
			
			self.element.find("ul").empty();
			
			collection.each(function(contact){
				var contactListItem = new view.ContactListItem( contact ).render().element;
				self.element.find("ul").append( contactListItem );
			});

			return this;
		},
		bindEvents: function(){
			var self = this;
			
			this.element.find(".search-text").on("keyup", $.proxy(this.filter, this));

			this.element.find(".create").on("click", $.proxy(this.create, this));

			this.element.find("form").on("submit",function(event){
				event.preventDefault();
				return false;
			});

			return this;
		},
		create: function(){
			window.location = "#/contacts/new";
		},
		remove: function(){
			if( this.element ){
				this.element.remove();
			}

			return this;
		},
		reset: function(){
			this.element.find(".search-text").val("");
			this.renderItems( this.model );
			return this;
		},
		filter: function(event){
			if( event.keyCode === 13 ){
				window.location = "#/contacts/new";
			}
			if( event.keyCode === 27 ){
				this.reset();
			}
			else {
				var searchTerm = this.element.find(".search-text").val();
				if( searchTerm === "" ){
					this.reset();
				}
				else {
					var collection = this.model.filter( searchTerm );
					this.renderItems( collection );
				}
			}

			event.preventDefault();
			return false;
		}
	};

	// ----------------------------------------------------------

	view.ContactListItem = function(model){
		this.model = model;
		this.template = _.template( $('#contact-list-item-template').html() );
		this.element = null;		
	};
	view.ContactListItem.prototype = {
		render: function(){
			this.element = $( this.template( this.model ) );
			this.bindEvents();
			return this;
		},
		bindEvents: function(){
			this.element.find(".more").on("click", $.proxy(this.view, this));
		},
		view: function(event){
			var more = $(event.target);
			var details = this.element.find(".detailed");

			if( more.hasClass("detail-visible") ){
				details.fadeOut("fast");
				this.element.animate({ height: "25px" }, 500);
				more.removeClass("detail-visible");
			}
			else {
				this.element.animate({ height: "110px" }, 500, function(){
					details.fadeIn("fast");
				});				
				more.addClass("detail-visible");
			}

			event.preventDefault();
			return false;		
		}		
	};

	// ----------------------------------------------------------

	view.ContactForm = function(model){
		this.model = model;
		this.template = _.template( $('#contact-form-template').html() );
		this.element = null;
	};
	view.ContactForm.prototype = {
		render: function(){
			this.element = $( this.template( this.model ) );
			this.bindEvents();
			return this;
		},
		bindEvents: function(){
			this.element.find(".save").on("click", $.proxy(this.save, this));
			this.element.find(".cancel").on("click", $.proxy(this.cancel, this));
			this.element.find(".back").on("click", $.proxy(this.cancel, this));
		},
		remove: function(){
			if( this.element ){
				this.element.remove();
			}

			return this;
		},
		save: function(){
			var self = this;

			this.model.firstName = this.element.find(".first-name").val();
			this.model.lastName = this.element.find(".last-name").val();
			this.model.email = this.element.find(".email").val();
			this.model.phone = this.element.find(".phone").val();

			var errors = this.model.validate();

			if( errors.firstName ){
				this.model.refresh(); // Revert the changes
				alert("Please enter a valid First Name.");
			}
			else if( errors.lastName ){
				this.model.refresh(); // Revert the changes
				alert("Please enter a valid Last Name.");
			}
			else if( errors.phone ) {
				this.model.refresh(); // Revert the changes
				alert("Please enter a valid Phone Number.");
			}
			else if( errors.email ){
				this.model.refresh(); // Revert the changes
				alert("Please enter a valid Email Address.");
			}
			else {
				this.model.save({
					success: function(){
						self.remove();
						window.location = "#/contacts";
					},
					error: function(){
						// Revert the changes
						self.model.refresh();

						alert("Error saving contact.");
					}
				});
			}
		},
		cancel: function(){
			if( this.model.firstName !== this.element.find(".first-name").val() ||
				this.model.lastName !== this.element.find(".last-name").val() ||
				this.model.email !== this.element.find(".email").val() ||
				this.model.phone !== this.element.find(".phone").val() ){

				if( confirm("Are you sure you want to leave this page? You will lose any unsaved information.") ){
					this.remove();
					window.location = "#/contacts";
				}
			}
			else {
				window.location = "#/contacts";
			}
		}
	};

	// **********************************************************
	// **********************************************************
	// Controllers
	// **********************************************************
	// **********************************************************

	controller.ContactController = function(){
		this.models = {};
		this.views = {};

		// Instantiate dependencies
		this.models.contactCollection = new model.ContactCollection();
		this.views.contactForm = new view.ContactForm();
		this.views.contactList = new view.ContactList( this.models.contactCollection );
	};
	controller.ContactController.prototype = {
		list: function(){
			this.views.contactForm.remove();

			var self = this;
			this.models.contactCollection.fetch({
				success: function(){
					self.views.contactList.remove().render();

					$("#application-container").append( self.views.contactList.element );
				}
			});
		},
		create: function(){
			this.views.contactList.remove();

			this.views.contactForm.model = new model.Contact();
			this.views.contactForm.remove().render();

			$("#application-container").append( this.views.contactForm.element );
		},
		edit: function(id){
			this.views.contactList.remove();

			this.views.contactForm.model = this.models.contactCollection.get(id);
			this.views.contactForm.remove().render();

			$("#application-container").append( this.views.contactForm.element );
		},
		destroy: function(id){
			if( confirm("Are you sure you want to delete the contact?") ){
				var contact = this.models.contactCollection.get(id);
				contact.destroy({
					success: function(){
						window.location = "#/contacts";
					},
					error: function(){
						alert("There was an error while trying to delete the contact.");
					}
				});
			}
			else {
				window.location = "#/contacts";
			}
		}
	};

	// **********************************************************
	// **********************************************************
	// Router
	// **********************************************************
	// **********************************************************

	utility.Router = function(){
		var self = this;

		this.contactController = new controller.ContactController();

		this.routes = [
			{
				mapping: new RegExp("^#\/contacts\/new$","i"),
				handler: self.contactController.create
			},
			{
				mapping: new RegExp("^#\/contacts\/edit\/[0-9]+$","i"),
				parameter: new RegExp("[0-9]+$","i"),
				handler: self.contactController.edit
			},
			{
				mapping: new RegExp("^#\/contacts\/delete\/[0-9]+$","i"),
				parameter: new RegExp("[0-9]+$","i"),
				handler: self.contactController.destroy
			},
			{
				mapping: new RegExp("^#\/contacts$","i"),
				handler: self.contactController.list
			}
		];
	};
	utility.Router.prototype = {
		start: function(){
			var self = this;
			$(window).on("hashchange", $.proxy(this.route, this));
			this.route();
		},
		route: function(event){
			var hash = this.normalize( window.location.hash );

			for( var i=0; i<=this.routes.length-1; i++ ){
				var route = this.routes[i];

				// Does the route match the hash?
				if( route.mapping.test(hash) ){

					if( route.parameter && route.parameter.test(hash) ){
						route.handler.apply( this.contactController, route.parameter.exec(hash) );
					}
					else {
						route.handler.apply( this.contactController );
					}

					// Now that the route is found we no longer want to match 
					// against other routes
					break;
				}

				// No valid route found, redirect user
				if( i === this.routes.length-1 ){
					window.location = "#/contacts";
				}
			}
		},
		normalize: function(hash){
			// Strip trailing slashes
			return hash.replace( new RegExp("[\/]*$"), "" );
		}
	};

	// ----------------------------------------------------------
	// Application Startup
	// ----------------------------------------------------------

	$(document).ready(function(){
		if( window.location.hash !== "contacts" ){
			window.location = "#/contacts";
		}

		var router = new utility.Router();
		router.start();
		
		// Keep track of active ajax request are going 
		// on so the "loading" message doesn't flash
		var activeRequests = 0;

		$(".title .loading span").ajaxStart(function(){
			activeRequests = activeRequests + 1;

			if( activeRequests === 1 ){
				$(this).fadeIn("fast");
			}
		});

		$(".title .loading span").ajaxStop(function(){
			var self = this;
			activeRequests = activeRequests - 1;

			setTimeout(function(){
				if( activeRequests === 0 ){
					$(self).fadeOut("fast");
				}
			},250);
		});

	});

})(window, document, jQuery, _);