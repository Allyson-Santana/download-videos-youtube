import https from 'https'
import ytdl from 'ytdl-core';
import urlLib from 'url'

export function getParams(req){
  let q = req.url.split('?');
  let result = {};


  if (q.length >= 2) {
    let [name, value] = q[1].split('=');

    q.shift();
    q.shift();
  
    if (q.length > 0) {
      for (const key in q) {
        const element = q[key];
        value += `?${element}`
      }
    }
      
    result[name] = value;
  }

  return result;
}

export async function getContentLength(url) {
  return new Promise( (resolve, reject) => {
    try {
      const video = ytdl(url, { range: { start: 0, end: 1000 } });
      video.on('info', (info, format) => {
        let options = urlLib.parse(format.url);
        options.method = 'HEAD';

        https.request(options, (res) => {
          resolve(res.headers['content-length']);
        }).end()
        
      });
    } catch (error) {
      console.log("=>", error)
      reject(error)
    }
  })
}