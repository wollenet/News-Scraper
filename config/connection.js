var mongoose = require("mongoose");

// Local Database Configuration with Mongoose
// mongoose.connect("mongodb://localhost/goodnews", function(error)
// 	{if(error) throw error;
// 	console.log("Database connected");
// });

// mLab database
mongoose.connect("", function(err) {
	if(err) throw err;
	console.log('database connected');
});

//mongodb://heroku_l6drmvct:58e0a6rgkm90rdse98d9rj5fc6@ds145208.mlab.com:45208/heroku_l6drmvct