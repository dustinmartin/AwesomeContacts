(function(window, document, undefined){
	
	"use strict";

	define([
		'model/Contact',
		'collection/Contact',
		'view/ContactForm',
		'view/ContactList'
		],function(Contact,ContactCollection,ContactForm,ContactList){

		var ContactController = function(){
			this.models = {};
			this.views = {};

			// Instantiate dependencies
			this.models.contactCollection = new ContactCollection();
			this.views.contactForm = new ContactForm();
			this.views.contactList = new ContactList( this.models.contactCollection );
		};
		ContactController.prototype = {
			list: function(){
				this.views.contactForm.remove();

				var self = this;
				this.load(function(){
					self.views.contactList.remove().render();
					$("#application-container").append( self.views.contactList.element );
				},true);
			},
			create: function(){
				this.views.contactList.remove();

				var self = this;
				this.load(function(){
					self.views.contactForm.model = new Contact();
					self.views.contactForm.remove().render();

					$("#application-container").append( self.views.contactForm.element );
				});
			},
			edit: function(id){
				this.views.contactList.remove();

				var self = this;
				this.load(function(){
					self.views.contactForm.model = self.models.contactCollection.get(id);
					self.views.contactForm.remove().render();

					$("#application-container").append( self.views.contactForm.element );
				});
			},
			destroy: function(id){
				var self = this;
				this.load(function(){
					if( confirm("Are you sure you want to delete the contact?") ){
						var contact = self.models.contactCollection.get(id);
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
				});
			},
			load: function(callback,force){
				if( !this.models.contactCollection.size() || force ){
					var self = this;
					this.models.contactCollection.fetch({
						success: function(){
							callback();
						}
					});
				}
				else {
					callback();				
				}
			}
		};

		return ContactController;
	});

})(window, document);