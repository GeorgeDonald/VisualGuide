function mainOnload(){
  var url = "https://maps.googleapis.com/maps/api/streetview?size=640x480&fov=120";
  var defaultPrms={latitude:39.95259199321605,longitude: -75.16522200000003,heading: 0.0, pitch: 0.0};
  var map = null;
  var marker = null;
  const RoE = 6371e3;

  function makeUrl(prms){
    var key = '';
    var eleGak = document.getElementById("google_api_key");
    if(eleGak && eleGak.value)
      key = `&key=${eleGak.value}`;
    return `${url}&location=${prms.latitude},${prms.longitude}&heading=${prms.heading}&pitch=${prms.pitch}${key}`;
  }

  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos)=>{
          defaultPrms.latitude = pos.coords.latitude;
          defaultPrms.longitude = pos.coords.longitude;
          locateMap();
        });
      }
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('guidmap'), {
      center: {lat: defaultPrms.latitude, lng: defaultPrms.longitude},
      zoom: 15
    });
    map.addListener('click', (e)=>{
      defaultPrms.latitude=e.latLng.lat();
      defaultPrms.longitude=e.latLng.lng();
      locateMap();
    });
  }

  function locateMap(){
    document.querySelector("#map_image").src=makeUrl(defaultPrms);
    document.querySelector("#lat").innerText=`Latitude: ${defaultPrms.latitude}`;
    document.querySelector("#lon").innerText=`Longitude: ${defaultPrms.longitude}`;
    document.querySelector("#heading").innerText=`Heading: ${defaultPrms.heading}`;

    document.querySelector("#compass").style.transform = `rotate(${defaultPrms.heading}deg)`

    document.querySelector("#pitch").innerText=`Ptch: ${defaultPrms.pitch}`;
    var center = {lat: defaultPrms.latitude, lng: defaultPrms.longitude};
    map.setCenter(center);
    if(marker!=null)
      marker.setMap(null);
    marker = new google.maps.Marker({position: center,map: map});
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
    if(care)
      locateMap();
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
  locateMap();
  getLocation();
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
