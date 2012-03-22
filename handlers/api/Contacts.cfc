component {

	/**
	* Returns list of contacts
	* GET api/contacts
	*/
	function list(event){
		var rc = event.getCollection();
		var data = [];

		if( event.valueExists("filter") ){
			for( var contact in application.contacts ){
				if( REFindNoCase(rc.filter, contact.firstName) || REFindNoCase(rc.filter, contact.lastName)){
					arrayAppend(data,contact);
				}
			}
		}
		else {
			data = application.contacts;
		}

		event.renderData( type = "json", data = data );
	}

	/**
	* Create a new contact
	* POST api/contacts
	*/
	function create(event){
		var rc = event.getCollection();

		// Since CF doesn't handle POST requests the same as other HTTP verbs we have to
		// manually add the data to the URL/FORM/RC scope
		event.collectionAppend(deserializeJSON(toString(getHttpRequestData().content)));

		arrayAppend(application.contacts, {
			"ID" = application.contacts[ arrayLen(application.contacts) ].id + 1,
			"FirstName" = rc.firstName,
			"LastName" = rc.lastName,
			"Phone" = rc.phone,
			"Email" = rc.email
		});

		event.renderData( type = "json", data = { success = "true" } );
	}

	/**
	* Returns a single contact
	* GET api/contacts/:id
	*/
	function view(event){
		var rc = event.getCollection();
		event.renderData();
	}

	/**
	* Update a contact
	* PUT api/contacts/:id
	*/
	function update(event){
		var rc = event.getCollection();

		// Since CF doesn't handle PUT requests the same as other HTTP verbs we have to
		// manually add the data to the URL/FORM/RC scope
		event.collectionAppend(deserializeJSON(toString(getHttpRequestData().content)));

		for( var i=1; i<=arrayLen(application.contacts); i++ ){
			var contact = application.contacts[i];
			if( contact.id == rc.id ){
				application.contacts[i] = {
					"ID" = rc.id,
					"FirstName" = rc.firstName,
					"LastName" = rc.lastName,
					"Phone" = rc.phone,
					"Email" = rc.email
				};

				break;
			}
		}

		event.renderData( type = "json", data = { success = "true" } );
	}

	/**
	* Delete a contact
	* DELETE api/contacts/:id
	*/
	function remove(event){
		var rc = event.getCollection();

		var contactToDelete = 0;
		for( var i=1; i<=arrayLen(application.contacts); i++ ){
			var contact = application.contacts[i];
			if( contact.id == rc.id ){
				contactToDelete = i;
				break;
			}
		}

		arrayDeleteAt(application.contacts, contactToDelete);

		event.renderData( type = "json", data = { success = "true" } );
	}
}