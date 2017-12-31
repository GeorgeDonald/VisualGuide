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

  var btn = document.getElementById('select_ok_button');
  if(btn){
    btn.addEventListener('click', ()=>{
      if(temp_name)name.value=temp_name;
      if(temp_lat)lat.value=temp_lat;
      if(temp_lng)lng.value=temp_lng;
      ctn.classList.add('hidden');
      img.src=makeGoogleStreetViewUrl({
          latitude: parseFloat(lat.value),
          longitude: parseFloat(lng.value),
          heading: 0,
          pitch: 0
        });
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
