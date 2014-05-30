$(document).ready(function(){

	var twitterCKey = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
	var twitterCSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";

	var tumblrCKey = "dHGh4mCQc2AdnxuvwBEttGsTHh0YuM0ovYWchcLQarvKBgdrk7";
	var tumblrCSecret = "bzsR5lDUt6HETXIm4ZqmjBxwfygc3enc9ybBW226K5bGgcBwr8";

	var twitterToken = "2491623421-tZQwdxgn7E3Mnx2lYzTZhI8GoeIVfjJIecypdlZ";
	var twitterTSecret = "Uxe4rUQHkFbYkFDtKsb7tgOVulPJ3pbFqYvjYkQppKEzJ";

	var tumblrToken = "b0iM33OcSdxBhZUZL2D3deJjktF4apxoGuXOjB85oGDzUMe4dU";
	var tumblrTSecret = "e3VliuVgSBefdxglKKfpvBbcrqigIW4TSadcyCPJnonPRz3mLz";
	
	$('#time-range').change(function(){

		$('#display-media').html('');
		$('#logo').html("<img style='height:120px; margin-top:15px;margin-bottom:15px;' src='flnLogo.png'/>");


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
							imghtml = "<img class='pic' src='"+imgsrc+"'/><br/>";
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

								if(timeRange(time,hours)){
									var tumblrHTML = "<div class='row' ><div class='col-xs-2 logo'><img class='logo_tw' src='tumblr-logo.png'/></div><div class='col-xs-9 message'><p><span class='time-tw'>"+time+"</span><br/><b>"+label+"</b><br/>"+content+"</p></div><div class='col-xs-1 delete-box delete-tumblr'><input type='checkbox' name='"+id+"'/></div></div>";
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

	function timeRange(tumblr_time,hours){

		var currentTime  = new Date();	
		var sec = currentTime.valueOf();
		var post_time = new Date(tumblr_time);
		var x_hours_beforetosec = sec - 1000*hours*60*60;
		var post_time2sec=post_time.valueOf();
		if( post_time2sec >= x_hours_beforetosec  ) return true;
		else return false;
	}

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
