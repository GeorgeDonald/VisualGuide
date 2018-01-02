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

  App.chatChannel = App.cable.subscriptions.create(
    { channel: "ChatChannel", id: guide_id},
    {
      received: (data) => {
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
        if(area.children.length)
          area.insertBefore(ne,area.children[0]);
        else {
          area.appendChild(ne);
        }
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
