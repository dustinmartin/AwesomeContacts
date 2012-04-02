component accessors="true" {

	// Properties
	property name="ID";
	property name="FirstName";
	property name="LastName";
	property name="Phone";
	property name="Email";

	function init(struct data={}){
		if( structKeyExists(arguments,"data") ){
			populate(data);
		}

		return this;
	}

	function getMemento(){
		return deserializeJSON( serializeJSON( this ) );
	}

	function validate(){
		// Some *extremely naive* regexes for validation.
		// These should be replaced by something much more thorough later		
		var phoneRegex = "^(1-)?[0-9]{3}(\s|\.|-){1}[0-9]{3}(-|\.){1}[0-9]{4}$";
		var emailRegex = "^[a-zA-Z0-9-_\.]+@[a-zA-Z0-9-_\.]+";
		var nameRegex = "^[a-zA-Z- ]+$";
		var errors = {};

		if( isNull(firstName) || !arrayLen( reMatch(nameRegex, firstName) ) ){
			errors["FirstName"] = "Enter a valid first name";
		}

		if( isNull(lastName) || !arrayLen( reMatch(nameRegex, lastName) ) ){
			errors["LastName"] = "Enter a valid last name";
		}

		if( isNull(phone) || !arrayLen( reMatch(phoneRegex, phone) ) ){
			errors["Phone"] = "Enter a valid phone number";
		}

		if( isNull(email) || !arrayLen( reMatch(emailRegex, email ) ) ){
			errors["Email"] = "Enter a valid email address";
		}

		return errors;
	}

	function populate(data){
		for( var key in data ){
			if( structKeyExists(this, "set#key#") ){
				evaluate("set#key#( data[key] )");
			}
		}
	}
}