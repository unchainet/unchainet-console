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
  let name = user.data.name.replace(/\s/g,'');
  name = name.trim();
  name = name + '-' + randHex(8);
  return name;
};