const recordingTime = 5000;
var isRecording = false;


$("document").ready(function() {

});


function toggleMenu() {
  if ($("#menu").hasClass("hidden")) {
    $("#menu").addClass("visible");
    $("#menu").removeClass("hidden");
    $("#logo").css("transform", "rotate(90deg)");
  } else {
    $("#menu").removeClass("visible");
    $("#menu").addClass("hidden");
    $("#logo").css("transform", "rotate(0deg)");
  }
}


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
      init_analysis(stream);
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
          console.log("Length: " + (end - start) + " ms.");
          return data;

      });

    // record media to file
    // recordedChunks: array of Blob objects
    }).then(function(recordedChunks) {

      // combine recorded chunks into one blob
      let recordedBlob = new Blob(recordedChunks, { type: "audio/mp3" });

      // download the recording as a mp3
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

      console.log("Permission not granted.");
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


function init_analysis(stream) {

  // webkit is for Safari support
  // moz is for Firefox support
  var audioCtx = new (window.AudioContext || 
                      window.webkitAudioContext ||
                      window.mozAudioContext)();
  
  // connect to stream
  var audioSrc = audioCtx.createMediaStreamSource(stream);
  var analyser = audioCtx.createAnalyser();

  // bind analyzer to stream source
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  // split into 768 bins (ignore high frequency sound since there's not much of it)
  var frequencyData = new Uint8Array(analyser.frequencyBinCount * 0.75);

  // size of visualization window
  var svgHeight = '150';
  var svgWidth = '1000';
  var barPadding = '0';

  // create graph in #graphs div
  function createSvg(parent, height, width) {
    return d3.select(parent)
    .append('svg')
    .attr('height', height)
    .attr('width', width);
  }
  var graph = createSvg('#graphs', svgHeight, svgWidth);

  // initialize d3 chart
  // it attempts to select 'rect', which doesn't exist, so it creates empty array
  // enter() creates references based on the data
  // append() creates a 'rect' element
  graph.selectAll('rect')
    .data(frequencyData)
    .enter()
    .append('rect');

  // continuously loops and updates chart with frequency data.
  function renderChart() {

    // cancel animation when stop button pressed and delete visualization
    if (isRecording) {
      requestAnimationFrame(renderChart);
    } else {
      cancelAnimationFrame(renderChart);
      d3.select('svg').remove();
    }

    // copy frequency data to frequencyData array.
    analyser.getByteFrequencyData(frequencyData);
    
    // update d3 chart with new data.
    graph.selectAll('rect')
        .data(frequencyData)
        .attr('x', function (d, i) {
          return i * 2 * (svgWidth / frequencyData.length);
        })
        .attr('width', svgWidth * 2 / frequencyData.length - barPadding)
        .attr('y', function(d) {
          return Math.round(svgHeight - d * 0.75);
        })
        .attr('height', function(d, i) {
          // equalizer boosts bars in high frequency since they're harder to pick up
          return d + Math.round(i * 0.5);
        })
        .attr('fill', function(d, i) {
          // blue = bass, yellow = low midrange, red = upper midrange
          var blue = 255 - i;
          if (blue < 0) blue = 0;
          var green = 255 - Math.abs(200 - i);
          if (green < 0) green = 0;
          var red = 255 - Math.abs(350 - i);
          if (red < 0) red = 0;
          return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        });
  }

  // renderChart() loops until stop button is pressed due to requestAnimationFrame()
  renderChart();
  
}



