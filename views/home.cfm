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
	<div class="back">
		<a href="#contacts"><< back</a>
	</div>
	<div class="fields">
		<label for="FirstName">First Name:</label>
		<input class="first-name" type="text" value="<%= FirstName %>" />

		<label for="LastName">Last Name:</label>
		<input class="last-name" type="text" value="<%= LastName %>" />

		<label for="Phone">Phone:</label>
		<input class="phone" type="text" value="<%= Phone %>" />

		<label for="Email">Email:</label>
		<input class="email" type="text" value="<%= Email %>" />

		<div class="buttons">
			<input type="button" name="save" class="save" value="Save & Close" />
			<input type="button" name="cancel" class="cancel" value="Cancel" />
		</div>
	</div>
</script>

<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.1/underscore-min.js"></script>
<script src="/AwesomeContacts/includes/javascript/application.js"></script>