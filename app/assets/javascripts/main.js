
function onPositionChanged(defaultPrms){
  var frm = document.querySelector("#current_position_form");
  if(!frm)return;

  var fd = new FormData();
  fd.append(frm.children[0].name, frm.children[0].value)
  fd.append(frm.children[1].name, frm.children[1].value)
  fd.append('current_position[latitude]', `${defaultPrms.latitude}`);
  fd.append('current_position[longitude]', `${defaultPrms.longitude}`);
  fd.append('current_position[heading]', `${defaultPrms.heading}`);
  fd.append('current_position[pitch]', `${defaultPrms.pitch}`);
  fd.append("commit", "Update");
  fd.append("controller", "current_positions");
  fd.append("action", "update");

  $.ajax({
      type: 'POST',
      url: '/current_positions/update',
      data: fd,
      processData: false,
      contentType: false
  }).done(function(data) {
  });
}

function mainOnload(){
  initStreetViewWithMap(onPositionChanged);
}

function setReloadMap(func,param){
  window.addEventListener('mouseover',(e)=>{
    var eleMap = document.getElementById('guidmap')
    if(eleMap && !eleMap.childElementCount)
      func(param);
  });
}

function setToggleMainMenu(){
  function toggleMainMenu(){
    var cl = document.querySelector("#mainmenu").classList;
    var elem = document.querySelector("article");
    var cur = window.getComputedStyle(elem)['marginTop'];
    cur = `calc(${cur} ${cl.contains("hidden") ? "+" : "-"} 30px)`;
    elem.style.marginTop=cur;

    elem = document.querySelector("header");
    cur = window.getComputedStyle(elem)['height'];
    cur = `calc(${cur} ${cl.contains("hidden") ? "+" : "-"} 30px)`;
    elem.style.height=cur;

    cl.toggle("hidden");
  }

  window.addEventListener('click',(e)=>{
    if(e.target!==document.querySelector("#user_avatar")){
      var cl = document.querySelector("#mainmenu").classList;
      if(!cl.contains("hidden"))
        toggleMainMenu();
    }
  });

  document.querySelector("#user_avatar").addEventListener('click',toggleMainMenu);
}
