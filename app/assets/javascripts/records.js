// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/
var mediaRecorder;
var video;

function initVideo(video_element){
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {

      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }

  navigator.mediaDevices.getUserMedia({ audio: true,
      video: {width: { min: 160, ideal: 320, max: 640 },
              height: { min: 120, ideal: 240, max: 480 } } })
  .then(function(stream) {
    var options = {
      audioBitsPerSecond : 32000,
      videoBitsPerSecond : 500000,
      mimeType : "video/webm;codecs=h264"
    }
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = function(e) {
      var frm = Q1("#hidden_chat_message_form");
      if(!frm)return;

      var fd = new FormData();
      fd.append(frm.children[0].name, frm.children[0].value)
      fd.append(frm.children[1].name, frm.children[1].value)
      fd.append('fname', 'test.webm');
      fd.append('data', e.data);
      fd.append("commit", "Update");
      fd.append("controller", "view_sequences");
      fd.append("action", "update");
      $.ajax({
          type: 'POST',
          url: '/view_sequences/video',
          data: fd,
          processData: false,
          contentType: false
      }).done(function(data) {
      });
    }
    mediaRecorder.onerror = function(e) {
      console.log("Error: "+e.name+" -- "+e.message);
    }
    mediaRecorder.onstart = function(e) {
      console.log("ok, started");
    }
    mediaRecorder.onstop = function(e) {
      console.log("oop, stopped");
    }
    //*
    video = document.querySelector(video_element);
    // Older browsers may not have srcObject
    if ("srcObject" in video) {
      video.srcObject = stream;
    } else {
      // Avoid using this in new browsers, as it is going away.
      video.src = window.URL.createObjectURL(stream);
    }
    video.onloadedmetadata = function(e) {
      video.muted = true;
      video.play();
    };
    //*/
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
}

function startRecord(){
  if(mediaRecorder)
    mediaRecorder.start(33);
}

function stopRecord(){
  if(mediaRecorder)
    mediaRecorder.stop();
}

var StartedRecording;
function sendViewSequenceData(data){
  if(!StartedRecording)
    return;

  var frm = Q1("#hidden_chat_message_form");
  if(!frm)return;

  var fd = new FormData();
  fd.append(frm.children[0].name, frm.children[0].value)
  fd.append(frm.children[1].name, frm.children[1].value)
  fd.append('latitude', data.latitude);
  fd.append('longitude', data.longitude);
  fd.append('heading', data.heading);
  fd.append('pitch', data.pitch);
  fd.append("commit", "Update");
  fd.append("controller", "view_sequences");
  fd.append("action", "update");
  $.ajax({
      type: 'POST',
      url: '/view_sequences/sequence',
      data: fd,
      processData: false,
      contentType: false
  }).done(function(data) {
  });
}

function updateStatus(status){
  var frm = Q1("#hidden_chat_message_form");
  if(!frm)return;

  var record_id;
  var pathname = location.pathname.match(/\/records\/([0-9]+)/);
  if(pathname && pathname.length>1)
    record_id = pathname[1];


  var fd = new FormData();
  fd.append(frm.children[0].name, frm.children[0].value)
  fd.append(frm.children[1].name, frm.children[1].value)
  fd.append('record[status]', status);
  fd.append("commit", "Update");
  fd.append("controller", "records");
  fd.append("_method", "patch");
  $.ajax({
      type: 'POST',
      url: `/records/${record_id}`,
      data: fd,
      processData: false,
      contentType: false
  }).done(function(data) {
  });
}

function onStartStop(e){
  if(e.target.value=="Start"){
    StartedRecording = true;
    startRecord();
    var data={
      latitude: Q1("#lat").innerText,
      longitude: Q1("#lon").innerText,
      heading: Q1("#heading").innerText,
      pitch: Q1("#pitch").innerText
    };
    sendViewSequenceData(data);
    e.target.value='Stop';
    updateStatus(2);
  } else {
    stopRecord();
    StartedRecording = false;
    updateStatus(3);
  }
}

function initRecordingPage(){
  setReloadMap(initStreetViewWithMap,sendViewSequenceData);
  initVideo("#video_view_video");
  onclick("start_stop_record_button", onStartStop);
}
