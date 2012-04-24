(function(window, document, undefined){

	"use strict";

	define(['jquery','controller/Contact'],function($,ContactController){

		var Router = function(){
			var self = this;

			this.contactController = new ContactController();

			this.routes = [
				{
					mapping: /^#\/contacts\/new$/i,
					handler: self.contactController.create
				},
				{
					mapping: /^#\/contacts\/edit\/[0-9]+$/i,
					parameter: /[0-9]+$/i,
					handler: self.contactController.edit
				},
				{
					mapping: /^#\/contacts\/delete\/[0-9]+$/i,
					parameter: /[0-9]+$/i,
					handler: self.contactController.destroy
				},
				{
					mapping: /^#\/contacts$/i,
					handler: self.contactController.list
				}
			];
		};
		Router.prototype = {
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
		
		return Router;
	});

})(window, document);