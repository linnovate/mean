function inherit(a,b){
  a.prototype = Object.create(b.prototype,{constructor:{
    value:a,
    writable:false,
    enumerable:false,
    configurable:false
  }});
}

module.exports = inherit;
