$(document).ready(function(){
	
	Parse.initialize('JzA8q6sistqJipqlSGVoQjgzUIkM5DTT4TiAmun9', 'ME6ADe5O6EAxaznIONYLpECysNoE9TzRWi3F8BtK');
	Parse.Cloud.run('hello', {}, {
	  success: function(result) {
	    // result is 'Hello world!'
	    console.log(result);
	  },
	  error: function(error) {
	  }
	});

});