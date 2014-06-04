$(document).ready(function(){

	var twitterCKey = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
	var twitterCSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";

	var tumblrCKey = "dHGh4mCQc2AdnxuvwBEttGsTHh0YuM0ovYWchcLQarvKBgdrk7";
	var tumblrCSecret = "bzsR5lDUt6HETXIm4ZqmjBxwfygc3enc9ybBW226K5bGgcBwr8";

	var twitterToken = "2491623421-tZQwdxgn7E3Mnx2lYzTZhI8GoeIVfjJIecypdlZ";
	var twitterTSecret = "Uxe4rUQHkFbYkFDtKsb7tgOVulPJ3pbFqYvjYkQppKEzJ";

	var tumblrToken = "b0iM33OcSdxBhZUZL2D3deJjktF4apxoGuXOjB85oGDzUMe4dU";
	var tumblrTSecret = "e3VliuVgSBefdxglKKfpvBbcrqigIW4TSadcyCPJnonPRz3mLz";
	
	var fbToken = "CAAGq4S8DgZBwBAPWf9PvpTKZA1n34q2217EZCnFP6aFrw8m1YxlyjrWpijia86HeUm1rSBpEjEjJGJ4eZAzYaeUy4PnrHYBlM7ieUBZACYK5jh3xSlRUqIfNnqxj5LzzNIyVNwZAT6XoWYerOp16vH9ZCxsKU11FHGOsX3nPkpioNqvhuKFGWm7";

	$('#time-range').change(function(){

		$('#display-media').html('');
		$('#logo').html("<a href='index.html'><img style='height:120px; margin-top:15px;margin-bottom:15px;' src='flnLogo.png'/></a>");
		$('#forget center').html("<img style='height:20px;width:20px;' src='loading.gif'/>");
		$('#forget').css({"visibility":"visible"});


		var promiseQ=[];

		viewTwitter(promiseQ);

		viewTumblr(promiseQ);

		viewFB(promiseQ);


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
						var tweetHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='twitter_logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time_format(local_time)+"</span><br/>"+imghtml+message+"</p></div><div class='col-xs-1 delete-box delete-twitter'><input type='checkbox' name='"+id+"'/></div></div>";
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

	function viewTumblr(promises)
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
						console.log("Got results from tumblr");
						console.log(results);

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
							//var t_time = new Date(time); invalid

							if(timeRange(time,hours)){
								console.log("should be printing tumblr post");
								var tumblrHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='tumblr-logo.png'/></div><div class='col-xs-9 message'><p style='margin-bottom:0px;'><span class='time-tw'>"+time+"</span><br/><b>"+label+"</b><br/>"+content+"</p></div><div class='col-xs-1 delete-box delete-tumblr'><input type='checkbox' name='"+id+"'/></div></div>";

								$('#display-media').append(tumblrHTML);						
							}
							else console.log("tumblr post outside time range");

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

	function viewFB(promises)
	{
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
					console.log("Got response from FB");
					console.log(response);

					for(var i=0;i<response.data.length;i++)
					{
						var GMT_time =response['data'][i]['created_time'];
						
						var local_time_fb = new Date(GMT_time);

						temp = response.data[i].story?"activity":"status";
						type = temp.charAt(0).toUpperCase() + temp.slice(1);
						body =  response.data[i].story? response.data[i].story:response.data[i].message;
						var hours = $('#time-range').val(); 

						if(fb_inrange(local_time_fb,hours))
						{
							console.log("should be printing fb post");

							var FBHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='facebook-icon.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time_format(local_time_fb)+"</span><br/><i>"+type+"</i><br/>"+body+"</p></div><div class='col-xs-1'></div></div>";
									$('#display-media').append(FBHTML);						
						}
						else console.log("fb posts outside time range");

					}

					fb_promise.resolve("viewFB finished");

				}

			}
		);		
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

	function time_format(time){
		var t=time.toLocaleTimeString();
		var pos=t.length;
		var tail=t.substr(pos-3,pos);
		var head=t.substr(0,pos-6);
		return num_to_weekdayName(time.getDay())+", "+num_to_monthName(time.getMonth())+" "+time.getDate()+" "
		+head+tail;
		//var hour=hour_format(time);
		//return num_to_weekdayName(time.getDay())+", "+num_to_monthName(time.getMonth())+" "+time.getDate()+" "
		//+hour[0]+":"+time.getMinutes()+" "+hour[1];

	}
	function hour_format(time){
		var h=time.getHours();
		var amOrpm="AM";
		if(h==0){
			h=12;
		} else if(h==12){
			amOrpm="PM";
		} else if(h>12){
			h-=12;
			amOrpm="PM";
		}
		return [h,amOrpm];
	}
	function num_to_monthName(num){
		var shortName=["Jan", "Feb", "Mar",
		"Apr", "May", "Jun",
		"Jul", "Aug", "Sep",
		"Oct", "Nov", "Dec"];
		return shortName[num];
	}
	function num_to_weekdayName(num){
		var weekdayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Satday"];
		return weekdayName[num];
	}

	function fb_inrange(fb_time,hours){
		var currentTime  = new Date();
		console.log("Current time FB: "+ currentTime);
	
		var sec = currentTime.valueOf();

		var arr = fb_time.split(/[- :]/);
    	var post_time = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);

		//var post_time = new Date(fb_time);
		console.log("FB post time: "+post_time);

		var x_hours_beforetosec = sec - 1000*hours*60*60;
		var post_time2sec=post_time.valueOf();

		if( post_time2sec >= x_hours_beforetosec  ) return true;
		else return false;
	}

	function timeRange(tumblr_time,hours){

		var currentTime  = new Date();
		var sec = currentTime.valueOf();

		console.log("Tumblr's time format: "+tumblr_time);

		var arr = tumblr_time.split(/[- :]/);
    	var post_time = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);

		//var post_time = new Date(tumblr_time);
		console.log("Tumblr post_time: "+post_time);

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
		console.log("Twitter's time format: "+ time);

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
