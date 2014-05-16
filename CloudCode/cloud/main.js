// Use Parse.Cloud.define to define as many cloud functions as you want.

var oauth = require('cloud/oauth.js');
var sha = require('cloud/sha1.js');

Parse.Cloud.define("Timeline", function(request, response) {
    var urlLink = 'https://api.twitter.com/1.1/statuses/user_timeline.json';

    var consumerSecret = request.params.cSec;
    var tokenSecret = request.params.tSec;
    var oauth_consumer_key = request.params.oKey;
    var oauth_token = request.params.oToken;

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
            response.error(httpResponse);
        }
    });
});



Parse.Cloud.define("DeleteTweet", function(request, response) {
    var urlLink = 'https://api.twitter.com/1.1/statuses/destroy/'+request.params.id+'.json';

    var consumerSecret = request.params.cSec;
    var tokenSecret = request.params.tSec;
    var oauth_consumer_key = request.params.oKey;
    var oauth_token = request.params.oToken;

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


Parse.Cloud.define("TwitterRequestToken", function(request, response) {
    var urlLink = 'https://api.twitter.com/oauth/request_token';

    var consumerSecret = request.params.cSec;

    var oauth_consumer_key = request.params.oKey;

    var oauth_callback = request.params.oCall;


    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var accessor = {
        "consumerSecret": consumerSecret
    };


    var params = {
        "oauth_version": "1.0",
        "oauth_consumer_key": oauth_consumer_key,
        "oauth_timestamp": timestamp,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_callback": oauth_callback
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
            "Authorization": 'OAuth oauth_consumer_key='+oauth_consumer_key+', oauth_callback=' + oauth_callback + ', oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ', oauth_version="1.0"'
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

Parse.Cloud.define("TwitterAccessToken", function(request, response) {
    var urlLink = 'https://api.twitter.com/oauth/access_token';

    var consumerSecret = request.params.cSec;
    var tokenSecret = request.params.tSec;
    var oauth_consumer_key = request.params.oKey;
    var oauth_token = request.params.oToken;
    var oauth_verifier = request.params.oVer;

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
        "oauth_verifier" : oauth_verifier
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
            "Authorization": 'OAuth oauth_consumer_key='+oauth_consumer_key+', oauth_nonce=' + nonce + ', oauth_verifier=' + oauth_verifier + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token='+oauth_token+', oauth_version="1.0"'
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

// Parse.Cloud.define("Authorize", function(request, response) {
//     var urlLink = 'https://api.twitter.com/oauth/authorize';

//     var consumerSecret = request.params.cSec;
//     var tokenSecret = request.params.tSec;
//     var oauth_consumer_key = request.params.oKey;
//     var oauth_token = request.params.oToken;

//     var nonce = oauth.nonce(32);
//     var ts = Math.floor(new Date().getTime() / 1000);
//     var timestamp = ts.toString();

//     var accessor = {
//         "consumerSecret": consumerSecret,
//         "tokenSecret": tokenSecret
//     };


//     var params = {
//         "oauth_version": "1.0",
//         "oauth_consumer_key": oauth_consumer_key,
//         "oauth_token": oauth_token,
//         "oauth_timestamp": timestamp,
//         "oauth_nonce": nonce,
//         "oauth_signature_method": "HMAC-SHA1"
//     };
//     var message = {
//         "method": "GET",
//         "action": urlLink,
//         "parameters": params
//     };


//     //lets create signature
//     oauth.SignatureMethod.sign(message, accessor);
//     var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
//     console.log("Normalized Parameters: " + normPar);
//     var baseString = oauth.SignatureMethod.getBaseString(message);
//     console.log("BaseString: " + baseString);
//     var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
//     console.log("Non-Encode Signature: " + sig);
//     var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
//     console.log("Encoded Signature: " + encodedSig);

//     Parse.Cloud.httpRequest({
//         method: 'GET',
//         url: urlLink,
//         headers: {
//             "Authorization": 'OAuth oauth_consumer_key='+oauth_consumer_key+', oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token='+oauth_token+', oauth_version="1.0"'
//         },
//         body: {
//         },
//         success: function(httpResponse) {
//             response.success(httpResponse.text);
//         },
//         error: function(httpResponse) {
//             response.error('Request failed with response ' + httpResponse.status+'\nSignature: '+encodedSig);

//         }
//     });
// });

//TUMBLR below

Parse.Cloud.define("TumblrRequestToken", function(request, response) {
    var urlLink = 'https://www.tumblr.com/oauth/request_token';

    var consumerSecret = request.params.cSec;

    var oauth_consumer_key = request.params.oKey;

    var oauth_callback = request.params.oCall;


    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var accessor = {
        "consumerSecret": consumerSecret
    };


    var params = {
        "oauth_version": "1.0",
        "oauth_consumer_key": oauth_consumer_key,
        "oauth_timestamp": timestamp,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_callback": oauth_callback
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
            "Authorization": 'OAuth oauth_consumer_key='+oauth_consumer_key+', oauth_callback=' + oauth_callback + ', oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ', oauth_version="1.0"'
        },
        body: {
        },
        success: function(httpResponse) {
            response.success(httpResponse.text);
        },
        error: function(httpResponse) {
            response.error(httpResponse);
        }
    });
});

Parse.Cloud.define("TumblrAccessToken", function(request, response) {
    var urlLink = 'https://www.tumblr.com/oauth/access_token';

    var consumerSecret = request.params.cSec;
    var tokenSecret = request.params.tSec;
    var oauth_consumer_key = request.params.oKey;
    var oauth_token = request.params.oToken;
    var oauth_verifier = request.params.oVer;

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
        "oauth_verifier" : oauth_verifier
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
            "Authorization": 'OAuth oauth_consumer_key='+oauth_consumer_key+', oauth_nonce=' + nonce + ', oauth_verifier=' + oauth_verifier + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token='+oauth_token+', oauth_version="1.0"'
        },
        body: {
        },
        success: function(httpResponse) {
            response.success(httpResponse.text);
        },
        error: function(httpResponse) {
            response.error(httpResponse);
        }
    });
});

Parse.Cloud.define("GetTumblrPosts", function(request, response) {
    var urlLink = 'https://api.tumblr.com/v2/blog/orangeteam394.tumblr.com/posts/submission';

    var consumerSecret = request.params.cSec;
    var tokenSecret = request.params.tSec;
    var oauth_consumer_key = request.params.oKey;
    var oauth_token = request.params.oToken;

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
            response.error(httpResponse);
        }
    });
});



Parse.Cloud.define("TumblrDeletePost", function(request, response) {
    var urlLink = 'https://api.tumblr.com/v2/blog/orangeteam394.tumblr.com/post/delete';

    var consumerSecret = request.params.cSec;
    var tokenSecret = request.params.tSec;
    var oauth_consumer_key = request.params.oKey;
    var oauth_token = request.params.oToken;

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
        "id" : request.params.id
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
            response.error(httpResponse);
        }
    });
});
