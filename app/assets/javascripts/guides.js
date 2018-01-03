// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/

var history_message;

function initNewGuidePage(){
  onclick('guide_image', e=>{
      selectPlace(E('guide_image'),
        E('guide_title'), E('guide_latitude'), E('guide_longitude'));
    });
}

function onReceivedMessage(data, append){
  var ne = newchild("div","chat_item");
  var h=newchild('div',"chat_item_head","",ne);
  var m=newchild('div',"chat_item_message","",ne);
  m.innerText=data.message;
  var a=newchild('div',"chat_item_avatar","",h);
  var i=newchild('img',"chat_item_img","",a);
  i.src=data.avatar_url;
  var is = newchild('div',"chat_item_info","",h);
  var n = newchild("div","chat_item_name","",is);
  n.innerText=data.user_name;
  var b=newchild("div","chat_item_edit","",is);

  var area = E("chat_item_area");
  if(append){
    area.appendChild(ne);
  } else {
    if(area.children.length)
      area.insertBefore(ne,area.children[0]);
    else {
      area.appendChild(ne);
    }
  }
}

function getHistoryMessage(id){
  var frm = Q1("#hidden_chat_message_form");
  if(!frm)return;

  var fd = new FormData();
  fd.append(frm.children[0].name, frm.children[0].value)
  fd.append(frm.children[1].name, frm.children[1].value)
  fd.append('request', "get");
  fd.append('message_id', `${id}`);
  fd.append("commit", "Update");
  fd.append("controller", "messages");
  fd.append("action", "update");

  $.ajax({
      type: 'POST',
      url: '/messages/index',
      data: fd,
      processData: false,
      contentType: false
  }).done(function(data) {
    onReceivedMessage(data,true);
  });
}

function queryHistoryMessages(guide_id){
  var frm = Q1("#hidden_chat_message_form");
  if(!frm)return;

  var fd = new FormData();
  fd.append(frm.children[0].name, frm.children[0].value)
  fd.append(frm.children[1].name, frm.children[1].value)
  fd.append('request', "query");
  fd.append('guide_id', `${guide_id}`);
  fd.append("commit", "Update");
  fd.append("controller", "messages");
  fd.append("action", "update");

  $.ajax({
      type: 'POST',
      url: '/messages/index',
      data: fd,
      processData: false,
      contentType: false
  }).done(function(data) {
    history_message = data.result;
    if(history_message && history_message.length){
      E("chat_item_history").classList.remove("hidden");
      onclick("chat_item_more",e=>{
        for(var i=0; i<10 && history_message.length ; i++){
          getHistoryMessage(history_message.pop());
        }
      });
    }
  });
}

var inputStatusFunction;
function initShowGuidePage(){
  var guide_id;
  var pathname = location.pathname.match(/\/guides\/([0-9]+)/);
  if(pathname && pathname.length>1)
    guide_id = pathname[1];

  inputStatusFunction = initStreetViewWithMap(sendGuideData);
  if(!App.guideChannel || !App.statusChannel){
    createGuideChannel(guide_id, onReceivedStatus, onReceivedMessage);
  }

  setReloadMap(initStreetViewWithMap,sendGuideData);
  onclick("stop_guide_show", destroyGuideChannel);
  requestUpdateStatus();
  onclick("chat_input_send", e=>{
    var msg = E("chat_input_message");
    if(msg.value.length)
      sendChatMessage(msg.value);
  });

  if(guide_id)
    queryHistoryMessages(guide_id);
}

function onReceivedStatus(data){
  if(inputStatusFunction)
    inputStatusFunction(data);
}

function onClickedGuideShow(e){
  var guide_id = e.target.id.match(/show_guide_link_([0-9]+)/);
  createGuideChannel(guide_id[1], onReceivedStatus, onReceivedMessage);
}

function initIndexGuidePage(){
  Q(".show_guide_link").forEach(e=>{
    e.addEventListener('click', onClickedGuideShow);
  });
}
