// main.js
var client = new ZeroClipboard( document.getElementById("copy-button"), {
  moviePath: "./js/ZeroClipboard.swf"
} );

client.on( "load", function(client) {
  //alert( "movie is loaded" );

  client.on( "complete", function(client, args) {
    // `this` is the element that was clicked
    $('#copy-button').html('Copied!');
    //alert("Copied text: " + args.text );
  } );
} );