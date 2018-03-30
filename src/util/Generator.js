//  random hex string generator
function randHex(len) {
  var maxlen = 8,
  min = Math.pow(16,Math.min(len,maxlen)-1),
  max = Math.pow(16,Math.min(len,maxlen)) - 1,
    n   = Math.floor( Math.random() * (max-min+1) ) + min,
    r   = n.toString(16);
  while ( r.length < len ) {
    r = r + randHex( len - maxlen );
  }
  return r;
};

export function genWorkloadName(user=null){
  if(user === null || !user.data || !user.data.name)
    return '';
  let name = user.data.name.replace(/\W+/g, '').toLowerCase();
  name = name.trim();
  name = name + '-' + randHex(8);
  return name;
};


function randomByte() {
  return Math.round(Math.random()*256);
}

 function isPrivate(ip) {
  return /^10\.|^192\.168\.|^172\.16\.|^172\.17\.|^172\.18\.|^172\.19\.|^172\.20\.|^172\.21\.|^172\.22\.|^172\.23\.|^172\.24\.|^172\.25\.|^172\.26\.|^172\.27\.|^172\.28\.|^172\.29\.|^172\.30\.|^172\.31\./.test(ip);
}

export function randomIp() {
  var ip = randomByte() +'.' +
    randomByte() +'.' +
    randomByte() +'.' +
    randomByte();
  if (isPrivate(ip)) return randomIp();
  return ip;
}