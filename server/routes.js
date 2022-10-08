import config from "./config.js";
import { Controller } from './controller.js';
import ytdl from 'ytdl-core';
import { getParams } from './util.js';

const {
  location,
  dir: {
    publicDirectory
  }
} = config;

const controller = new Controller();

async function routes(request, response) {
  const { method, path, url } = request;
  
  console.log( { method, path, url });

  if( method === 'GET' && path === '/' ) {
    response.writeHead(302, {
        'Location': location.home
    });
    return response.end();
  }
  
  else if (method === 'GET' && path === '/home') {

    response.writeHead(200, {'Content-Type': 'text/html'});

    let dir = `${publicDirectory}/home/index.html`;
    
    const { error, data } = await controller.getFileStream(dir);

    if (error) {
      response.writeHead(404);
      response.write("File Not Found");
    } else {
      response.write(data);
    }

    return response.end();
  }

  else if (method === 'GET' && path === '/download') {
   
   try {
    const { url } = request.params;

    if (!url) {
      response.writeHead(401);
      return response.end("URL is required.");
    }

    response.setHeader('Content-Type', 'video/mp4');
    response.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    response.writeHead(200, {'Content-Type': 'video/mp4'});

    let url_youTube = String(url);
  
    return ytdl(url_youTube, {format: 'mp4'}).pipe(response);

   } catch (error) {
    response.writeHead(400);
    return response.end();
   }

  }

  else {
    response.writeHead(404);
    return response.end();
  }

}

function handlerError(err, response) {
  if (err.message.includes('ENOENT')) {
    response.writeHead(404);
  }
  console.error(`caught error on API: ${error.stack}`);
  response.writeHead(500);
  return response.end();
}

export function handler(request, response) {
  request.params = getParams(request);

  	// Set CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', 'GET');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', '*');
    if ( request.method === 'OPTIONS' ) {
      response.writeHead(200);
      response.end();
      return;
    }

  let [origin, _] = request.url.split('?');
  request.path = origin;

  return routes(request, response).catch(err => {
    handlerError(err, response);
  })
}