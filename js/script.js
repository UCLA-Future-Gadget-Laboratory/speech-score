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

      if (isRecording == true) {
        showStopButton();
      }

      // starts recording a new stream
      let recorder = new MediaRecorder(stream);
      let data = [];
      
      // register event handler to add to data after each slice is recorded
      recorder.ondataavailable = function(event) { data.push(event.data); }

      /* Note:

         We can send data to Google Cloud API by adding to recorder.ondataavilable.
         Specifically, event.data is the new 5 second increment in a Blob, so we
         just need to send that to Google and listen for a response. This way we
         don't have to worry about saving multiple files.
         
      */

      recorder.start();
      start = Date.now();

      var stopped = new Promise(function(resolve, reject) {

        // Promise resolves when stream is stopped
        recorder.onstop = resolve;
        recorder.onerror = function(event) { reject(event.name); }

        // save increments according to recordingTime
        var recordLoop = setInterval(function() {

          // makes current data available, but continues recording
          recorder.requestData();

          // stop button is pressed
          if (isRecording == false) {
            clearInterval(recordLoop);
            recorder.stop();
          }

        }, recordingTime);
      });

      
      // returns the array of Blobs only when recorder is stopped
      return Promise.all([ stopped ])
      .then(function() {
          
          end = Date.now();
          console.log("Recorded " + (end - start) + " ms.");
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

/*
function analyze() {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = $("#recording");
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyzer = audioCtx.createAnalyzer();

  // Bind analyzer to media element source
  audioSrc.connect(analyzer);
  audioSrc.connect(audioCtx.destination);

  var frequencyData = new Uint8Array(200);

  var svgHeight = '300';
  var svgWidth = '1200';
  var barPadding = '1';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  var svg = createSvg('body', svgHeight, svgWidth);

  // Create our initial D3 chart.
  svg.selectAll('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('width', svgWidth / frequencyData.length - barPadding);
}


function renderChart() {
  // update chart
  requestAnimationFrame(renderChart);

  //copy frequency data
  analyzer.getByteFrequencyData(frequencyData);

  // update d3 with new data
  svg.selectAll('rect')
    .data(frequencyData)
    .attr('y', function(d) {
      return svgHeight - d;
    })
    .attr('height', function(d) {
      return d;
    })
    .attr('fill', function(d) {
      return 'rgb(0, 0, ' + d + ')';
    });
}


renderChart();
}
*/