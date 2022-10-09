"use strict";

function handlerSubmit() {
  let url_youtube = String(document.querySelector('#url-youtube').value);
  let url = url_youtube.trim();

  if (url_youtube === undefined || url_youtube === null || url === '') {
    console.log("Error: URL YouTube is required");
    return;
  }
  
  //videoonly, audioonly, audioandvideo
  const form = document.querySelector('#formOption'); 
  let redirect = form.option.value;

  if (option === 'videoonly') {
    redirect = `${window.location.origin}/download/videoonly?url=${url}`
  }

  else if (option === 'audioonly') {
    redirect = `${window.location.origin}/download/audioonly?url=${url}`
  }

  else if (option === 'audioandvideo') {
    redirect = `${window.location.origin}/download/audioandvideo?url=${url}`
  }

  else {
    throw new Error('Option not exists');
  }
  
  window.location.replace(redirect);
  
  let msg =  document.querySelector("#message");

  msg.innerHTML = "Agurde o processamento do video...";

  setTimeout(() => msg.innerHTML = "", 4000);

}