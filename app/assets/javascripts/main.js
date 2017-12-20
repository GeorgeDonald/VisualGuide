window.onload = ()=>{
  var url = "https://maps.googleapis.com/maps/api/streetview?size=800x400&fov=120";
  var defaultPrms={latitude:39.95259199321605,longitude: -75.16522200000003,heading: 0.0, pitch: 0.0};
  var map;
  var marker = null;
  const RoE = 6371e3;

  function makeUrl(prms){
    var key = '';
    var eleGak = document.getElementById("google_api_key");
    if(eleGak && eleGak.value)
      key = `key=${eleGak.value}`;
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
    document.querySelector("#pitch").innerText=`Ptch: ${defaultPrms.pitch}`;
    var center = {lat: defaultPrms.latitude, lng: defaultPrms.longitude};
    map.setCenter(center);
    if(marker!=null)
      marker.setMap(null);
    marker = new google.maps.Marker({position: center,map: map});
  }

  initMap();
  locateMap();
  getLocation();

  window.addEventListener('keydown', (e)=>{
    var care = true;
    switch(e.key){
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
      e.preventDefault();
      locateMap();
    }
  });
}
