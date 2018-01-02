function createGuideChannel(cb){
  var pathname = location.pathname.match(/\/guides\/([0-9]+)/);
  if(pathname && pathname.length>1){
    App.guideChannel = App.cable.subscriptions.create(
      { channel: "GuideChannel",id: pathname[1]},
      {
        received: (data) => {
          if(E("map_ctrl") && cb )
            cb(data);
        }
      }
    );
  }
}

function sendGuideData(data){
    App.guideChannel.send(data);
}
