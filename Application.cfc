component {
	this.name = hash(getCurrentTemplatePath());
	this.sessionManagement = true;
	this.sessionTimeout = createTimeSpan(0,0,30,0);
	this.setClientCookies = true;

	function onApplicationStart(){
		application.contactService = createObject("model.ContactService").init();
	}

	function onRequestStart(){
		if( structKeyExists(url,"reinit") ){
			applicationStop();
		}
	}
}