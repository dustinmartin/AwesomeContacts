component {

	/**
	* Constructor
	*/
	public any function init(){

		var file = getDirectoryFromPath( getCurrentTemplatePath() ) & "../data/contacts.json";

		// Load the data
		data = deserializeJSON( fileRead( file ) );

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
	public array function list(){
		return data;
	}

	/**
	* Returns a new contact object
	*/
	public any function new(data){
		return new Contact(data);
	}

	/**
	* Gets a contact object by its ID
	*/
	public any function get(id){
		for( var contact in data ){
			if( contact.getID() == id ){
				return duplicate(contact);
			}
		}
	}

	/**
	* Saves a new contact object to the array.
	*/
	public void function save(contact){
		var id = contact.getID();
		if( isNull(id) || (isSimpleValue(id) && trim(id) == "") ){
			// Create a new contact
			if( arrayLen(data) ){
				var newID = javaCast( "string", data[ arrayLen(data) ].getID() + 1 );
			}
			else {
				var newID = 1;
			}

			contact.setID( newID );
			arrayAppend(data,contact);
		}
		else {
			// Update an existing contact
			for( var oldContact in data ){
				if( oldContact.getID() == id ){
					oldContact.populate( contact.getMemento() );
					break;
				}
			}
		}
	}

	/**
	* Deletes a contact object by its ID
	*/
	public void function delete(contact){
		var id = contact.getID();
		for( var i=1; i<=arrayLen(data); i++ ){
			if( data[i].getID() == id ){
				arrayDeleteAt(data, i);	
				break;
			}
		}	
	}
}