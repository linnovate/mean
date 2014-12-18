function ServerEngine(){
}
ServerEngine.prototype.name = function(){
  return 'null server engine';
};
ServerEngine.prototype.destroy = function(){
};
ServerEngine.prototype.beginBootstrap = function(meanioinstance, database){
};
ServerEngine.prototype.endBootstrap = function(callback){
};
ServerEngine.produceEngine = function(enginename){
  var engine;
  switch(enginename || 'express'){
    case 'express':
      engine = new (require('./ExpressEngine'))();
      break;
    default:
      throw 'Server Engine '+enginename+' not supported';
  }
  return engine;
};

module.exports = ServerEngine;
