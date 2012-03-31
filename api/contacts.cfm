<cfscript>
	 try {

		// The ID of the contact to handle
		id = "";
		contactService = application.contactService;

		if( listLen(cgi.path_info, "/") ){
			id = trim(listGetAt(cgi.path_info,1,'/'));
		}

		params = getParsedHTTPContent();

		switch( cgi.request_method ){
			case "GET":
				if( id == "" ){
					data = contactService.list();
				}
				else {
					data = contactService.get(id);

					if( isNull(data) ){
						throw(type="api.404");
					}
				}
				break;
			case "POST":
				if( id == "" ){
					contact = contactService.new(params);
					contactService.save(contact);
				}
				else {
					contact = contactService.get(id);

					if( isNull(contact) ){
						throw(type="api.404");
					}
					else {
						contact.populate(params);
					}
				}

				data = contact;
				break;
			case "PUT":
				break;
			case "DELETE":
				break;
			default:
				throw("Invalid HTTP request");
		}

		header( statuscode="200", statustext="OK" );
		contentType( type="application/json" );

		writeOutput( serializeJSON(data) );
	}
	catch( api.404 e){
		writeOutput('{"errors":["The resource you specified was not found"]}');
	}
	catch( any e ){
		writeOutput('{"errors":["An unknown error occurred."]}');
	}

	// ColdFusion doesn't like to parse the content for some HTTP verbs 
	// in the same way it handle GET and POST. This function will do it
	// manually for all verbs.
	function getParsedHTTPContent(){
		var requestParams = getHTTPRequestData().content;
		var params = {};

		if( len(requestParams) ){
			var parsedRequestParams = listToArray(requestParams,"&");

			for( var parameter in parsedRequestParams ){
				if( findNoCase("=", parameter) ){
					params[ urlDecode(listGetAt(parameter,1,'=')) ] = urlDecode( listGetAt(parameter,2,'=') );
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