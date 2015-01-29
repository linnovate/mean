var fs = require('fs'),
    Q = require('q'),
    path = require('path');

function readModuleMeanJSONFileDone (_modules, fileDefer, dependable, file, source, fileErr, data){
  var depobj = {};
  if (data) {
    try {
      var json = JSON.parse(data.toString());
      if (json.dependencies) {
        dependable.cloneDependencies(json.dependencies);
      }
    } catch (err) {
      console.log(file,'mean json error',err);
      //fileDefer.reject(err); //don't give up
    }
  }
  _modules.add(dependable);
  fileDefer.resolve();
}

function readModulePackageJSONFileDone (_modules, fileDefer, file, source, fileErr, data) {
  if (data) {
    try {
      var json = JSON.parse(data.toString());
      if (json.mean) {
        fs.readFile(path.join(process.cwd(), source, file, 'mean.json'), readModuleMeanJSONFileDone.bind(null, _modules, fileDefer, _modules.createModule(json.name,json.version,source), file, source));
        return;
      }
    } catch (err) {
      fileDefer.reject(err);
      return;
    }
    fileDefer.resolve();
  }else{
    fileDefer.resolve();
    //fileDefer.reject(fileErr);
  }
}

function fileForEachProcess (_modules, source, promises, file) {
  var fileDefer = Q.defer();
  fs.readFile(path.join(process.cwd(), source, file, 'package.json'), readModulePackageJSONFileDone.bind(null, _modules, fileDefer, file, source));
  promises.push(fileDefer.promise);
}

function processDirFilesFromSearchSource(_modules, disabled, source, deferred, err, files) {
  if (err || !files || !files.length) {
    if (err && err.code !== 'ENOENT') {
      console.log(err);
    } else {
      return deferred.resolve();
    }
    return deferred.reject(err);
  }

  var promises = [];
  for (var i in disabled) {
    var index = files.indexOf(i);
    if (index < 0) continue;
    files.splice(index, 1);
  }

  files.forEach(fileForEachProcess.bind(null, _modules, source, promises));
  return deferred.resolve(Q.all(promises));
}

function searchSourceForFindModules(_modules, disabled, source) {
  var deferred = Q.defer();
  fs.readdir(path.join(process.cwd(), source), processDirFilesFromSearchSource.bind (null, _modules, disabled, source, deferred));
  return deferred.promise;
}

module.exports = searchSourceForFindModules;
