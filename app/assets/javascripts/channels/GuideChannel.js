function createGuideChannel(guide_id, cb){
  App.guideChannel = App.cable.subscriptions.create(
    { channel: "GuideChannel", id: guide_id},
    {
      received: (data) => {
        if(!E("map_ctrl") && cb )
          cb(data);
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
}

function sendGuideData(data){
  if(App.guideChannel)
    App.guideChannel.send(data);
}

function requestUpdateStatus(){
  if(App.statusChannel){
    App.statusChannel.send({request: "update_status"});
  }
}
