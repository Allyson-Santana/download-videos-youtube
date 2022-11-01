import config from "./config.js";
import { Controller } from './controller.js';
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
  
  // console.info( { method, path, url });

  if( method === 'GET' && path === '/' ) {
    response.writeHead(302, {
        'Location': location.home
    });
    return response.end();
  }
  
  else if (method === 'GET' && path === '/home' || path === '/download') {
    response.writeHead(200, {'Content-Type': 'text/html'});
    
    const dir = `${publicDirectory}/home/index.html`;    
    const { error, data } = await controller.getFileStream(dir);

    if (error) {
      response.writeHead(404);
      response.write("File Not Found");
    } else {
      response.write(data);
    }

    return response.end();
  }

  else if (method === 'GET' && path === '/download/videoonly') {
     return controller.downloadVideo(request, response);
  }

  else if (method === 'GET' && path === '/download/audioonly') {
    return controller.downloadAudio(request, response); 
  }

  else if (method === 'GET' && path === '/download/audioandvideo') {
    return controller.downloadAudioAndVideo(request, response); 
  }

  // else if (method === 'GET' && path === '/mergeaudioandvideo') {
  //   return controller.mergeAudioAndVideo(request, response); 
  // }

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