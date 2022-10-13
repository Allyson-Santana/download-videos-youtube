"use strict";

        function handlerError(message, time) {
          let msg =  document.querySelector("#message");
          msg.innerHTML = message;
          setTimeout(() => msg.innerHTML = "", time);
        }

        function handlerSubmit() {
          let url_youtube = String(document.querySelector('#url-youtube').value);
          let url = url_youtube.trim();

          if (url_youtube === undefined || url_youtube === null || url === '') {
            console.log("Error: URL YouTube is required");
            handlerError("Qual a URL?", 3000);
            return;
          }
          
          var redirect = '';
          
          //videoonly, audioonly, audioandvideo
          const form = document.querySelector('#formOption'); 
          const option = form.option.value;

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
            handlerError("Escolha uma opção de download", 3000);
            throw new Error('Option not exists');
          }
          
          window.location.replace(redirect);
          handlerError("Agurde o processamento do video...", 4500);
        }