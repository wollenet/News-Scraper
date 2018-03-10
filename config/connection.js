var mongoose = require("mongoose");

mongoose.connect( function(err) {
	if(err) throw err;
	console.log('database connected');
});