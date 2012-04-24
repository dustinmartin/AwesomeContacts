(function(window, document, undefined){

	"use strict";

	define(['jquery'],function($){

		var Contact = function(id, firstName, lastName, phone, email){
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
		Contact.prototype = {
			validate: function(){
				var errors = {};

				// Some *extremely naive* regexes for validation.
				// These should be replaced by something much more thorough later
				var phoneRegex = /^(1-)?[0-9]{3}(\s|\.|\-){1}[0-9]{3}(\-|\.){1}[0-9]{4}$/;
				var emailRegex = /^[a-zA-Z0-9\-_\.]+@[a-zA-Z0-9\-_\.]+/;
				var nameRegex = /^[a-zA-Z\- ]+$/;

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

		return Contact;

	});

})(window, document);