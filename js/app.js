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
	


	$('#time-range').change(function(){

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
						
						var local_time = new Date(time).toString();
						time = local_time.substring(0,24)+local_time.substring(33,50);
						console.log(time);
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
								message=posts[i]['body']?posts[i]['body']:"(No body text)";
								id = String(posts[i]['id']);
								var hours = $('#time-range').val(); 
								var t_time=new Date(time);
								var showtime=t_time.toLocaleString();
								if(timeRange(time,hours)){
									var tumblrHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='tumblr-logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+showtime+"</span><br/><b>"+title+"</b><br/>"+message+"</p></div><div class='col-xs-1 delete-box delete-tumblr'><input type='checkbox' name='"+id+"'/></div></div>";
									$('#display-media').append(tumblrHTML);						
								}

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

			// may return 0 results instead of error if proper permissions are not configured
			//likes on statuses, etc.
			//must query post_id from "stream" table to get created time
			// var obj_likes = "SELECT object_id FROM like WHERE post_id='post_id' AND user_id = me()";

			// //liking bands, movies, etc
			// var page_likes = "select page_id, name from page where page_id in (select page_id from page_fan where uid = me())";
			// var url_likes = "select url from url_like where user_id = me()";
			// var comments_query = "select text from comment where fromid = me()";
			// var likes_query = "SELECT likes FROM stream WHERE source_id = me()";


			//doesn't have timestamps of object likes
			// FB.api('/fql', {q: {"query1": likes_query}, access_token: fbToken}, function(r) {
			//   console.log(r);

			// });

			//gets user permissions
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
						for(var i=0;i<response.data.length;i++)
						{
						var GMT_time =response['data'][i]['created_time'];
						console.log(GMT_time);
						var local_time_fb = new Date(GMT_time);

						//title=response[i]['Object']['title']?posts[i]['title']:"(No title)";						
						message=response['data'][i]['message'];
						console.log(message);
						id = String(response['data'][i]['id']);
						console.log(id);
						var hours = $('#time-range').val(); 
						if(fb_inrange(local_time_fb,hours)){
						var fb_html = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='facebook-icon.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+Date(time)+"</span><br/><b>"+" "+"</b><br/>"+message+"</p></div><div class='col-xs-1 delete-box delete-tumblr'><input type='checkbox' name='"+id+"'/></div></div>";
									$('#display-media').append(fb_html);						
								}
								else {
									console.log("error");
								}
						}

					}

				}
			);

			//gets page likes
			// FB.api(
			// 	'me/likes',
			// 	'get',
			// 	{
			// 		access_token : fbToken,
			// 		limit:50
			// 	},
			// 	function(response) {
			// 		if (!response || response.error) {
			// 		alert('There was an error connecting to Facebook.');
			// 		} 
			// 		else {
			// 			console.log(response);
			// 			for (var i = 0 ; i< response.data.length;i++)
			// 			{
			// 				time = response['data'][i]['created_time'];
			// 				message = "You liked the page <i>"+ response['data'][i]['name']+"</i>";
			// 				var FBHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='facebook-icon.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time+"</span><br/>"+message+"</p></div><div class='col-xs-1'></div></div>";
			// 				$('#display-media').append(FBHTML);
			// 			}
			// 		}

			// 	}
			// );

			//gets home feed
			// FB.api(
			// 	'me/feed',
			// 	'get',
			// 	{
			// 		access_token : fbToken,
			// 		limit:50
			// 	},
			// 	function(response) {
			// 		if (!response || response.error) {
			// 		alert('There was an error connecting to Facebook.');
			// 		} 
			// 		else {
			// 			//console.log(response);
			// 			for (var i = 0 ; i< response.data.length;i++)
			// 			{
			// 				temp = response.data[i].story?"activity":"status";
			// 				type = temp.charAt(0).toUpperCase() + temp.slice(1);
			// 				body =  response.data[i].story? response.data[i].story:response.data[i].message;
			// 				if(body[0]!='"')
			// 				{
			// 					time = response['data'][i]['created_time'];

			// 					var FBHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='facebook-icon.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time+"</span><br/>"+type+"<br/>"+body+"</p></div><div class='col-xs-1'></div></div>";
			// 					$('#display-media').append(FBHTML);
			// 				}
			// 			}
			// 		}

			// 	}
			// );

		}

		$('#forget').css({"visibility":"visible"});

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

	function fb_inrange(fb_time,hours){
		var currentTime  = new Date();
		//console.log("now"+currentTime);		
		var sec = currentTime.valueOf();
		//console.log("tublr:"+time);
		var post_time = new Date(fb_time);
		console.log("fb:"+post_time);
		var x_hours_beforetosec = sec - 1000*hours*60*60;
		var post_time2sec=post_time.valueOf();
		console.log(post_time2sec);
		if( post_time2sec >= x_hours_beforetosec  ) return true;
		else return false;
	}

	function timeRange(tumblr_time,hours){

		var currentTime  = new Date();
		//console.log("now"+currentTime);		
		var sec = currentTime.valueOf();
		//console.log("tublr:"+time);
		var post_time = new Date(tumblr_time);
		//console.log("tublr:"+post_time);
		var x_hours_beforetosec = sec - 1000*hours*60*60;
		var post_time2sec=post_time.valueOf();
		if( post_time2sec >= x_hours_beforetosec  ) return true;
		else return false;
	}

	//twitter
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
