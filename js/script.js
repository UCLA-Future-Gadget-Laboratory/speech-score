let preview = document.getElementById("preview");
let recording = document.getElementById("recording");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let downloadButton = document.getElementById("downloadButton");
let logElement = document.getElementById("log");

let recordingTimeMS = 5000;

var count = 0;
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
  console.log("button was pressed");
  stopNow = false;
  beginRecording();
  startButton.style.display = "none";
  stopButton.style.display = "inline";
  preview.style.visibility = "visible";
  setTimeout(updateScore, 6000);
}, false);

stopButton.addEventListener("click", function() {
  stopNow = true;
  stop(preview.srcObject);
  startButton.style.display = "inline";
  stopButton.style.display = "none";
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

      //download the recording as a webm
      recording.src = URL.createObjectURL(recordedBlob);
      downloadButton.href = recording.src;
      downloadButton.download = "audio_" + count + ".webm";
      downloadButton.click();
      count += 1;

      log("Successfully recorded " + recordedBlob.size + " bytes of " + recordedBlob.type + " media.");
    }).catch(log);
  }
}


let score = document.getElementById('score');
function updateScore() {
  console.log('updateScore is running');
  var numRand = Math.floor(Math.random() * 31 + 50);
  score.innerHTML = "Score: " + numRand;
  setTimeout(updateScore, 5000);
}
