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
  const RoE = 6371e3;

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

  function updateMapInfo(){
    document.querySelector("#map_image").src=makeGoogleStreetViewUrl(defaultPrms);
    document.querySelector("#lat").innerText=`${defaultPrms.latitude}`;
    document.querySelector("#lon").innerText=`${defaultPrms.longitude}`;
    document.querySelector("#heading").innerText=`${defaultPrms.heading}`;
    document.querySelector("#pitch").innerText=`${defaultPrms.pitch}`;

    document.querySelector("#compass").style.transform = `rotate(${defaultPrms.heading}deg)`
  }

  function centerMap(){
    var center = {lat: defaultPrms.latitude, lng: defaultPrms.longitude};
    map.setCenter(center);
    if(marker!=null)
      marker.setMap(null);
    marker = new google.maps.Marker({position: center,map: map});
  }

  function locateMap(){
    updateMapInfo();
    centerMap();
  }

  function locateAndSave(){
    locateMap();
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
    var care = true;
    switch(key){
      case "ArrowLeft":  //left arrow
        defaultPrms.heading-=1.0;
        if(defaultPrms.heading<0.0)
          defaultPrms.heading+=360.0;
        break;
      case "ArrowUp":  //up arrow
        ll = new LatLon(defaultPrms.latitude,defaultPrms.longitude);
        ll = ll.destinationPoint(1,defaultPrms.heading,RoE);
        defaultPrms.latitude = ll.lat;
        defaultPrms.longitude = ll.lon;
        break;
      case "ArrowRight":  //right arrow
        defaultPrms.heading+=1.0;
        if(defaultPrms.heading>360.0)
          defaultPrms.heading-=360.0;
        break;
      case "ArrowDown":  //down arrow
        ll = new LatLon(defaultPrms.latitude,defaultPrms.longitude);
        ll = ll.destinationPoint(1,(defaultPrms.heading+180)%360,RoE);
        defaultPrms.latitude = ll.lat;
        defaultPrms.longitude = ll.lon;
        break;
      case "PageUp":
        defaultPrms.pitch += 1;
        if(defaultPrms.pitch > 90)
          defaultPrms.pitch = 90;
        break;
      case "PageDown":
        defaultPrms.pitch -= 1;
        if(defaultPrms.pitch < -90)
          defaultPrms.pitch = -90;
        break;
      case ",":
        ll = new LatLon(defaultPrms.latitude,defaultPrms.longitude);
        hd = defaultPrms.heading-90;
        if(hd < 0) hd += 360;
        ll = ll.destinationPoint(1,hd,RoE);
        defaultPrms.latitude = ll.lat;
        defaultPrms.longitude = ll.lon;
        break;
      case ".":
        ll = new LatLon(defaultPrms.latitude,defaultPrms.longitude);
        ll = ll.destinationPoint(1,(defaultPrms.heading+90)%360,RoE);
        defaultPrms.latitude = ll.lat;
        defaultPrms.longitude = ll.lon;
        break;
      default:
        care = false;
        break;
    }
    if(care){
      locateAndSave();
    }
    return care;
  }

  window.addEventListener('keydown', (e)=>{
    var care = onKeyDown(e.key);
    if(care)
      e.preventDefault();
  });

  function resizeElement(eleid, cxs, cx, cys, cy){
      if((cxs!=='+'&&cxs!=='-')||(cys!=='+'&&cys!=='-'))
        return;

      var ele = document.querySelector(eleid);
      if(!ele)return;
      var styl = window.getComputedStyle(ele);
      var width = parseInt(styl["width"]);
      var height = parseInt(styl["height"]);
      if(((cxs === "+" && width < 4096) || (cxs === '-' && width > 120)) &&
        ((cys === "+" && height < 3072) || (cys === '-' && height > 90))){
        ele.style.width = `calc(${styl["width"]} ${cxs} ${cx})`;
        ele.style.height = `calc(${styl["height"]} ${cys} ${cy})`;
      }
  }

  function respMapCtrlItem(){
    var items = [{id: "#map_ctrl_turnleft", key: "ArrowLeft"},
      {id:"#map_ctrl_forward", key: "ArrowUp"},
      {id:"#map_ctrl_turnright", key: "ArrowRight"},
      {id:"#map_ctrl_moveleft", key: ","},
      {id:"#map_ctrl_moveright", key: "."},
      {id:"#map_ctrl_enlarge", func: ()=>{resizeElement("#streetview","+","40px","+", "30px");}},
      {id:"#map_ctrl_backward", key: "ArrowDown"},
      {id:"#map_ctrl_shrink", func: ()=>{resizeElement("#streetview","-","40px","-", "30px");}}
    ];
    items.forEach((e)=>{
      var timerID = undefined;
      var ele = document.querySelector(e.id);
      if(ele){
        if(e.key){
          ele.addEventListener('mousedown',()=>{
            onKeyDown(e.key);
            timerID=setInterval(()=>onKeyDown(e.key),100);
          });
          window.addEventListener('mouseup',()=>{
            if(timerID!=undefined){
              clearInterval(timerID);
              timerID = undefined;
            }
          });
        }
        else if(e.func)
          ele.addEventListener('click',()=>e.func());
      }
    });
  }

  respMapCtrlItem();
  initMap();
  centerMap();
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
