'use strict';

var Platform = function() {
};

Platform.isWin = function() {
  //its always win32 even if its a x64 system
  return process.platform === 'win32';
};

Platform.isMac = function() {
  return process.platform === 'darwin';
};

Platform.isLinux = function() {
  return process.platform === 'linux';
};

module.exports = function(Meanio) {
  Meanio.prototype.platform = Platform;
};
