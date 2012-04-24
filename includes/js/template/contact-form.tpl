<!-- Contact Form template -->
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