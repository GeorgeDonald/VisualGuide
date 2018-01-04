function createGuideChannel(guide_id, guide_cb, msg_cb){
  App.guideChannel = App.cable.subscriptions.create(
    { channel: "GuideChannel", id: guide_id},
    {
      received: (data) => {
        if(!E("map_ctrl") && guide_cb )
          guide_cb(data);
      }
    }
  );

  App.statusChannel = App.cable.subscriptions.create(
    { channel: "StatusChannel", id: guide_id},
    {
      received: (data) => {
        if(!E("map_ctrl"))
          E("guide_status").innerText=data.active?"Guiding":"Stopped";
        E("guide_followers").innerText=data.followers;
      }
    }
  );

  App.chatChannel = App.cable.subscriptions.create(
    { channel: "ChatChannel", id: guide_id},
    {
      received: (data) => {
        msg_cb(data)
      }
    }
  );
}

function destroyChannel(chan){
  if(chan)
    App.cable.subscriptions.remove(chan);
}

function destroyGuideChannel(){
  destroyChannel(App.guideChannel);
  App.guideChannel=undefined;
  destroyChannel(App.statusChannel);
  App.statusChannel=undefined;
  destroyChannel(App.chatChannel);
  App.chatChannel=undefined;
}

function sendGuideData(data){
  if(App.guideChannel)
    App.guideChannel.send(data);
}

function sendChatMessage(msg){
  if(App.chatChannel)
    App.chatChannel.send({message: msg});
}

function requestUpdateStatus(){
  if(App.statusChannel){
    App.statusChannel.send({request: "update_status"});
  }
}
