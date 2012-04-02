component extends="mxunit.framework.TestCase" {

	function testEmailGetterAndSetter(){
		expected = "foo@bar.com";
		this.object.setEmail(expected);
		actual = this.object.getEmail();
		assertEquals(expected,actual);
	}

	function testFirstNameGetterAndSetter(){
		expected = "John";
		this.object.setFirstName(expected);
		actual = this.object.getFirstName();
		assertEquals(expected,actual);
	}

	function testIDGetterAndSetter(){
		expected = 1;
		this.object.setID(expected);
		actual = this.object.getID();
		assertEquals(expected,actual);
	}

	function testLastNameGetterAndSetter(){
		expected = "Doe";
		this.object.setLastName(expected);
		actual = this.object.getLastName();
		assertEquals(expected,actual);
	}

	function testPhoneGetterAndSetter(){
		expected = "111-222-3333";
		this.object.setPhone(expected);
		actual = this.object.getPhone();
		assertEquals(expected,actual);
	}

	function testGetMemento(){
		var data = {
			firstName = "John",
			lastName = "Doe",
			phone = "111-222-3333",
			email = "john.doe@foo.com"
		};

		this.object.populate( data );
		var memento = this.object.getMemento();

		assertEquals(data.firstName, memento.firstName);
		assertEquals(data.lastName, memento.lastName);
		assertEquals(data.phone, memento.phone);
		assertEquals(data.email, memento.email);
	}

	function testPopulate(){
		var data = {
			firstName = "John",
			lastName = "Doe",
			phone = "111-222-3333",
			email = "john.doe@foo.com"
		};

		this.object.populate( data );

		assertEquals(data.firstName, this.object.getFirstName());
		assertEquals(data.lastName, this.object.getLastName());
		assertEquals(data.phone, this.object.getPhone());
		assertEquals(data.email, this.object.getEmail());
	}

	function testValidateInvalidData(){
		var invalidData = {
			firstName = "John111",
			lastName = "Doe222",
			phone = "AA",
			email = "john.doe"
		};

		this.object.populate( invalidData );

		var errors = this.object.validate();

		assertIsStruct(errors);

		assertTrue( structKeyExists(errors, "firstName") );
		assertTrue( structKeyExists(errors, "lastName") );
		assertTrue( structKeyExists(errors, "phone") );
		assertTrue( structKeyExists(errors, "email") );
	}

	function testValidateValidData(){
		var validData = {
			firstName = "John",
			lastName = "Doe",
			phone = "111-222-3333",
			email = "john.doe@foo.com"
		};

		this.object.populate( validData );

		var errors = this.object.validate();

		assertIsEmptyStruct(errors);
	}

	function testInit(){
		assertIsTypeOf( this.object.init() ,"model.Contact");		
	}	

	// Setup
	function setup(){
		this.object = new model.Contact();
	}

	function tearDown(){
	}					

}