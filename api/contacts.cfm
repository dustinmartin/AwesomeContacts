<cfscript>
	contentType( type="application/json" );	

	 try {

		// The ID of the contact to handle
		id = "";
		statusCode = 200;
		statusText = "OK";
		contactService = application.contactService;

		// Get the ID if one exists
		if( listLen(cgi.path_info, "/") ){
			id = trim(listGetAt(cgi.path_info,1,'/'));
		}

		// Parse the HTTP content
		params = getParsedHTTPContent();

		// Respond accordingly to each HTTP verb
		switch( cgi.request_method ){
			case "GET":
				if( id == "" ){
					contact = contactService.list();
				}
				else {
					contact = contactService.get(id);

					if( isNull(contact) ){
						throw(type="api.404");
					}
				}

				data = contact;				
				break;
			case "POST":
				if( id == "" ){
					contact = contactService.new(params);

					if( arrayLen( structKeyArray( contact.validate() ) ) ){
						data = {};
						statusCode = 400;
						statusText = "Data validation error";
					}					
					else {
						contactService.save(contact);
						data = contact;
						statusCode = 200;
						statusText = "Resource updated successfully";
					}
				}

				break;
			case "PUT":
				contact = contactService.get(id);

				if( isNull(contact) ){
					throw(type="api.404");
				}
				else {
					contact.populate(params);

					// Validate the data
					if( arrayLen( structKeyArray( contact.validate() ) ) ){
						data = {};
						statusCode = 400;
						statusText = "Data validation error";
					}					
					else {
						contactService.save(contact);
						data = {};
						statusCode = 204;
						statusText = "Resource updated successfully";
					}
				}

				break;
			case "DELETE":
				contact = contactService.get(id);

				if( isNull(contact) ){
					throw(type="api.404");
				}
				else {
					contactService.delete(contact);
					data = {};
					statusCode = 204;
					statusText = "Resource deleted successfully";
				}

				break;
			default:
				throw("Invalid HTTP request");
		}

		header( statuscode=statusCode, statustext=statusText );
	}
	catch( api.404 e){
		header( statuscode="404", statustext="Not Found" );			
		data = { "error" = "Resource not found" };
	}
	catch( any e ){
		header( statuscode="500", statustext="Internal Server Error" );	
		data = { "error" = "Internal server error" };
		rethrow;
	}

	writeOutput( serializeJSON(data) );


	// ColdFusion doesn't like to parse the content for some HTTP verbs 
	// in the same way it handle GET and POST. This function will do it
	// manually for all HTTP verbs.
	function getParsedHTTPContent(){
		var requestParams = getHTTPRequestData().content;
		var params = {};

		if( len(requestParams) ){
			var parsedRequestParams = listToArray(requestParams,"&");
			for( var parameter in parsedRequestParams ){
				if( findNoCase("=", parameter) ){
					try {
						params[ urlDecode(listGetAt(parameter,1,'=')) ] = urlDecode( listGetAt(parameter,2,'=') );
					}
					catch( any e ){
						// Silence any parsing errors
					}
				}
			}
		}

		return params;
	}
</cfscript>

<cffunction name="Header" output="false" returnType="void">
	<cfargument name="name" type="string" default="">
	<cfargument name="value" type="string" default="">
	<cfargument name="statuscode" type="string" default="">
	<cfargument name="statustext" type="string" default="">
	
	<cfif Len(name) and Len(value)>
		<cfheader name="#name#" value="#value#">
	<cfelseif Len(statuscode) and Len(statustext)>
		<cfheader statuscode="#statuscode#" statustext="#statustext#">
	</cfif>
</cffunction>

<cffunction name="ContentType" output="false" returnType="void">
	<cfargument name="deleteFile" type="boolean">
	
	<cfcontent type="#arguments.type#"/>
</cffunction>