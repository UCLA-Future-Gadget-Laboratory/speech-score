let preview = document.getElementById("preview");
let recording = document.getElementById("recording");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let downloadButton = document.getElementById("downloadButton");
let logElement = document.getElementById("log");

let recordingTimeMS = 5000;

var count = 0;

// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if request.auth != null;
//     }
//   }
// }

//
var stopNow = true;
// var storage = firebase.storage();
// var storageRef = storage.ref();
// var videosRef = storageRef.child('videos');
// var recordingRef = videosRef.child('videos/recording.webm');

function log(msg) {
  console.log(msg);
}

function wait(delayInMS) {
  return new Promise(resolve => setTimeout(resolve, delayInMS));
}

function startRecording(stream, lengthInMS) {
  let recorder = new MediaRecorder(stream);
  let data = [];

  recorder.ondataavailable = event => data.push(event.data);
  recorder.start();
  log(recorder.state + " for " + (lengthInMS/1000) + " seconds...");

  let stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = event => reject(event.name);
  });

  let recorded = wait(lengthInMS).then(
    () => recorder.state == "recording" && recorder.stop()
  );

  return Promise.all([
    stopped,
    recorded
  ])
  .then(() => data);
}

function stop(stream) {
  stream.getTracks().forEach(track => track.stop());
}


startButton.addEventListener("click", function() {
  console.log("button was pressed");
  stopNow = false;
  beginRecording();
  startButton.style.visibility = "hidden";
  stopButton.style.visibility = "visible";
  preview.style.visibility = "visible";
}, false);

stopButton.addEventListener("click", function() {
  stopNow = true;
  stop(preview.srcObject);
  startButton.style.visibility = "visible";
  stopButton.style.visibility = "hidden";
  preview.style.visibility = "hidden";

}, false);

function beginRecording() {

  if(!stopNow)
  {
    setTimeout(beginRecording, recordingTimeMS);

    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(stream => {
      preview.srcObject = stream;
      downloadButton.href = stream;
      preview.captureStream = preview.captureStream || preview.mozCaptureStream;
      return new Promise(resolve => preview.onplaying = resolve);
    }).then(() => startRecording(preview.captureStream(), recordingTimeMS))
    .then (recordedChunks => {
      let recordedBlob = new Blob(recordedChunks, { type: "audio/webm" });

      // recordingRef.put(recordedBlob).then(function(snapshot) {
      //   console.log('Uploaded a blob!');
      // });

      //download the recording as a webm
      recording.src = URL.createObjectURL(recordedBlob);
      downloadButton.href = recording.src;
      downloadButton.download = "audio_" + count + ".webm";
      downloadButton.click();
      count += 1;

      // $.ajax({
      //    url: "localhost:5001/run-step",
      //    method: "POST"
      // }); // jquery ajax

      log("Successfully recorded " + recordedBlob.size + " bytes of " + recordedBlob.type + " media.");
    }).catch(log);
  }
}
