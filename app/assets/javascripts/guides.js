// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/

function initNewGuidePage(){
  onclick('guide_image', e=>{
      selectPlace(E('guide_image'),
        E('guide_title'), E('guide_latitude'), E('guide_longitude'));
    });
}

var inputStatusFunction;
function initShowGuidePage(){
  inputStatusFunction = initStreetViewWithMap(sendGuideData);
  if(!App.guideChannel || !App.statusChannel){
    var pathname = location.pathname.match(/\/guides\/([0-9]+)/);
    if(pathname && pathname.length>1)
      createGuideChannel(pathname[1], onReceivedStatus);
  }
  setReloadMap(initStreetViewWithMap,sendGuideData);
  onclick("stop_guide_show", destroyGuideChannel);
  requestUpdateStatus();
  onclick("chat_input_send", e=>{
    var msg = E("chat_input_message");
    if(msg.value.length)
      sendChatMessage(msg.value);
  });
}

function onReceivedStatus(data){
  if(inputStatusFunction)
    inputStatusFunction(data);
}

function onClickedGuideShow(e){
  var guide_id = e.target.id.match(/show_guide_link_([0-9]+)/);
  createGuideChannel(guide_id[1], onReceivedStatus);
}

function initIndexGuidePage(){
  Q(".show_guide_link").forEach(e=>{
    e.addEventListener('click', onClickedGuideShow);
  });
}
