$(document).ready(function(){

	var twitterCKey = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
	var twitterCSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";

	var tumblrCKey = "dHGh4mCQc2AdnxuvwBEttGsTHh0YuM0ovYWchcLQarvKBgdrk7";
	var tumblrCSecret = "bzsR5lDUt6HETXIm4ZqmjBxwfygc3enc9ybBW226K5bGgcBwr8";

	var twitterToken = "";
	var twitterTSecret = "";

	var tumblrToken = "";
	var tumblrTSecret = "";
	
	var fbToken = "";

	//check if user has a profile
	if (window.localStorage.getItem("FLNuser") != 'yes' || window.localStorage.getItem("FLNuser") === null) {
	
	  $('#main').html("<div class='row'><div class='col-xs-2'></div><div class='col-xs-8'><a href='signup.html'><div style='font-size: 20px;font-weight: bold;width: 100%;outline:none;border:1px solid blue;' type='button' class='btn btn-lg btn-primary'><span>Sign Up</span></div></a></div><div class='col-xs-2'></div></div>");
	}
	else{
		
		if(window.localStorage['twitterIsSynced']=='yes')
		{
			twitterToken = window.localStorage['twitterToken'];
			twitterTSecret = window.localStorage['twitterTSecret'];
		}

		if(window.localStorage['tumblrIsSynced']=='yes')
		{
			tumblrToken = window.localStorage['tumblrToken'];
			tumblrTSecret = window.localStorage['tumblrTSecret'];
		}

		if(window.localStorage['fbIsSynced']=='yes')
		{
			fbToken = window.localStorage['fbToken'];
		}
	}
	

	$('#view').click(function(){

		$('#display-media').html('');

		if(window.localStorage['twitterIsSynced']=='yes')
		{
			Parse.Cloud.run('Timeline', {oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret, num: '50'}, {
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
		}

		if(window.localStorage['tumblrIsSynced']=='yes')
		{		
			Parse.Cloud.run('GetTumblrUserInfo', {oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret}, {
				success: function(result) {
					info = JSON.parse(result);

					blogname = info.response.user.blogs[0].name+".tumblr.com";


					Parse.Cloud.run('GetTumblrPosts', {oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret, bName: blogname}, {
						success: function(results) {
							results = JSON.parse(results);


							posts = results['response']['posts'];
							for(var i=0;i<posts.length;i++)
							{
								time = posts[i]['date'];
								title=posts[i]['title']?posts[i]['title']:"(No title)";
								message=posts[i]['message']?posts[i]['message']:"(No body text)";
								id = String(posts[i]['id']);

								var tumblrHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='tumblr-logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time+"</span><br/>"+title+"<br/>"+message+"</p></div><div class='col-xs-1 delete-box delete-tumblr'><input type='checkbox' name='"+id+"'/></div></div>";
								$('#display-media').append(tumblrHTML);
							}

						},
						error: function(error) {
							console.log(error);
						}
					});


				},
				error: function(error) {
					console.log(error);
				}
			});
		}


		if(window.localStorage['fbIsSynced']=='yes')
		{	

			//object likes
			var obj_likes = 'SELECT object_id FROM like WHERE user_id = me()';
			var page_likes = "select page_id, name, categories from page where page_id in (select page_id from page_fan where uid = me())";
			var url_likes = "select url from url_like where user_id = me()";

			var comments = "SELECT text, fromid FROM comment WHERE post_id IN (SELECT post_id FROM stream WHERE filter_key IN (SELECT filter_key FROM stream_filter WHERE uid=me()) AND actor_id IN (SELECT uid1 FROM friend WHERE uid2=me()) order by created_time)";

			FB.api('/fql', {q: comments, access_token: fbToken}, function(r) {
			        console.log(r)
			});

			// FB.api("/fql?q=SELECT name FROM user WHERE uid=me()&access_token="+fbToken,

			//  // 'get',
			//  // {
			//  // 	access_token: fbToken,
			//  // },
			//  function(response) {
			// 	console.log(response);
			// });

			//statuses, links, statuses tagged in
			FB.api(
				'me/feed',
				'get',
				{
					access_token : fbToken,
				},
				function(response) {
					if (!response || response.error) {
					alert('There was an error connecting to Facebook.');
					} 
					else {
						console.log(response);
						// for (var i = 0 ; i< response.data.length;i++)
						// {
						// 	time = response['data'][i]['created_time'];
						// 	title = "no title";
						// 	id = response['data'][i]['id'];
						// 	message = response['data'][i]['message'];
						// 	var FBHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='facebook-icon.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time+"</span><br/>"+title+"<br/>"+message+"</p></div><div class='col-xs-1'></div></div>";
						// 	$('#display-media').append(FBHTML);
						// }
					}

				}
			 );
		}

	});


	$('#forget').click(function(){

		var checkboxes_twitter = $('#display-media .delete-twitter input');
		if(checkboxes_twitter.length==0) finished[0]=true;

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

		var checkboxes_tumblr = $('#display-media .delete-tumblr input');

		for(var i = 0;i<checkboxes_tumblr.length;i++)
		{
			if(checkboxes_tumblr[i]['checked'])
			{
				var delete_id_tm = checkboxes_tumblr[i]['name'];

				Parse.Cloud.run('TumblrDeletePost', {id: delete_id_tm, oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret, bName: blogname}, {
					success: function(msg) {
						alert("Last night's tumblr blog never happened!");
					},
					error: function(err) {
						console.log(err);
					}
				});

			}
		}


		//while loop to refresh once all async deletes are finished

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
