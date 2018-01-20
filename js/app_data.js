 var cdata = [];
 window.addEventListener("load", getData(genFunction));

    
    function getData(callbackIN) {
      var ref = firebase.database().ref("data");
      //ref.once('value').then(function (snapshot) {
      //  callbackIN(snapshot.val())
      //});
      ref.on('child_added', function(snapshot) {
        var data = snapshot.val();
        updateRealtime(data);        
      });
    }

    function updateRealtime(data) {
      console.log(data);
      cdata.push({
          label: data.label,
          value: data.value
        });  
      // var len = data.length;
      // for(var i=0; i<len; i++) {
      //   cdata.push({
      //     label: data[i]['label'],
      //     value: data[i]['value']
      //   });        
      // }
      console.log('cdata: ' + cdata);
      genFunction();
    }

    function genFunction() {      
      // var len = data.length;
      // for(var i=1; i<len; i++) {
      //   cdata.push({
      //     label: data[i]['label'],
      //     value: data[i]['value']
      //   });
      // }

    var firebaseChart = new FusionCharts({
        type: 'area2d',
        renderAt: 'chart-container',
        width: '650',
        height: '400',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "Website Visitors Trend",
                "subCaption": "Last 7 Days{br}ACME Inc.",
                "subCaptionFontBold": "0",
                "captionFontSize": "20",
                "subCaptionFontSize": "17",
                "captionPadding": "15",
                "captionFontColor": "#8C8C8C",
                "baseFontSize": "14",
                "baseFont": "Barlow",
                "canvasBgAlpha": "0",
                "bgColor": "#FFFFFF",
                "bgAlpha": "100",
                "showBorder": "0",
                "showCanvasBorder": "0",
                "showPlotBorder": "0",
                "showAlternateHGridColor": "0",
                "usePlotGradientColor": "0",
                "paletteColors": "#6AC1A5",
                "showValues": "0",
                "divLineAlpha": "5",
                "showAxisLines": "1",
                "drawAnchors": "0",
                "xAxisLineColor": "#8C8C8C",
                "xAxisLineThickness": "0.7",
                "xAxisLineAlpha": "50",
                "yAxisLineColor": "#8C8C8C",
                "yAxisLineThickness": "0.7",
                "yAxisLineAlpha": "50",
                "baseFontColor": "#8C8C8C",
                "toolTipBgColor": "#FA8D67",
                "toolTipPadding": "10",
                "toolTipColor": "#FFFFFF",
                "toolTipBorderRadius": "3",
                "toolTipBorderAlpha": "0",
                "drawCrossLine": "1",
                "crossLineColor": "#8C8C8C",
                "crossLineAlpha": "60",
                "crossLineThickness": "0.7",
                "alignCaptionWithCanvas": "1"
            },
            "data": cdata
        }
    });
    firebaseChart.render();
    }


// window.addEventListener("load", init());

// // json data gets put into cdata
// // function genFunction(data) {
// //   var cdata = [];
// //   var len = data.length;
// //   for(var i=1; i<len; i++) {
// //     cdata.push({
// //       label: data[i]['label'],
// //       value: data[i]['value']
// //     });
// //   }
// function init() {
//   var firebaseChart = new FusionCharts({
//       type: 'area2d',
//       renderAt: 'chart-container',
//       width: '650',
//       height: '400',
//       dataFormat: 'json',
//       dataSource: {
//           "chart": {
//               "caption": "Website Visitors Trend",
//               "subCaption": "Last 7 Days{br}ACME Inc.",
//               "subCaptionFontBold": "0",
//               "captionFontSize": "20",
//               "subCaptionFontSize": "17",
//               "captionPadding": "15",
//               "captionFontColor": "#8C8C8C",
//               "baseFontSize": "14",
//               "baseFont": "Barlow",
//               "canvasBgAlpha": "0",
//               "bgColor": "#FFFFFF",
//               "bgAlpha": "100",
//               "showBorder": "0",
//               "showCanvasBorder": "0",
//               "showPlotBorder": "0",
//               "showAlternateHGridColor": "0",
//               "usePlotGradientColor": "0",
//               "paletteColors": "#6AC1A5",
//               "showValues": "0",
//               "divLineAlpha": "5",
//               "showAxisLines": "1",
//               "drawAnchors": "0",
//               "xAxisLineColor": "#8C8C8C",
//               "xAxisLineThickness": "0.7",
//               "xAxisLineAlpha": "50",
//               "yAxisLineColor": "#8C8C8C",
//               "yAxisLineThickness": "0.7",
//               "yAxisLineAlpha": "50",
//               "baseFontColor": "#8C8C8C",
//               "toolTipBgColor": "#FA8D67",
//               "toolTipPadding": "10",
//               "toolTipColor": "#FFFFFF",
//               "toolTipBorderRadius": "3",
//               "toolTipBorderAlpha": "0",
//               "drawCrossLine": "1",
//               "crossLineColor": "#8C8C8C",
//               "crossLineAlpha": "60",
//               "crossLineThickness": "0.7",
//               "alignCaptionWithCanvas": "1"
//           }
//       }
//   });

//   // firebaseChart.render();

//   var ref = firebase.database().ref("data");
//     // ref.once('value').then(function (snapshot) {
//     //   callbackIN(snapshot.val())
//     // });
//   ref.on('child_added', function(snapshot) {
//     var data = snapshot.val();
//     strData = "&label=" + data.label + "&value=" + data.value;
//     console.log(strData);
//     firebaseChart.feedData(strData);
//   });
// }

