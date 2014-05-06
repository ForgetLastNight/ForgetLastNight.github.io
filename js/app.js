$(document).ready(function(){
	Parse.initialize('JzA8q6sistqJipqlSGVoQjgzUIkM5DTT4TiAmun9', 'ME6ADe5O6EAxaznIONYLpECysNoE9TzRWi3F8BtK');
      



	Parse.Cloud.run('ShareToTwitter', {}, {
	  success: function(result) {
	    alert("Success!");
	  },
	  error: function(error) {
	  }
	});


});