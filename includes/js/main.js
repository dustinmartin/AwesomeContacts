(function(window, document, undefined){

	"use strict";

	requirejs.config({
		paths: {
			'jquery': 'lib/jquery-1.7.2.min',
			'underscore': 'lib/underscore-1.3.1.min'
		}
	});

	define(['router'], function(Router) {

		$(document).ready(function(){
			var router = new Router();
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

	});

})(window, document);