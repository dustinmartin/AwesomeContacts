(function(window, document, $, undefined){

	var appRoot = "/AwesomeContacts/";
	var model = {};
	var view = {};
	var controller = {};
	var router = undefined;

	function url(url){
		return appRoot + url;
	}

	// ----------------------------------------------------------------
	//   MODELS
	// ----------------------------------------------------------------

	// Model: Contact
	model.Contact = Backbone.Model.extend({
		urlRoot:  url("index.cfm/api/contacts"),
		idAttribute: "ID",
		defaults: {
			ID: null,
			FirstName: "",
			LastName: "",
			Phone: "",
			Email: ""
		}	
	});


	// Collection: Contact
	model.ContactList = Backbone.Collection.extend({
		model: model.Contact,
		url: url("index.cfm/api/contacts")
	});


	// ----------------------------------------------------------------
	//   VIEWS
	// ----------------------------------------------------------------

	// View: Contact List
	view.ContactList = Backbone.View.extend({
		tagName: "div",
		id: "list",
		template: _.template( $('#list-template').html() ),
		events: {
			"keyup .search-text": "search",
			"click .create": "create"
		},

		initialize: function(){
			return this;
		},

		render: function(){
			this.$el.html( this.template({ contacts: this.model.toJSON() }) );

			this.renderItems();
		
			this.$el.appendTo("#application-container");
			return this;
		},

		renderItems: function(){
			this.$el.find("ul").empty();

			this.model.each(function(contact){
				this.$el.find("ul").append( new view.Contact({ model: contact }).render().el );
			}, this);
		},

		create: function(){
			router.navigate("new", {trigger: true});
		},

		close: function(callback){
			this.$el.fadeOut("fast",callback);
		},

		open: function(){
			this.$el.fadeIn("fast");
		},

		search: function(){
			var self = this;

			if( event.keyCode == 13 ){
				router.navigate("new", {trigger: true});
			}	
			else {
				this.model.fetch({
					data: {
						filter: this.$el.find(".search-text").val()
					},
					success: function(){
						self.renderItems();
					}
				});
			}
		}		
	});


	// View: Contact
	view.Contact = Backbone.View.extend({
		tagName: "li",
		className: "contact",
		template: _.template( $('#contact-template').html() ),
		events: {
			"click .more": "view"
		},

		initialize:function () {
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.destroy, this);
		},

		render: function(){
			this.$el.html( this.template(this.model.toJSON()) );
			return this;
		},

		destroy: function(){
			this.$el.off();
			this.$el.remove();
		},

		view: function(event){
			var more = $(event.target);
			var details = this.$el.find(".detailed");

			if( more.hasClass("detail-visible") ){
				details.fadeOut("fast");
				this.$el.animate({ height: "25px" }, 500);
				more.removeClass("detail-visible")
			}
			else {
				this.$el.animate({ height: "110px" }, 500, function(){
					details.fadeIn("fast");
				});				
				more.addClass("detail-visible")
			}

			event.preventDefault();
			return false;
		},
	});

	// View: Edit Contact
	view.ContactEdit = Backbone.View.extend({
		tagName: "form",
		className: "edit",
		template: _.template( $('#contact-edit-template').html() ),
		events: {
			"click .save" : "save",
			"click .cancel" : "cancel",
			"click .back" : "cancel"
		},

		initialize: function(){
			this.render();
		},

		render: function(){
			this.$el.
				html( this.template(this.model.toJSON()) ).
				appendTo("#application-container");
		},

		save: function(){
			var self = this;
			this.model.save({
				FirstName: this.$el.find(".first-name").val(),
				LastName: this.$el.find(".last-name").val(),
				Email: this.$el.find(".email").val(),
				Phone: this.$el.find(".phone").val()
			},{
				wait: true,
				success: function(){
					self.remove();
					router.navigate("contacts", {trigger: true});
				},
				error: function(){
					alert("Error saving contact.");
				}
			});
		},

		cancel: function(){
			if( confirm("Are you sure you want to leave this page? You will lose any unsaved information.") ){
				this.remove();
				router.navigate("contacts", {trigger: true});
			}
		}
	});

	// ----------------------------------------------------------------
	//   CONTROLLER
	// ----------------------------------------------------------------

	// Controller
	controller.ApplicationRouter = Backbone.Router.extend({

		routes:{
			"": "list",
			"/": "list",
			"new": "create",
			"contacts": "list",
			"contacts/edit/:id": "edit",
			"contacts/delete/:id": "destroy"
		},

		initialize: function(){
			var self = this;

			this.model = {};
			this.view = {};

			// Create the contact list model
			this.model.contactList = new model.ContactList();
			
			// Create the list view and load the model into it
			this.view.contactList = new view.ContactList({ model: this.model.contactList });

			return this;
		},

		create: function(){
			var self = this;
			self.view.contactList.close(function(){
				self.load(function(){
					var contact = new model.Contact();
					self.view.contactEdit = new view.ContactEdit({ model: contact });
				});
			});			
		},

		list: function() {
			var self = this;
			if( self.view.contactEdit ){
				self.view.contactEdit.$el.remove();
			}

			this.load(function(){
				self.view.contactList.render();
				self.view.contactList.open();
			},true);
		},

		edit: function(id){
			var self = this;
			self.view.contactList.close(function(){
				self.load(function(){
					var contact = self.model.contactList.get(id);
					self.view.contactEdit = new view.ContactEdit({ model: contact });
				});
			});
		},

		destroy: function(id){
			var self = this;

			if( confirm("Are you sure you want to delete the contact?") ){
				var contact = self.model.contactList.get(id);

				contact.destroy({
					wait: true,
					success: function(){
						router.navigate("contacts", {trigger: true});
					},
					error: function(){
						alert("There was an error while trying to delete the contact.")
					}
				});
			}
		},

		load: function(callback,force){
			if( !this.model.contactList.models.length || force ){
				this.model.contactList.fetch({
					success: function(collection,response){
						callback();
					},
					error: function(collection, response){
						alert("The contacts could not be loaded from the server.");	
					}
				});	
			}
			else {
				callback();
			}
		}

	});
	
	$(document).ready(function(){
		
		// Keep track of how many ajax request are going on so the
		// "loading" message doesn't flash
		var activeRequests = 0;

		$(".title .loading span").ajaxStart(function(){
			activeRequests = activeRequests + 1;

			if( activeRequests == 1 ){
				$(this).fadeIn("fast");
			}
		});

		$(".title .loading span").ajaxStop(function(){
			var self = this;
			activeRequests = activeRequests - 1;

			setTimeout(function(){
				if( activeRequests == 0 ){
					$(self).fadeOut("fast");
				}
			},250);
		});

		// Start the application
		router = new controller.ApplicationRouter();
		Backbone.history.start();		
	});

})(window, document, jQuery);