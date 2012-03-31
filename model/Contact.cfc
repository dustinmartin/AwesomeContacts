component accessors="true" {

	// Properties
	property name="ID";
	property name="FirstName";
	property name="LastName";
	property name="Phone";
	property name="Email";

	function init(data){
		populate(data);
		return this;
	}

	function getMemento(){
		return deserializeJSON( serializeJSON( this ) );
	}

	function populate(data){
		for( var key in data ){
			if( structKeyExists(this, "set#key#") ){
				evaluate("set#key#( data[key] )");
			}
		}
	}
}