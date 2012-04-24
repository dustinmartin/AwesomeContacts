(function(window, document, undefined){

	"use strict";

	define(["jquery","model/Contact"],function($,Contact){

		var ContactCollection = function(){
			this.contacts = [];
		};
		ContactCollection.prototype = {
			fetch: function(options){
				var self = this;
				$.ajax({
					url: "api/contacts.cfm",
					type: "get",
					dataType: "json",
					success: function(data, textStatus, jqXHR){
						self.reset();

						$.each(data,function(index,contact){
							self.contacts.push( new Contact(
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
					},
					error: function(){
						if( options.error ){
							options.error();
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
			size: function(){
				return this.contacts.length;
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
				var collection = new ContactCollection();
				
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

		return ContactCollection;
	});

})(window, document);