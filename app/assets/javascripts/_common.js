
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
