component {

	/**
	* Constructor
	*/
	function init(){
		// Load the data
		data = deserializeJSON( fileRead( expandPath("../data/contacts.json") ) );

		// Convert the data to an array of object
		for( var i=1; i<=arrayLen(data); i++ ){
			var row = data[i];

			// Cast the IDs as a string since CF likes to add
			// decimals at the end when converting to/from JSON
			row.id = javaCast("string",row.id);

			data[i] = new Contact(row);
		}

		return this;
	}

	/**
	* Returns an array of contact objects
	*/
	function list(){
		return data;
	}

	/**
	* Returns a new contact object
	*/
	function new(data){
		return new Contact(data);
	}

	/**
	* Gets a contact object by its ID
	*/
	function get(id){
		for( var contact in data ){
			if( contact.getID() == id ){
				return contact;
			}
		}
	}

	/**
	* Saves a new contact object to the array.
	*/
	function save(contact){
		var id = contact.getID();
		if( isNull(id) || (isSimpleValue(id) && trim(id) != "") ){
			contact.setID( javaCast( "string", data[ arrayLen(data) ].getID() + 1 ) );
			arrayAppend(data,contact);
		}
	}

	/**
	* Deletes a contact object by its ID
	*/
	function delete(contact){
		var id = contact.getID();
		for( var i=1; i<=arrayLen(data); i++ ){
			if( data[i].getID() == id ){
				arrayDeleteAt(data, i);	
				break;
			}
		}	
	}
}