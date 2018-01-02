const RoE = 6371e3;

function E(id){return document.getElementById(id);}
function Q(cls){return document.querySelectorAll(cls);}
function hide(sel){document.querySelectorAll(sel).forEach(e=>e.classList.add('hidden'))}
function show(sel){document.querySelectorAll(sel).forEach(e=>e.classList.remove('hidden'))}
function onclick(id,cb){E(id).addEventListener('click',cb);}
function newchild(tag,cls,id,father){
  var ne = document.createElement(tag);
  ne.classList.add(cls);
  ne.id=id;
  if(father)
    father.appendChild(ne);
  return ne;
}

function initGoogleMap(
  container_id,
  lat,
  lng,
  onclick,
  search_input_id,
  on_input_keydown,
  search_button_id,
  onsearch
) {
  var autocomplete = undefined;
  var map = new google.maps.Map(document.getElementById(container_id), {
    center: {lat, lng},
    zoom: 15
  });
  if(!map){
    console.log('invalid map container.');
    return map;
  }

  if(onclick)
    map.addListener('click', (e)=>{onclick(e);});

  var input = document.getElementById(search_input_id);
  if(input) {
    autocomplete = new google.maps.places.Autocomplete(input);
    input.addEventListener('keydown',e=>{on_input_keydown(e);});

    var btn = document.getElementById(search_button_id);
    if(btn){
      btn.addEventListener('click',e=>{onsearch(e);});
    }
  }
  return {map, autocomplete};
}

function makeGoogleStreetViewUrl(prms){
  var url = "https://maps.googleapis.com/maps/api/streetview?size=640x480&fov=120";
  var key = '';
  var eleGak = document.getElementById("google_api_key");
  if(eleGak && eleGak.value)
    key = `&key=${eleGak.value}`;
  return `${url}&location=${prms.latitude},${prms.longitude}&heading=${prms.heading}&pitch=${prms.pitch}${key}`;
}

function onPlayStreetViewKeyDown(key, defaultPrms){
  defaultPrms.care = true;
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
      defaultPrms.care = false;
      break;
  }
  return defaultPrms;
}

function updateMapInfo(defaultPrms){
  E("map_image").src=makeGoogleStreetViewUrl(defaultPrms);
  E("lat").innerText=`${defaultPrms.latitude}`;
  E("lon").innerText=`${defaultPrms.longitude}`;
  E("heading").innerText=`${defaultPrms.heading}`;
  E("pitch").innerText=`${defaultPrms.pitch}`;
  E("compass").style.transform = `rotate(${defaultPrms.heading}deg)`
}

function centerMap(defaultPrms, map, marker){
  var center = {lat: defaultPrms.latitude, lng: defaultPrms.longitude};
  map.setCenter(center);
  if(marker!=null)
    marker.setMap(null);
  return new google.maps.Marker({position: center,map: map});
}

function locateMap(defaultPrms, map, marker){
  updateMapInfo(defaultPrms);
  return centerMap(defaultPrms, map, marker);
}

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

function respMapCtrlItem(onKeyDown){
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
        ele.addEventListener('click',e.func);
    }
  });
}

function initStreetViewWithMap(onchange){
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
        if(!E("map_ctrl"))
          return;

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
    if(onchange)
      onchange(defaultPrms);
  }

  function onKeyDown(key){
    if(!E("map_ctrl"))
      return false;

    var prms = onPlayStreetViewKeyDown(key, defaultPrms);
    if(prms.care){
      defaultPrms = prms;
      locateAndSave();
    }
    return prms.care;
  }

  window.addEventListener('keydown', (e)=>{
    if(e.target !== document.querySelector("body"))
      return;
      
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

  return function(prm){
    defaultPrms = prm;
    marker = locateMap(defaultPrms, map, marker);
  };
}
