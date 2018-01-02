// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/

function initNewGuidePage(){
  onclick('guide_image', e=>{
        selectPlace(E('guide_image'), E('guide_title'), E('guide_latitude'), E('guide_longitude'));
      });
}

function initShowGuidePage(){
  createGuideChannel(initStreetViewWithMap(sendGuideData));
  setReloadMap(initStreetViewWithMap,sendGuideData);
}
