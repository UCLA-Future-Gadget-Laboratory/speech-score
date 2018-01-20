let preview = document.getElementById("preview");
let recording = document.getElementById("recording");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let downloadButton = document.getElementById("downloadButton");
let logElement = document.getElementById("log");

let recordingTimeMS = 10000;

var stopNow = true;

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
  stopNow = false;
  beginRecording();
}, false);

stopButton.addEventListener("click", function() {
  stopNow = true;
  stop(preview.srcObject);
}, false);

function beginRecording() {

  if(!stopNow)
  {
    setTimeout(beginRecording, recordingTimeMS);

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      preview.srcObject = stream;
      downloadButton.href = stream;
      preview.captureStream = preview.captureStream || preview.mozCaptureStream;
      return new Promise(resolve => preview.onplaying = resolve);
    }).then(() => startRecording(preview.captureStream(), recordingTimeMS))
    .then (recordedChunks => {
      let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });

      //download the recording as a webm
      recording.src = URL.createObjectURL(recordedBlob);
      downloadButton.href = recording.src;
      downloadButton.download = "RecordedVideo.webm";
      downloadButton.click();

      log("Successfully recorded " + recordedBlob.size + " bytes of " +
          recordedBlob.type + " media.");
    }).catch(log);
  }
}

// function onVideoFail(e) {
//         console.log('webcam fail!', e);
//       };
//
//     function hasGetUserMedia() {
//       // Note: Opera is unprefixed.
//       return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
//                 navigator.mozGetUserMedia || navigator.msGetUserMedia);
//     }
//
//     if (hasGetUserMedia()) {
//       // Good to go!
//     } else {
//       alert('getUserMedia() is not supported in your browser');
//     }
//
//     window.URL = window.URL || window.webkitURL;
//     navigator.getUserMedia  = navigator.getUserMedia ||
//                              navigator.webkitGetUserMedia ||
//                               navigator.mozGetUserMedia ||
//                                navigator.msGetUserMedia;
//
//     var video = document.querySelector('video');
//     var streamRecorder;
//     var webcamstream;
//
//     if (navigator.getUserMedia) {
//       navigator.getUserMedia({audio: true, video: true}, function(stream) {
//         video.src = window.URL.createObjectURL(stream);
//         webcamstream = stream;
//       streamrecorder = webcamstream.record();
//       }, onVideoFail);
//     } else {
//         alert ('failed');
//     }
//
// function startRecording() {
//   console.log("recording");
//     streamRecorder = webcamstream.record();
//     setTimeout(stopRecording, 10000);
// }
// function stopRecording() {
//   console.log("stoppped recording");
//     streamRecorder.getRecordedData(postVideoToServer);
// }
// function postVideoToServer(videoblob) {
//   console.log("uploaded to server");
//
//     var data = {};
//     data.video = videoblob;
//     data.metadata = 'test metadata';
//     data.action = "upload_video";
//     jQuery.post("uploadvideo.php", data, onUploadSuccess);
// }
// function onUploadSuccess() {
//     alert ('video uploaded');
// }
