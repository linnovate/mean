var DependableList = require('dependable-list'),
    Dependable = DependableList.dependableConstructor(),
    inherit = require('./inherit'),
    path = require('path');

function hasname(targetname,dep){
  return targetname===dep.name;
}

function depChecker(targetdep,depfromlist,depfromlistcontainer){
  targetdep.resolve(depfromlist.name);
  if(targetdep.resolved()){
    return depfromlistcontainer;
  }
}

function addToListOfUnresolved(lobj,unres){
  lobj.list.push(unres.name);
}

function ModuleList(){
  DependableList.call(this);
}
inherit(ModuleList,DependableList);
ModuleList.prototype.dependableConstructor = function(){
  return Module;
};
ModuleList.prototype.createModule = function(name,version,source){
  return new Module(name,version,source);
};
ModuleList.prototype.moduleNamed = function(name){
  return this.findOne(hasname.bind(null,name));
};

function Module(name,version,source){
  this.name = name;
  this.version = version;
  this.source = source;
  Dependable.call(this);
  this.aggregatePackage();
}
inherit(Module,Dependable);
Module.prototype.destroy = function(){
  Dependable.prototype.destroy.call(this);
  this.source = null;
  this.version = null;
  this.name = null;
};
Module.prototype.path = function(extra){
  return path.join(process.cwd(), this.source, this.name, extra);
};
Module.prototype.activate = function(){
  var req = require(this.path('app.js'));
  if(req && 'function' === req.init){
    req.init(this); //so that app.js of a package may export the init function to learn about its name, source, dependencies
  }
};

module.exports = ModuleList;
