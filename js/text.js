var trigger = 'nah';
// makes something pop up if text equals certain value
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else if (inputValue.includes('fast')) {
    appendNotification(1);
  } else if (inputValue.includes('slow')) {
    appendNotification(2);
    // document.getElementById("myUL").appendChild(li); 
  } else if (inputValue.includes('loud')) {
    appendNotification(3);
  } else if (inputValue.includes('soft')) {
    appendNofitication(4);
  } else {
    // document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";
}

$('body').append('<div class="notification-wrapper" style="pointer-events: none; position: absolute;"></div>');

function appendNotification(word){
  if($('.notification-wrapper') == null)
    $('body').append('<div class="notification-wrapper" style="pointer-events: none; position: absolute; width: 100%; height: 100%"></div>');

  var content = '<div id="DS-icon" style="opacity: 0;z-index: 10000000; text-align: center; font-family: Lato; font-size: 20px; right: 10px; top: 200px; position: fixed; padding: 50px; color: white; border-radius: 5px; background: ';
  
switch(word) {
    case 1:
        content += '#53b6f1; ">speak slower</div>';
        break;
    case 2:
        content += '#da5c5c; ">speak faster</div>';
        break;
    case 3:
        content += 'green; ">speak louder</div>';
        break;
    case 4:
        content += 'red; ">speaker softer</div>';
        break;
}

  // content += word ? '#53b6f1; ">speak slower</div>' : '#da5c5c; ">speak faster</div>';
  
  console.log('appending...')
  $('.notification-wrapper').append(content);

  $('#DS-icon').animate({top: '10px', opacity: 1}, 200);

  setTimeout(function(){
    $('#DS-icon').animate({top: '25px', opacity: 0}, 200, function(){
      setTimeout(function(){$('.notification-wrapper').html('');}, 200);
    });
  }, 2000);
}
