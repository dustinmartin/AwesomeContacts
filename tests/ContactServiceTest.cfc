component extends="mxunit.framework.TestCase" {

	function testDelete(){
		var contact = this.object.get(1);
		assertIsTypeOf( contact ,"model.Contact");

		this.object.delete( contact );
		assertTrue( isNull(this.object.get(1)) );
	}

	function testGet(){
		var contact = this.object.get(1);
		assertIsTypeOf( contact ,"model.Contact");
	}

	function testInit(){
		assertIsTypeOf( this.object.init() ,"model.ContactService");
	}

	function testList(){
		var list = this.object.list();
		assertIsArray( list );
		assertIsTypeOf( list[1] ,"model.Contact");
	}

	function testNew(){
		assertIsTypeOf( this.object.new() ,"model.Contact");
	}

	function testSave(){
		var validData = {
			firstName = "John",
			lastName = "Doe",
			phone = "111-222-3333",
			email = "john.doe@foo.com"
		};

		var recordCount = arrayLen(this.object.list());
		var contact = this.object.new();

		contact.populate( validData );

		this.object.save( contact );

		var records = this.object.list();
		assertEquals( arrayLen(records), recordCount+1 );

		assertEquals(validData.firstName, records[recordCount+1].getFirstName());
		assertEquals(validData.lastName, records[recordCount+1].getLastName());
		assertEquals(validData.phone, records[recordCount+1].getPhone());
		assertEquals(validData.email, records[recordCount+1].getEmail());		
	}

	// Setup

	function setup(){
		this.object = new model.ContactService();
	}

	function tearDown(){
	}					

}