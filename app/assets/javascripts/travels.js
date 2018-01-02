// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/

function selectPlace(img, name, lat, lng){
  var ctn = document.getElementById('map_container');
  var eleMap = document.getElementById('select_place_map');
  if(!ctn || !eleMap)
    return;

  var temp_name = null;
  var temp_lat = parseFloat(lat.value);
  var temp_lng = parseFloat(lng.value);
  var marker = null;
  var map = null;

  function initMap(){
    map = initGoogleMap('select_place_map',
      temp_lat,
      temp_lng,
      (e)=>{
        temp_lat=e.latLng.lat();
        temp_lng=e.latLng.lng();
        centerizeMap(temp_lat, temp_lng);

        var request = {
          location: new google.maps.LatLng(temp_lat, temp_lng),
          radius: '20',
        };
        service = new google.maps.places.PlacesService(map.map);
        service.nearbySearch(request, (results, status)=>{
          if (status == google.maps.places.PlacesServiceStatus.OK && results.length) {
            temp_name = results[0].name;
            for(var i = 1; i < results.length; i++ ){
              if(results[i].type !== 'route'){
                temp_name = results[i].name;
                break;
              }
            }
          }
        });
      },
      'select_auto_complete_input',
      e=>{
        if(e.key=='Enter'){
          locatePlace();
        }
      },
      'select_search_button',
      e=>{locatePlace();}
    );
  }

  function locatePlace(){
    var place = map.autocomplete.getPlace();
    if(place) {
      temp_name=place.formatted_address;
      temp_lat=place.geometry.location.lat();
      temp_lng=place.geometry.location.lng();
      centerizeMap(temp_lat, temp_lng);
    }
  }

  function centerizeMap(lat,lng){
    var center = {lat,lng};
    map.map.setCenter(center);
    if(marker!=null)
      marker.setMap(null);
    marker = new google.maps.Marker({position: center, map: map.map});
  }

  function validateOrigDest(){

  }

  function doOK(){
    if(temp_name && name.value.length == 0)name.value=temp_name;
    if(temp_lat)lat.value=temp_lat;
    if(temp_lng)lng.value=temp_lng;
    ctn.classList.add('hidden');
    img.src=makeGoogleStreetViewUrl({
        latitude: parseFloat(lat.value),
        longitude: parseFloat(lng.value),
        heading: 0,
        pitch: 0
      });
  }

  var btn = document.getElementById('select_ok_button');
  if(btn){
    btn.addEventListener('click', (e)=>{
      doOK();
    });
  }

  btn = document.getElementById('select_cancel_button');
  if(btn){
    btn.addEventListener('click', ()=>{
      ctn.classList.add('hidden');
    });
  }

  window.addEventListener('mouseover', (e)=>{
    var eleMap = document.getElementById('select_place_map');
    if(eleMap && !eleMap.childElementCount)
      initMap();
  });

  ctn.classList.remove('hidden');
  initMap();
  centerizeMap(temp_lat, temp_lng);
}

function addLstnToImg(img, name, lat, lng){
  if(img && name && lat && lng){
    img.addEventListener('click', e=>{
      selectPlace(img, name, lat, lng);
    });
  }
}

function initNewTravelPage(){
  var ids = [["#start_street_view_img","#travel_start_name","#travel_start_lat","#travel_start_lng"],
    ["#end_street_view_img","#travel_end_name","#travel_end_lat","#travel_end_lng"]];
  ids.forEach(item=>{
    addLstnToImg(document.querySelector(item[0]),
      document.querySelector(item[1]),
      document.querySelector(item[2]),
      document.querySelector(item[3]));
  });
}

function initShowTravelPage(){
  var start_latitude = parseFloat(E("lat").innerText);
  var start_longitude = parseFloat(E("lon").innerText);
  var end_latitude = parseFloat(E("end_lat").innerText);
  var end_longitude = parseFloat(E("end_lon").innerText);
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var overview_path = null;
  var play_timer_id = null;
  var current_path = 0;
  var current_distance = 0;
  var ms_per_meter = 1000;
  var elapse_ms = 0;
  var latitude = start_latitude;
  var longitude = start_longitude;
  var heading = 0;
  var pitch = 0;
  var marker = null;
  var defaultPrms = {latitude, longitude, heading, pitch};

  var map = initGoogleMap('guidmap',start_latitude,start_longitude,
    null,null,null,null,null);
  if(map){
    map=map.map;
    directionsDisplay.setMap(map);
  }

  function updateStreetView(){
    E('map_image').src=makeGoogleStreetViewUrl({latitude, longitude, heading, pitch});
    E("compass").style.transform = `rotate(${heading}deg)`
    E("heading").innerText = heading;

    if(marker!=null)
      marker.setMap(null);
    marker = new google.maps.Marker({position: {lat: latitude, lng: longitude}, map: map});
  }

  function step_on(){
    elapse_ms += 10;
    if(elapse_ms >= ms_per_meter){
      elapse_ms -= ms_per_meter;
      current_distance++;
      sp = LatLon(overview_path[current_path].lat(), overview_path[current_path].lng());
      ll = sp.destinationPoint(current_distance, heading, RoE);
      latitude = ll.lat;
      longitude = ll.lon;
      updateStreetView();

      ll = sp.distanceTo(LatLon(overview_path[current_path + 1].lat(),
          overview_path[current_path + 1].lng()), RoE);
      if(current_distance >= ll){
        current_path++;
        if(current_path < overview_path.length-1){
          current_distance=0;
          latitude = overview_path[current_path].lat();
          longitude = overview_path[current_path].lng();
          heading = LatLon(latitude, longitude)
            .bearingTo(LatLon(overview_path[current_path+1].lat(),overview_path[current_path+1].lng()));
          updateStreetView();
        } else {
          hide("#travel_pause");
          clearInterval(play_timer_id);
        }
      }
    }
  }

  var request = {
    origin: new google.maps.LatLng(start_latitude, start_longitude),
    destination: new google.maps.LatLng(end_latitude, end_longitude),
    travelMode: 'WALKING',
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      overview_path = result.routes[0].overview_path;
      directionsDisplay.setDirections(result);

      heading = LatLon(overview_path[0].lat(),overview_path[0].lng())
        .bearingTo(LatLon(overview_path[1].lat(),overview_path[1].lng()));
      updateStreetView();

      current_path = 0;
      current_distance = 0;

      onclick("travel_play", e=>{
        hide("#travel_play");
        show("#travel_pause");
        show("#travel_stop");
        enableControl(false);
        elapse_ms = 0;
        play_timer_id = setInterval(step_on, 10);
      });
      onclick("travel_pause", e=>{
        clearInterval(play_timer_id);
        hide("#travel_pause")
        show("#travel_play");
        enableControl(true);
      });
      onclick("travel_stop", e=>{
        clearInterval(play_timer_id);

        current_path = 0;
        current_distance = 0;
        latitude = start_latitude;
        longitude = start_longitude;

        heading = LatLon(overview_path[0].lat(),overview_path[0].lng())
          .bearingTo(LatLon(overview_path[1].lat(),overview_path[1].lng()));
        updateStreetView();

        hide("#travel_pause")
        hide("#travel_stop")
        show("#travel_play");
        enableControl(true);
      });

      show("#travel_play");
      enableControl(true);
    }
  });

  function onKeyDown(key) {
    var prms = onPlayStreetViewKeyDown(key, defaultPrms);
    if(prms.care){
      defaultPrms = prms;
      marker = locateMap(defaultPrms, map, marker);
    }
    return prms.care;
  }

  function onKeyEvent(event){
    if(onKeyDown(event.key))
      event.preventDefault();
  }

  function enableControl(enable){
    if(enable) {
      defaultPrms.latitude = latitude;
      defaultPrms.longitude = longitude;
      defaultPrms.heading = heading;
      defaultPrms.pitch = pitch;
      E("map_ctrl").style.display = 'grid';
      window.addEventListener('keydown', onKeyEvent);
    } else {
      E("map_ctrl").style.display = "none";
      pitch = defaultPrms.pitch;
      window.removeEventListener('keydown', onKeyDown);
    }
  }

  respMapCtrlItem(onKeyDown);
  E("travel_speed").addEventListener('change',(e)=>{
    ms_per_meter = 1000.0 / parseFloat(E("travel_speed").value);
  });
}
