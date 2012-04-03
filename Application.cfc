component {
	this.name = hash(getCurrentTemplatePath());
	this.sessionManagement = true;
	this.sessionTimeout = createTimeSpan(0,0,30,0);
	this.setClientCookies = true;
	this.mappings["/model"] = getDirectoryFromPath( getCurrentTemplatePath() ) & "model";

	function onApplicationStart(){
		application.contactService = new model.ContactService();
	}

	function onRequestStart(){
		if( structKeyExists(url,"reinit") ){
			application.contactService = new model.ContactService();
		}
	}
}