$(document).ready(function(){

	var twitterCKey = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
	var twitterCSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";

	var twitterToken = "2491623421-tZQwdxgn7E3Mnx2lYzTZhI8GoeIVfjJIecypdlZ";
	var twitterTSecret = "Uxe4rUQHkFbYkFDtKsb7tgOVulPJ3pbFqYvjYkQppKEzJ";
	
	// check if user has a profile
	// if (window.localStorage.getItem("FLNuser") === null) {
	//   //console.log("No FLN user on this device.");
	//   $('#main').html("<div class='row'><div class='col-xs-2'></div><div class='col-xs-8'><a href='https://www.google.com'><div style='font-size: 20px;font-weight: bold;width: 100%;outline:none;border:1px solid blue;' type='button' class='btn btn-lg btn-primary'><span>Sign Up</span></div></a></div><div class='col-xs-2'></div></div>");

	// }
	// else console.log(window.localStorage.getItem("FLNuser"));


	$('#view').click(function(){

		$('#display-media').html('');

		Parse.Cloud.run('Timeline', {oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret}, {
			success: function(tweets) {
				tweets = JSON.parse(tweets);				

				for(i=0;i<tweets.length;i++)
				{
					//turn this into something better
					var time = tweets[i]['created_at'].toString();
					time = time.substring(0,20);
					var message = tweets[i]['text'];
					var id = tweets[i]['id_str'];
					var hours = $('#time-range').val();  //change hours
					var imghtml = '';
					if(tweets[i]['entities']['media'])
					{
						imgsrc = tweets[i]['entities']['media'][0]['media_url'];
						imghtml = "<img class='twitpic' src='"+imgsrc+"'/><br/>";
					}

					if(inRange(tweets[i],hours))
					{
						var tweetHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='twitter_logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time+"</span><br/>"+imghtml+message+"</p></div><div class='col-xs-1 delete-box delete-twitter'><input type='checkbox' name='"+id+"'/></div></div>";
						$('#display-media').append(tweetHTML);
					}
			    }
			},
			error: function(error) {
				alert("There was an error getting tweets.");
			}
		});

	});


	$('#forget').click(function(){

		var checkboxes_twitter = $('#display-media .delete-twitter input');

		for(var i = 0;i<checkboxes_twitter.length;i++)
		{
			if(checkboxes_twitter[i]['checked'])
			{
				var delete_id_tw = checkboxes_twitter[i]['name'];

		 		Parse.Cloud.run('DeleteTweet', {id : delete_id_tw, oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret}, {
		 			success: function(results){

		 				alert("Last night's tweets never happened!");

		 			},
		 			error: function(error){
		 				alert("Failed to delete tweet "+delete_id_tw);
		 			}
		 		});


			}
		}

	});

	function inRange(tweet,hours){

		var currentTime  = new Date();
		
		var sec = currentTime.valueOf();
		
		var x_hours_difference = sec - last_x_hours_to_second;
		var x_hours_before = new Date(x_hours_difference);


		var time = tweet['created_at'].toString();

		var s = time.split(" ",6);

		var s3 = new Date(s[1]+" "+s[2]+", "+s[5]+" "+s[3]);
		var s4 = s3.valueOf();

		var last_x_hours_to_second = 1000*hours*60*60;
		var seconds_difference =  s4 - last_x_hours_to_second;

		var x_hour_before = new Date(seconds_difference);


		
		if( currentTime - last_x_hours_to_second < s4  ) return true;
		else return false;
	}

});
