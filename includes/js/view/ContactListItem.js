(function(window, document, undefined){

	"use strict";

	define([
		'jquery',
		'underscore',
		'text!template/contact-list-item.tpl'
		],function($,_,html){
		
		var ContactListItem = function(model){
			this.model = model;
			this.template = _.template( html );
			this.element = null;		
		};
		ContactListItem.prototype = {
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

					console.log( this.element );
					
					this.element.animate({ height: "110px" }, 500, function(){
						details.fadeIn("fast");
					});				
					more.addClass("detail-visible");
				}

				event.preventDefault();
				return false;		
			}		
		};

		return ContactListItem;
	});

})(window, document);