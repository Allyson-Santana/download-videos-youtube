"use strict";

function handlerSubmit() {
  let url_youtube = String(document.querySelector('#url-youtube').value);
  let url = url_youtube.trim();

  if (url_youtube === undefined || url_youtube === null || url === '') {
    console.log("Error: URL YouTube is required");
    return;
  }

  let redirect = `${window.location.origin}/download?url=${url}`;
  
  window.location.replace(redirect);
  
  let msg =  document.querySelector("#message");

  msg.innerHTML = "Agurde o processamento do video...";

  setTimeout(() => msg.innerHTML = "", 4000);

}