<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Awesome Contacts Plus: Now With More Awesome</title>
		<link rel="stylesheet" href="includes/styles/reset.css">
		<link rel="stylesheet" href="includes/styles/app.css">
		<!--[if lt IE 9]>
		<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
	</head>
	<body>
		<!-- Container for the application -->
		<div id="application-container">
			<div class="title">
				<h1>
					<a href="#/contacts">
						<span>awesome</span>contacts<span>++</span>
					</a>
				</h1>
				<span class="subtitle">tons more awesome</span>
				<div class="loading">
					<span>Loading...</span>
				</div>
			</div>
		</div>

		<!-- Template for the Contact List view -->
		<script type="text/template" id="contact-list-template">
			<div id="list">
				<form name="searchbox" id="search-box">
					<label for='search'>Search:</label>
					<input name='search' type='text' class="search-text" />
					<input name='create' type='button' class="create" value='Create' />
				</form>
				<ul>
				</ul>
			</div>
		</script>

		<!-- Template for the single Contact list Item view -->
		<script type="text/template" id="contact-list-item-template">
			<li class="contact">
				<div class="simple">
					<a class="name"><%= firstName %> <%= lastName %></a>
				</div>
				<div class="actions">
					<a class="more" href="#">More</a> |
					<a class="edit" href="#/contacts/edit/<%= id %>">Edit</a> |
					<a class="delete" href="#/contacts/delete/<%= id %>">Delete</a>
				</div>
				<div class="detailed hidden clear">
					<div class="photo">
						<img src="http://placehold.it/75x75">
					</div>
					<div class="text">
						<div class="name"><%= firstName %> <%= lastName %></div>
						<div class="phone"><%= phone %></div>
						<div class="email"><%= email %></div>
					</div>
				</div>
			</li>
		</script>

		<!-- Contact Form template -->
		<script type="text/template" id="contact-form-template">
			<form name="ContactForm" class="edit">
				<div class="back">
					<a href="#/contacts"><< back</a>
				</div>
				<div class="fields">
					<label for="FirstName">First Name:</label>
					<input name="FirstName" class="first-name" type="text" value="<%= firstName %>" />

					<label for="LastName">Last Name:</label>
					<input name="LastName" class="last-name" type="text" value="<%= lastName %>" />

					<label for="Phone">Phone:</label>
					<input name="Phone" class="phone" type="text" value="<%= phone %>" />

					<label for="Email">Email:</label>
					<input name="Email" class="email" type="text" value="<%= email %>" />

					<div class="buttons">
						<input type="button" name="Save" class="save" value="Save & Close" />
						<input type="button" name="Cancel" class="cancel" value="Cancel" />
					</div>
				</div>
			</form>
		</script>

		<cfoutput>
		<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.1/underscore-min.js"></script>
		<script src="includes/javascript/application.js?i=#createUUID()#"></script>
		</cfoutput>
	</body>
</html>