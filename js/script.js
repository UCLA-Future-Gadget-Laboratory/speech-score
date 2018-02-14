const recordingTime = 5000;
var isRecording = false;

function wait() {
  return new Promise(resolve => setTimeout(resolve, recordingTime));
}


function showStartButton() {
  $("#recordButton").addClass("fa-start-circle-o");
  $("#recordButton").removeClass("fa-stop-circle-o");
}


function showStopButton() {
  $("#recordButton").addClass("fa-stop-circle-o");
  $("#recordButton").removeClass("fa-start-circle-o");
}


$("#recordButton").on("click", function() {
  console.log(isRecording);
  
  if (isRecording == false) {

    isRecording = true;

    // returns Promise that resolves to a MediaStream object
    navigator.mediaDevices.getUserMedia({

      audio: true

    // to be run after getUserMedia returns
    // stream: MediaStream object
    }).then(function(stream) {

      showStopButton();

      // starts recording a new stream
      let recorder = new MediaRecorder(stream);
      let data = [];

      /* NOTE:
         Use a setInterval() with the MediaRecorder.requestData() function,
         instead of mediaDevices.getUserMedia(). getUserMedia() function
         will prompt user every time unless the user clicks "Remember this
         decision". requestData() saves the Blob and continues recording.
         
         We can use requestData() to store a Blob with URL.createObjectURL(),
         then send this temporary file to Google Cloud API. This doesn't save
         a file on the FS. The file exists only as long as the window is open.
         We can release the temporary files by URL.revokeObjectURL().
      */

      // if a stream is available, add the Blob to 'data' and record
      recorder.ondataavailable = function(event) { data.push(event.data); }
      recorder.start();
      console.log(recorder.state + " for " + (recordingTime) + " ms...");

      // Promise resolves when stream is stopped
      let stopped = new Promise(function(resolve, reject) {
        recorder.onstop = resolve;
        recorder.onerror = function(event) { reject(event.name); }
      });

      // Promise resolves when recording time is up
      let recorded = wait().then(
        function() { recorder.state == "recording" && recorder.stop(); }
      );
      
      // Promise resolves when the stream is both stopped and time is up
      // returns the array of Blobs
      return Promise.all([
        stopped,
        recorded
      ])
      .then(function() { 
          return data; 
      });

    // record media to file
    // recordedChunks: array of Blob objects
    }).then(function(recordedChunks) {

      // combine recorded chunks into one blob
      let recordedBlob = new Blob(recordedChunks, { type: "audio/mp3" });
      console.log(recordedBlob);

      // download the recording as a webm
      $("#recording").attr("src", URL.createObjectURL(recordedBlob));

      // show download button
      $("#downloadButton").show();
      $("#downloadButton").attr("href", $("#recording").attr("src"));
      $("#downloadButton").attr("download", "audio.mp3");

      console.log("Successfully recorded " + recordedBlob.size + 
        " bytes of " + recordedBlob.type + " media.");

      isRecording = false;
      showStartButton();

      setTimeout(updateScore, 5000); // test

    }).catch(function(err) {

      console.log("User cancelled media stream.");
      isRecording = false;
      showStartButton();

    });

  } else {
    isRecording = false;
    showStartButton();

  }

});


function updateScore() {
  console.log('updateScore is running');
}
