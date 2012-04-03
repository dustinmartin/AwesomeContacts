component extends="mxunit.framework.TestCase" {

	function GET_AllContacts(){
		var request = new http(url=this.baseURL, method="get");
		var result = request.send();
		var data = deserializeJSON(result.getPrefix().fileContent.toString());

		debug( data );

		//writeDump( result.getPrefix().responseHeader );
		//abort;

		assertEquals(200,result.getPrefix().Responseheader.Status_Code);
		assertIsArray( data );
	}

	function GET_SingleContact(){
		var request = new http(url=this.baseURL & "/1", method="get");
		var result = request.send();
		var data = deserializeJSON(result.getPrefix().fileContent.toString());

		debug( data );

		assertEquals(200,result.getPrefix().Responseheader.Status_Code);
		assertIsStruct( data );
	}

	function GET_InvalidID(){
		var request = new http(url=this.baseURL & "/99999", method="get");
		var result = request.send();
		var data = deserializeJSON(result.getPrefix().fileContent.toString());

		debug( data );

		assertEquals(404,result.getPrefix().Responseheader.Status_Code);
		assertIsStruct( data );
	}

	function POST_CreateContact(){
		var request = new http(url=this.baseURL, method="post");
		request.addParam(name="FirstName",value="John",type="formField");
		request.addParam(name="LastName",value="Doe",type="formField");
		request.addParam(name="Phone",value="111-222-3333",type="formField");
		request.addParam(name="Email",value="john.doe@foo.com",type="formField");
		var result = request.send();
		var data = deserializeJSON(result.getPrefix().fileContent.toString());

		debug( data );

		assertEquals(201,result.getPrefix().Responseheader.Status_Code);
		assertIsStruct( data );
		assertTrue( isNumeric(data.id) );
	}

	function PUT_UpdateContact(){
		var request = new http(url=this.baseURL & "/1", method="put");
		request.addParam(name="FirstName",value="John",type="formField");
		request.addParam(name="LastName",value="Doe",type="formField");
		request.addParam(name="Phone",value="111-222-3333",type="formField");
		request.addParam(name="Email",value="john.doe@foo.com",type="formField");
		var result = request.send();
		var data = result.getPrefix().fileContent.toString();

		debug( data );

		assertEquals(204,result.getPrefix().Responseheader.Status_Code);
		assertEquals( 0, len(data) );
	}

	function PUT_InvalidID(){
		var request = new http(url=this.baseURL & "/99999", method="put");
		var result = request.send();
		var data = deserializeJSON(result.getPrefix().fileContent.toString());

		debug( data );

		assertEquals(404,result.getPrefix().Responseheader.Status_Code);
		assertIsStruct( data );
	}


	function DELETE_RemoveContact(){
		// Get total number of contacts to confirm delete
		var request = new http(url=this.baseURL, method="get");
		var result = request.send();
		var expectedRecords = arrayLen(deserializeJSON(result.getPrefix().fileContent.toString()))-1;

		// Delete contact		
		var request = new http(url=this.baseURL & "/1", method="delete");
		var result = request.send();
		var data = result.getPrefix().fileContent.toString();

		debug( data );

		assertEquals(204,result.getPrefix().Responseheader.Status_Code);
		assertEquals( 0, len(data) );

		// Get total number of contacts to confirm delete
		var request = new http(url=this.baseURL, method="get");
		var result = request.send();
		var actualRecords = arrayLen(deserializeJSON(result.getPrefix().fileContent.toString()));


		assertEquals(expectedRecords,actualRecords);
	}

	function DELETE_InvalidID(){
		var request = new http(url=this.baseURL & "/99999", method="delete");
		var result = request.send();
		var data = deserializeJSON(result.getPrefix().fileContent.toString());

		debug( data );

		assertEquals(404,result.getPrefix().Responseheader.Status_Code);
		assertIsStruct( data );
	}

	function setup(){
		this.baseURL = cgi.http_host & request.appMapping & "/api/contacts.cfm";

		// Reset the data
		var request = new http(url=this.baseURL & "?reinit=1", method="get");
		var result = request.send();
	}

	function tearDown(){
	}					

}