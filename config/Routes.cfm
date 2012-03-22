<cfscript>
	// Allow unique URL or combination of URLs, we recommend both enabled
	setUniqueURLS(false);

	// Auto reload configuration, true in dev makes sense to reload the routes on every request
	setAutoReload(false);

	// Base URL
	if( len(getSetting('AppMapping') ) lte 1){
		setBaseURL("http://#cgi.HTTP_HOST#/index.cfm");
	}
	else{
		setBaseURL("http://#cgi.HTTP_HOST#/#getSetting('AppMapping')#/index.cfm");
	}

	addRoute(
		pattern="/api/contacts/:id", 
		handler="api.Contacts",
		action={
			GET = "view",
			DELETE = "remove",
			PUT = "update"
		});

	addRoute(
		pattern="/api/contacts/", 
		handler="api.Contacts",
		action={
			GET = "list",
			POST = "create"
		});
	
	// Your Application Routes
	addRoute(pattern=":handler/:action?");
</cfscript>