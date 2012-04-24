(function(window, document, undefined){

	"use strict";

	define([
		'jquery',
		'underscore',
		'view/ContactListItem',
		'text!template/contact-list.tpl'
		],function($,_,ContactListItem,html){
		
		var ContactList = function(model){
			this.model = model;
			this.template = _.template( html );
			this.element = null;
		};
		ContactList.prototype = {	
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
					var contactListItem = new ContactListItem( contact ).render().element;
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

		return ContactList;

	});

})(window, document);