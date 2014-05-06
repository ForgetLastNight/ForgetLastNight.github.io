$(document).ready(function(){
	
	$('#forget').click(function(){

		message = prompt("Enter tweet here");

		Parse.Cloud.run('ShareToTwitter',{tweet: message}, {
		  success: function(result) {
		    alert("Success!");
		  },
		  error: function(error) {
		  }
		});

	});


	



});