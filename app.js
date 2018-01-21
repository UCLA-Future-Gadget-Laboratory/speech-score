// express, node.js
var express = require("express");
var firebase = require("firebase-admin");
var app = express();
var server = require('http').Server(app);
var path = require('path');
var spawn = require("child_process").spawn;
var PythonShell = require('python-shell');
// var index = require('./routes/index');

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(express.static(__dirname));

// var options = { pythonPath: 'path/to/python3' };

// server needs to be listening on a port to wait for requests
app.get("/run-step", (request, response) => {

  console.log("GET request received!");

  // var pyshell = new PythonShell('/step.py');

  // pyshell.end(function (err) {
  //   if (err) throw err;
  //   console.log('finished');
  // });

  PythonShell.run('/main.py', function (err) { 
    if (err) throw err;
    
    console.log('success');
    // Use Javascript sdk (or maybe Node.js Admin sdk)
  // Process data from Firebase (e.g. Sentiment Info, WPM, )
  // Take that data and display it on screen (with e.g. sliding Fusion Graph)

  });

});

// server needs to be listening on a port to wait for requests
app.get("/run-step", (request, response) => {

	console.log("GET request received!");

	PythonShell.run('/step.py', function (err) { 
    if (err) throw err;
    
    console.log('success');
    // Use Javascript sdk (or maybe Node.js Admin sdk)
	// Process data from Firebase (e.g. Sentiment Info, WPM, )
	// Take that data and display it on screen (with e.g. sliding Fusion Graph)

  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


server.listen(process.env.PORT, process.env.IP,function(){
  console.log("App started on localhost:"+process.env.PORT);
});

// module.exports = app;