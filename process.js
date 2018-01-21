// express, node.js
var express = require("express");

// module called exec
// var { exec } = require("child_process");
var admin = require("firebase-admin");

// server needs to be listening on a port to wait for requests
app.post("/run-step", (request, response) => {
  exec("python3 step.py", (err, stdout, stderr) => {
    if(err) // .....

    // Use Javascript sdk (or maybe Node.js Admin sdk)
	// Process data from Firebase (e.g. Sentiment Info, WPM, )
	// Take that data and display it on screen (with e.g. sliding Fusion Graph)

    response.end("...");
  });
});


// listen to server here