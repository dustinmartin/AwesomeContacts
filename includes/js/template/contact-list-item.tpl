<!-- Template for the single Contact list Item view -->
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
