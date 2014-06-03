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
	  $('#main').html("<div class='row' style='padding-top:20px;'><div class='col-xs-12' style='padding-left:0px;padding-right:0px;'><a style='text-decoration:none;' href='signup.html'><div style='font-size: 40px;	font-weight: bold;width:100%; outline:none;	color:#39B3D7;	background:rgba(0,0,0,0.9);cursor:pointer;'type='button'><center>Sign Up</center></div></a></div></div>");
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
		$('#logo').html("<a href='index.html'><img style='height:120px; margin-top:15px;margin-bottom:15px;' src='flnLogo.png'/></a>");
		$('#forget center').html("<img style='height:20px;width:20px;' src='loading.gif'/>");
		$('#forget').css({"visibility":"visible"});


		var promiseQ=[];

		viewTwitter(promiseQ);

		viewTumblr(promiseQ);

		//viewFB();


		Parse.Promise.when(promiseQ).then(function(args){
			//will trigger when all promises complete
			console.log("all promises fulfilled");
		 	$('#forget center').html("Forget");

		});

	});


	$('#forget').click(function(){
		var promiseQ=[];

		$('#forget center').html("<img style='height:20px;width:20px;' src='loading.gif'/>");

		deleteTwitter(promiseQ);

		deleteTumblr(promiseQ);


		Parse.Promise.when(promiseQ).then(function(args){
			//will trigger when all promises complete
			$('#logo').html("<a href='index.html'><img style='height:120px; margin-top:15px;margin-bottom:15px;' src='fln_logo_white.png'/></a>");
			$('#display-media').html("");
			$('#LNNH').hide().html("<center><a href='index.html'><img style='height:120px; margin-top:15px;margin-bottom:15px;' src='forget.png'/></a></center>").fadeIn(2000);

		});

	});


	function viewTwitter(promises)
	{
		if(window.localStorage['twitterIsSynced']=='yes')
		{
			var twitter_promise = new Parse.Promise();
			promises.push(twitter_promise);

			Parse.Cloud.run('Timeline', {oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret, num: '50'}, {
				success: function(tweets) {
					tweets = JSON.parse(tweets);				

					for(i=0;i<tweets.length;i++)
					{
						//turn this into something better
						var time = tweets[i]['created_at'];
						
						var local_time = new Date(time);
						var local_time_new_format = local_time.toLocaleString();
						var message = tweets[i]['text'];
						var id = tweets[i]['id_str'];
						var hours = $('#time-range').val();  //change hours
						var imghtml = '';
						if(tweets[i]['entities']['media'])
						{
							imgsrc = tweets[i]['entities']['media'][0]['media_url'];
							imghtml = "<img class='pic' src='"+imgsrc+"'/><br/>";
						}

						if(inRange(tweets[i],hours))
						{
							var tweetHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='twitter_logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+remove_sec(local_time_new_format)+"</span><br/>"+imghtml+message+"</p></div><div class='col-xs-1 delete-box delete-twitter'><input type='checkbox' name='"+id+"'/></div></div>";
							$('#display-media').append(tweetHTML);
						}

				    }
				    console.log("view twitter fulfilled");
				    twitter_promise.resolve("viewTwitter finished displaying");
				},
				error: function(error) {
					alert("There was an error getting tweets.");
				}
			});
		}
	}

	function viewTumblr(promises)
	{
		if(window.localStorage['tumblrIsSynced']=='yes')
		{	
			var tumblr_promise = new Parse.Promise();
			promises.push(tumblr_promise);

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
								switch(posts[i].type){

									case 'text':
										label=posts[i].title;
										content=posts[i].body;
										break;

									case 'link':
										label=posts[i].title;
										content="<a href='"+posts[i].url+"'>"+posts[i].url+"</a>";
										break;

									case 'photo':
										label=posts[i].caption;
										content="";
										for(var j=0;j<posts[i].photos.length;j++){
											content = content.concat("<img class='pic' src='"+posts[i].photos[j].original_size.url+"'/><br/>");
										}
										break;

									case 'quote':
										label=posts[i].source;
										content='<i>"'+posts[i].text+'"</i>';
										break;

									default:
										label='(No title)';
										content='(No content)';
										break;
								}
								time = posts[i]['date'];

								id = String(posts[i]['id']);
								var hours = $('#time-range').val(); 
								var t_time=new Date(time);
								var showtime=t_time.toLocaleString();
								if(timeRange(time,hours)){
									var tumblrHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='tumblr-logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+remove_sec(showtime)+"</span><br/><b>"+label+"</b><br/>"+content+"</p></div><div class='col-xs-1 delete-box delete-tumblr'><input type='checkbox' name='"+id+"'/></div></div>";

									$('#display-media').append(tumblrHTML);						
								}

							}
							console.log("view tumblr fulfilled");
							tumblr_promise.resolve("tumblrView finished");

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
	}

	function viewFB()
	{
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

			var fb_promise = new Parse.Promise();
			promises.push(fb_promise);


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

						for(var i=0;i<response.data.length;i++)
						{
						var GMT_time =response['data'][i]['created_time'];
						
						var local_time_fb = new Date(GMT_time).toLocaleString();


						
						temp = response.data[i].story?"activity":"status";
						type = temp.charAt(0).toUpperCase() + temp.slice(1);
						body =  response.data[i].story? response.data[i].story:response.data[i].message;
						var hours = $('#time-range').val(); 
						if(fb_inrange(local_time_fb,hours)){

						var FBHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='facebook-icon.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+remove_sec(local_time_fb)+"</span><br/>"+type+"<br/>"+body+"</p></div><div class='col-xs-1'></div></div>";
									$('#display-media').append(FBHTML);						
								}

						}

						fb_promise.resolve("viewFB finished");

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
	}


	function deleteTwitter(promises)
	{
		var checkboxes_twitter = $('#display-media .delete-twitter input');

		for(var i = 0;i<checkboxes_twitter.length;i++)
		{
			(function(lockedInIndex)
			{
				var cbox = checkboxes_twitter[i];
				if(cbox['checked'])
				{
					var delete_id_tw = cbox['name'];
					var twitter_promise = new Parse.Promise();
					promises.push(twitter_promise);

			 		Parse.Cloud.run('DeleteTweet', {id : delete_id_tw, oToken : twitterToken, oKey : twitterCKey, tSec : twitterTSecret, cSec : twitterCSecret}, {
			 			success: function(results){
			 				//console.log("Tweet "+delete_id_tw+" deleted");
			 				twitter_promise.resolve("Tweet deleted");
			 			},
			 			error: function(error){
			 				alert("Failed to delete tweet "+delete_id_tw);
			 				twitter_promise.reject("Failed to delete tweet");
			 			}
			 		});
				}
			})();
		}
	}

	function deleteTumblr(promises){
		var checkboxes_tumblr = $('#display-media .delete-tumblr input');

		for(var i = 0;i<checkboxes_tumblr.length;i++)
		{
			(function(lockedInIndex){

				if(checkboxes_tumblr[i]['checked'])
				{
					var delete_id_tm = checkboxes_tumblr[i]['name'];
					var tumblr_promise = new Parse.Promise();
					promises.push(tumblr_promise);

					Parse.Cloud.run('TumblrDeletePost', {id: delete_id_tm, oToken : tumblrToken, oKey : tumblrCKey, tSec : tumblrTSecret, cSec : tumblrCSecret, bName: blogname}, {
						success: function(msg) {
							//console.log("Tumblr post "+delete_id_tm+" deleted");
							tumblr_promise.resolve("Tumblr post deleted");
						},
						error: function(err) {
							alert("Failed to delete Tumblr post "+delete_id_tm);
							tumblr_promise.reject("Could not delete Tumblr post");
						}
					});

				}
			})();
		}
	}
	function remove_sec(time){
	var pos=time.length;
	var tail=time.substr(pos-3,pos);
	var head=time.substr(0,pos-6);
	return head+tail;
	}

	function fb_inrange(fb_time,hours){
		var currentTime  = new Date();
		//console.log("now"+currentTime);		
		var sec = currentTime.valueOf();
		//console.log("tublr:"+time);
		var post_time = new Date(fb_time);

		var x_hours_beforetosec = sec - 1000*hours*60*60;
		var post_time2sec=post_time.valueOf();

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
