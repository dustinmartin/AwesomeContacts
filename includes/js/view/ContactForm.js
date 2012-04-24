(function(window, document, undefined){

	"use strict";

	define([
		'jquery',
		'underscore',
		'text!template/contact-form.tpl'
		],function($,_,html){
		
		var ContactForm = function(model){
			this.model = model;
			this.template = _.template( html );
			this.element = null;
		};
		ContactForm.prototype = {
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

		return ContactForm;
	});

})(window, document);