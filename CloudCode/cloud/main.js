// Use Parse.Cloud.define to define as many cloud functions as you want.

var oauth = require('cloud/oauth.js');
var sha = require('cloud/sha1.js');


Parse.Cloud.define("ShareToTwitter", function(request, response){
    var urlLink = 'https://api.twitter.com/1.1/statuses/update.json';

    var postSummary=request.params.tweet;
    var status = oauth.percentEncode(postSummary);
    var consumerSecret = "N4BpOKkuOvP2vMbGnw6jXjCbgdqwghblQglryFigbN3Y89dWSY";
    var tokenSecret = "9rYhMNnBZNHNUdKnzEB6yLy5LCBEPTryfGvdpIYkd6ncI";
    var oauth_consumer_key = "6QMz8aPAbzNw3XrLwTmaWaOMW";
    var oauth_token = "2477479568-baSd4MdKrVH61jtmywgxympwqYO2b17jIiAWY70";

    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var accessor = {"consumerSecret" : consumerSecret, "tokenSecret":tokenSecret};
    var message = {"method" : "POST", "action": urlLink, "parameters":oauth.decodeForm("status="+status)};
    message.parameters.push(["oauth_version","1.0"]);
    message.parameters.push(["oauth_consumer_key", oauth_consumer_key]);
    message.parameters.push(["oauth_token", oauth_token]);
    message.parameters.push(["oauth_timestamp",timestamp]);
    message.parameters.push(["oauth_nonce", nonce]);
    message.parameters.push(["oauth_signature_method", "HMAC-SHA1"]);

    //lets create signature
    oauth.SignatureMethod.sign(message, accessor);
    var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
    console.log("Normalized Parameters: "+normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    console.log("BaseString: "+baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature")+"=";
    console.log("Non-Encode Signature: "+sig);
    var encodedSig=oauth.percentEncode(sig); //finally you got oauth signature
    console.log("Encoded Signature: "+encodedSig);

    Parse.Cloud.httpRequest({
        method: 'POST',
        url: urlLink,
        headers: {
            "Authorization": 'OAuth oauth_consumer_key='+oauth_consumer_key+', oauth_nonce='+nonce+', oauth_signature='+encodedSig+', oauth_signature_method="HMAC-SHA1", oauth_timestamp='+timestamp+',oauth_token='+oauth_token+', oauth_version="1.0"'
        },
        body: {
         "status" : postSummary,      
        },
        success: function(httpResponse) {
         response.success(httpResponse.text);
        },
        error: function(httpResponse) {
            response.error('Request failed with response' + httpResponse.status + "and the tweet is "+request.params.tweet);
        }
    });
});


Parse.Cloud.define("Timeline", function(request, response) {
    var urlLink = 'https://api.twitter.com/1.1/statuses/home_timeline.json';

    var consumerSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";
    var tokenSecret = "CpD3tJSoylobhjST78E9OW6lEdPtPg6l5KioPS378aypv";
    var oauth_consumer_key = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
    var oauth_token = "2477479568-TGmXC5Icfc3D4o0FcRAE123jzOLjjiotstxSci8";

    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var accessor = {
        "consumerSecret": consumerSecret,
        "tokenSecret": tokenSecret
    };


    var params = {
        "oauth_version": "1.0",
        "oauth_consumer_key": oauth_consumer_key,
        "oauth_token": oauth_token,
        "oauth_timestamp": timestamp,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1"
    };
    var message = {
        "method": "GET",
        "action": urlLink,
        "parameters": params
    };


    //lets create signature
    oauth.SignatureMethod.sign(message, accessor);
    var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
    console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    console.log("Encoded Signature: " + encodedSig);

    Parse.Cloud.httpRequest({
        method: 'GET',
        url: urlLink,
        headers: {
            "Authorization": 'OAuth oauth_consumer_key='+oauth_consumer_key+', oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token='+oauth_token+', oauth_version="1.0"'
        },
        body: {
        },
        success: function(httpResponse) {
            response.success(httpResponse.text);
        },
        error: function(httpResponse) {
            response.error('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
        }
    });
});

Parse.Cloud.define("DeleteTweet", function(request, response) {
    var urlLink = 'https://api.twitter.com/1.1/statuses/destroy/'+request.params.id+'.json';

    var consumerSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";
    var tokenSecret = "CpD3tJSoylobhjST78E9OW6lEdPtPg6l5KioPS378aypv";
    var oauth_consumer_key = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
    var oauth_token = "2477479568-TGmXC5Icfc3D4o0FcRAE123jzOLjjiotstxSci8";

    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var accessor = {
        "consumerSecret": consumerSecret,
        "tokenSecret": tokenSecret
    };


    var params = {
        "oauth_version": "1.0",
        "oauth_consumer_key": oauth_consumer_key,
        "oauth_token": oauth_token,
        "oauth_timestamp": timestamp,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1"
    };
    var message = {
        "method": "POST",
        "action": urlLink,
        "parameters": params
    };


    //lets create signature
    oauth.SignatureMethod.sign(message, accessor);
    var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
    console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    console.log("Encoded Signature: " + encodedSig);

    Parse.Cloud.httpRequest({
        method: 'POST',
        url: urlLink,
        headers: {
            "Authorization": 'OAuth oauth_consumer_key='+oauth_consumer_key+', oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token='+oauth_token+', oauth_version="1.0"'
        },
        body: {
        },
        success: function(httpResponse) {
            response.success(httpResponse.text);
        },
        error: function(httpResponse) {
            response.error('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
        }
    });
});

Parse.Cloud.define("Embed", function(request, response) {
    var urlLink = 'https://api.twitter.com/1/statuses/oembed/'+request.params.id+'.format';

    var consumerSecret = "8HHQZhecyFPrPcmHbQ5AGh174WXx8eDo0irkdLqwaQxaYHLirk";
    var tokenSecret = "CpD3tJSoylobhjST78E9OW6lEdPtPg6l5KioPS378aypv";
    var oauth_consumer_key = "Ku3MsRCDG1GZI2Gdb3hggjTw5";
    var oauth_token = "2477479568-TGmXC5Icfc3D4o0FcRAE123jzOLjjiotstxSci8";

    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var accessor = {
        "consumerSecret": consumerSecret,
        "tokenSecret": tokenSecret
    };


    var params = {
        "oauth_version": "1.0",
        "oauth_consumer_key": oauth_consumer_key,
        "oauth_token": oauth_token,
        "oauth_timestamp": timestamp,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1",
    };
    var message = {
        "method": "GET",
        "action": urlLink,
        "parameters": params
    };


    //lets create signature
    oauth.SignatureMethod.sign(message, accessor);
    var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
    console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    console.log("Encoded Signature: " + encodedSig);

    Parse.Cloud.httpRequest({
        method: 'GET',
        url: urlLink,
        headers: {
            "Authorization": 'OAuth oauth_consumer_key='+oauth_consumer_key+', oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token='+oauth_token+', oauth_version="1.0"'
        },
        body: {
        },
        success: function(httpResponse) {
            response.success(httpResponse.text);
        },
        error: function(httpResponse) {
            response.error('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
        }
    });
});