component {
	this.name = hash(getCurrentTemplatePath());
	this.sessionManagement = true;
	this.sessionTimeout = createTimeSpan(0,0,1,0);
	this.setClientCookies = true;
	this.mappings["/model"] = expandPath('../model');
	this.mappings["/tests"] = expandPath('../tests');

	function onRequestStart(){
		request.appMapping = "/AwesomeContacts";
	}
}