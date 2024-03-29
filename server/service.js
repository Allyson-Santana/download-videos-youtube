import { readFile } from 'node:fs/promises';
import ytdl from 'ytdl-core';
import ytmux from "./merge-ytdl-core-muxer.js";
import { getContentLength } from './util.js';
import mergeVideoAudio from './merge-video-audio.js';
import { resolve } from 'node:path'

export class Service {

  constructor() {}

  async getFileStream(file) {
    let res = {
      error:  null,
      data: ''
    }

    try {
      const readable = await readFile(file, null);
      res.data = readable;
    } catch (er) {
      res.error = er;
    } finally {
      return res;
    }

  }

  async downloadVideo(request, response) {
    try {
      const { url } = request.params;
  
      if (!url) {
        response.writeHead(401);
        return response.end("URL is required.");
      }
 
      let nmVideo = (new Date()).getTime().toString();

      response.setHeader('Content-Type', 'video/mp4');
      response.setHeader('Content-Disposition', 'attachment; filename="v'+nmVideo+'.mp4"');

      let url_youTube = String(url);

      // const contentLength = await getContentLength(url_youTube);
      // response.writeHead(200, {'Content-Length': contentLength, 'Content-Type': 'video/mp4' });

      let stream = ytdl(url_youTube, {
        format: 'mp4',
        quality: 'highest',
        filter: 'videoonly', 
      })

      stream.pipe(response);

      stream.on('finish', () => {
        return response.end();
      });       


      request.once('close', () => {
        response.end();
        return;
      })
  
     } catch (error) {
      response.writeHead(400);
      return response.end();
     }
  }

  async downloadAudio(request, response) {
    try {
      const { url } = request.params;
  
      if (!url) {
        response.writeHead(401);
        return response.end("URL is required.");
      }
  
      let nmAudio = (new Date()).getTime().toString();
  
      response.setHeader('Content-Type', 'audio/mpeg');
      response.setHeader('Content-Disposition', 'attachment; filename="a'+nmAudio+'.mp3"');
  
      let url_youTube = String(url);

      // const contentLength = await getContentLength(url_youTube);
      // response.writeHead(200, {'Content-Length': contentLength, 'Content-Type': 'audio/mpeg' });
      

      let stream = ytdl(url_youTube, {
        format: 'mp3',
        quality: 'highest',
        filter: 'audioonly' 
      })
      
      stream.pipe(response);

      stream.on('finish', () => {
        console.log("FINISHHH");
        response.end();
      });

      request.once('close', () => {
        response.end();
        return;
      })
  
     } catch (error) {
      response.writeHead(400);
      return response.end();
     }
  }

  async downloadAudioAndVideo(request, response) {
    try {
      const { url } = request.params;
  
      if (!url) {
        response.writeHead(401);
        return response.end("URL is required.");
      }
  
      let nm = (new Date()).getTime().toString();
  
      response.setHeader('Content-Type', 'video/mp4');
      response.setHeader('Content-Disposition', 'attachment; filename="va'+nm+'.mp4"');
  
      let url_youTube = String(url);

      // const contentLength = await getContentLength(url_youTube);
      // response.setHeader('Content-Length', contentLength)
      response.setHeader('Content-Type', 'video/mp4')

      let stream = ytmux(request, url_youTube, {
        format: 'mp4',
      });
      
      stream.pipe(response);

      stream.on('finish', () => {
        return response.end();
      });
  
    } catch (error) {
      response.writeHead(400);
      return response.end();
    }
  }

  async mergeAudioAndVideo(request, response) {
    try {

      let nm =(new Date()).getTime().toString();
  
      response.setHeader('Content-Type', 'video/mp4');
      response.setHeader('Content-Disposition', 'attachment; filename="va'+nm+'.mp4"');

      response.writeHead(200, {'Content-Type': 'video/mp4' });
      
      try {
        const nameVideo = resolve('./');
        const nameAudio = resolve('./');

        let stream = mergeVideoAudio(nameVideo, nameAudio);
        
        stream.pipe(response);
  
        stream.on('finish', () => response.end());    
      } catch (error) {
        console.error("OPA => ", error)
      }
  
    } catch (error) {
      response.writeHead(400);
      return response.end();
    }
  }

}