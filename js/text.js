// makes something pop up if text equals certain value
var li = document.createElement("li");
var inputValue = document.getElementById("myInput").value;
var t = document.createTextNode(inputValue);
li.appendChild(t);
if (inputValue === '') {
  alert("You must write something!");
} else if (inputValue.includes('fast')) {
      console.log('fast');

  appendNotification(true);
  document.getElementById("myUL").appendChild(li);
} else if (inputValue.includes('slow')) {
  console.log('slow');
  appendNotification(false);
  // document.getElementById("myUL").appendChild(li);
} else {
  // document.getElementById("myUL").appendChild(li);
}
document.getElementById("myInput").value = "";


$('body').append('<div class="notification-wrapper" style="pointer-events: none; position: absolute;"></div>');

function appendNotification(word){
  if($('.notification-wrapper') == null)
    $('body').append('<div class="notification-wrapper" style="pointer-events: none; position: absolute; width: 100%; height: 100%"></div>');

  var content = '<div id="DS-icon" style="opacity: 0;z-index: 10000000; text-align: center; font-size: 20px; left: 10px; top: 25px; position: fixed; padding: 20px; color: white; border-radius: 5px; background: ';
  content += word ? '#53b6f1; ">speak slower</div>' : '#da5c5c; ">speak faster</div>';
  console.log('appending...')
  $('.notification-wrapper').append(content);

  $('#DS-icon').animate({top: '10px', opacity: 1}, 200);

  setTimeout(function(){
    $('#DS-icon').animate({top: '25px', opacity: 0}, 200, function(){
      setTimeout(function(){$('.notification-wrapper').html('');}, 200);
    });
  }, 2000);
}
