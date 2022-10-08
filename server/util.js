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