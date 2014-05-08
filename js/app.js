$(document).ready(function(){

   window.fbAsyncInit = function() {
     FB.init({
       appId      : '748101388568634',
       xfbml      : true,
       version    : 'v2.0'
     });
   };

   (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

	var cb = new Codebird;
	// cb.setConsumerKey("YOURKEY", "YOURSECRET");
	cb.setConsumerKey("Ku3MsRCDG1GZI2Gdb3hggjTw5", "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk");
	// cb.setToken("YOURTOKEN", "YOURTOKENSECRET");
	cb.setToken("2477479568-TGmXC5Icfc3D4o0FcRAE123jzOLjjiotstxSci8", "CpD3tJSoylobhjST78E9OW6lEdPtPg6l5KioPS378aypv");

	$('#get').click(function(){
		var tweetIDs = [];

		// get home timeline of the user
		var params = {

			count : '5'

		};
		console.log("Getting tweets...");
		cb.__call(
			"statuses_homeTimeline",
			params,
			function (results) {
				console.log(results[0]);
				for(i=0;i<results.length;i++) tweetIDs.push(results[i]['id_str']);

				// embed the tweets 
				// https://api.twitter.com/1/statuses/oembed.format
				console.log("Tweets received. Requesting embed service...");
				for(i=0;i<tweetIDs.length;i++)
				{
					params = {

						id : tweetIDs[i]

					};

					cb.__call(
						"statuses_oembed",
						params,
						function (reply) {
							display = reply['html'];
							display = display.replace("//platform.twitter.com/widgets.js","https://platform.twitter.com/widgets.js");
							$('#display-tweets').append(display);
						}
					);
				}
			}

		);

	});


	// cb.__call(
	//     "statuses_destroy_ID",
	//    {id: "463741784297046016"},
	//     function (result) {
	//       alert("destroy");
	//     }
	// );

	// cb.__call(
	//     "statuses_update",
	//     {"status": "Whohoo, I just tweeted with a new key"},
	//     function (reply) {
	//         console.log(reply);
	//     }
	// );

});