function mainOnload(){
  var defaultPrms={
    latitude: parseFloat(document.querySelector("#lat").innerText),
    longitude: parseFloat(document.querySelector("#lon").innerText),
    heading: parseFloat(document.querySelector("#heading").innerText),
    pitch: parseFloat(document.querySelector("#pitch").innerText)
  };
  var map = null;
  var marker = null;
  var autocomplete = null;

  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos)=>{
          defaultPrms.latitude = pos.coords.latitude;
          defaultPrms.longitude = pos.coords.longitude;
          locateAndSave();
        });
      }
  }

  function getPlace(){
    var place = autocomplete.getPlace();
    if(place) {
      defaultPrms.latitude=place.geometry.location.lat();
      defaultPrms.longitude=place.geometry.location.lng();
      locateAndSave();
    }
  }

  function initMap() {
    var ret = initGoogleMap('guidmap',
      defaultPrms.latitude,
      defaultPrms.longitude,
      (e)=>{
        defaultPrms.latitude=e.latLng.lat();
        defaultPrms.longitude=e.latLng.lng();
        locateAndSave();
      },
      'map_auto_complete_input',
      e=>{
        if(e.key=='Enter'){
          getPlace();
        }
      },
      'map_search_button',
      e=>getPlace()
    );
    if(ret){
      map=ret.map;
      autocomplete=ret.autocomplete;
    }
  }

  function locateAndSave(){
    marker = locateMap(defaultPrms, map, marker);
    saveCurrPos();
  }

  function saveCurrPos(){
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

  function onKeyDown(key){
    var prms = onPlayStreamViewKeyDown(key, defaultPrms);
    if(prms.care){
      defaultPrms = prms;
      locateAndSave();
    }
    return prms.care;
  }

  window.addEventListener('keydown', (e)=>{
    var care = onKeyDown(e.key);
    if(care)
      e.preventDefault();
  });

  respMapCtrlItem(onKeyDown);
  initMap();
  marker = centerMap(defaultPrms, map, marker);
  E("compass").style.transform = `rotate(${defaultPrms.heading}deg)`
  //locateMap();
  //getLocation();
}

function setReloadMap(){
  window.addEventListener('mouseover',(e)=>{
    var eleMap = document.getElementById('guidmap')
    if(eleMap && !eleMap.childElementCount)
      window.onload();
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
