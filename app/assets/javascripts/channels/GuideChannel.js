function createGuideChannel(){
  App.guideChannel = App.cable.subscriptions.create(
    { channel: "GuideChannel"},
    {
      received: (data) => {
      }
    }
  );
  //
  // document.querySelector("#posttext").addEventListener('click',event=>
  //   {
  //     App.guideChannel.send({ body: document.querySelector("#chattext").value });
  //   });
}
