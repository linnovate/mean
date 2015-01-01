'use strict';

var fs = require('fs'),
  request = require('request'),
  _ = require('lodash'),
  uglify = require('uglify-js'),
  crypto = require('crypto'),
  path = require('path');

var aggregated = {
  header: {
    js: {
      data: null,
      weights: []
    },
    css: {
      data: null,
      weights: []
    }
  },
  footer: {
    js: {
      data: null,
      weights: []
    },
    css: {
      data: null,
      weights: []
    }
  }
};

function sortAggregateAssetsByWeight() {
  for (var region in aggregated) {
    for (var ext in aggregated[region]) {
      sortByWeight(region, ext);
    }
  }
}

function appendItem(arry,item){
  arry.push(item.src);
}

function sortByWeight(group, ext) {
  var weights = aggregated[group][ext].weights;
  var temp = [], src = [];

  for (var file in weights) {
    temp.push({
      src: file,
      data: weights[file].data,
      weight: weights[file].weight
    });
  }
  var sorted = _.sortBy(temp, 'weight');
  aggregated[group][ext].data = _.map(sorted, function(value) {
    return value.data;
  }).join('\n');
  _.map(sorted, appendItem.bind(null,src));
  aggregated[group][ext].src = src;
}

function Aggregator(options, libs, config) {
  this.options = options;
  this.libs = libs;
  this.config = config;
}

Aggregator.prototype.addInlineCode = function(ext, data) {
  var md5 = crypto.createHash('md5');
  md5.update(data);
  var hash = md5.digest('hex');
  this.pushAggregatedData(ext, hash, data);
};

Aggregator.prototype.processFileOfFile = function(ext, filepath, fileErr, data) {
  var filename = filepath.split(process.cwd())[1] || '/'+filepath;
  this.pushAggregatedData(ext, filename, data);
};

Aggregator.prototype.processDirOfFile = function(ext, filepath, err, files) {
  if (files) return this.readFiles(ext, filepath);
  filepath = filepath.split('?')[0]; //fixes assetmanager 1.1.2 which adds query to the file ("file.js?3165464")
  if (path.extname(filepath) !== '.' + ext) return;
  if(this.config.aggregate===false){
    if(fs.existsSync(filepath)){
      this.processFileOfFile(ext, filepath);
    }
  }else{
    fs.readFile(filepath, this.processFileOfFile.bind(this, ext, filepath));
  }
};

Aggregator.prototype.readFile = function(ext, filepath) {
  fs.readdir(filepath, this.processDirOfFile.bind(this, ext, filepath));
};

Aggregator.prototype.processFileOfDirOfFiles = function(ext, filepath, file) {
  if (!this.libs && (file !== 'assets' && file !== 'tests')) {
    this.readFile(ext, path.join(filepath, file));
  }
};

Aggregator.prototype.processDirOfFiles = function(ext, filepath, err, files) {
  if (err) return;
  files.forEach(this.processFileOfDirOfFiles.bind(this, ext, filepath));
};

Aggregator.prototype.readFiles = function(ext, filepath) {
  fs.readdir(filepath, this.processDirOfFiles.bind(this, ext, filepath));
};

Aggregator.prototype.getRemoteCode = function(ext, asset) {
  var self = this;
  request(asset, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      self.addInlineCode(ext, body);
    }
  });
};

Aggregator.prototype.pushAggregatedData = function(ext, filename, data) {
  var group = this.options.group || 'footer',
      weight = this.options.weight || 0;

  if(data){
    if (ext === 'js') {

      var code = this.options.global ? data.toString() + '\n' : '(function(){' + data.toString() + '})();';
      var ugly;
      try {
        ugly = this.config.debug ? {code:code} : uglify.minify(code, {
          fromString: true,
          mangle: false
        });
      }
      catch (e) {
        console.log('\\n\nError in file ' + filename + ' on line ' + e.line);
        console.log(e.message);
        throw e;
      }

      aggregated[group][ext].weights[filename] = {
        weight: weight,
        data: ugly.code
      };
    } else {
      group = this.options.group || 'header';

      aggregated[group][ext].weights[filename] = {
        weight: weight,
        data: data.toString()
      };
    }
  }else{
    aggregated[group][ext].weights[filename] = {
      weight: weight
    };
  }
};

function supportAggregate(Meanio) {

  Meanio.prototype.aggregated = function(ext, group, callback) {
    // Aggregated Data already exists and is ready
    if (Meanio.Singleton.config.clean.aggregate === false){
      return callback('');
    }
    if (aggregated[group][ext].data) return callback(aggregated[group][ext].data);

    // No aggregated data exists so we will build it
    sortAggregateAssetsByWeight();

    // Returning rebuild data. All from memory so no callback required
    callback(aggregated[group][ext].data);
  };

  Meanio.prototype.aggregatedsrc = function(ext, group, callback) {
    // Aggregated Data already exists and is ready
    if (Meanio.Singleton.config.clean.aggregate !== false){
      if(ext==='js'){
        if(group==='header'){
          return callback(['/modules/aggregated.js?group=header']);
        }else{
          return callback(['/modules/aggregated.js']);
        }
      }else if(ext==='css' && group==='header'){
        return callback(['/modules/aggregated.css']);
      }
      return callback([]);
    }
    if (aggregated[group][ext].src) return callback(aggregated[group][ext].src);

    // No aggregated data exists so we will build it
    sortAggregateAssetsByWeight();

    // Returning rebuild data. All from memory so no callback required
    callback(aggregated[group][ext].src);
  };

  // Allows rebuilding aggregated data
  Meanio.prototype.rebuildAggregated = function() {
    sortAggregateAssetsByWeight();
  };

  Meanio.prototype.Module.prototype.aggregateAsset = function(type, asset, options) {
    options = options || {};
    if (!options.inline && !options.absolute && !options.url) {
      asset = path.join(Meanio.modules[this.name].source, this.name, 'public/assets', type, asset);
    }
    Meanio.aggregate(type, asset, options, Meanio.Singleton.config.clean);
  };

  Meanio.onModulesFoundAggregate = function(ext, options) {
    var config = Meanio.Singleton.config.clean;
    var aggregator = new Aggregator(options, false, config);
    for (var name in Meanio.modules) {
      aggregator.readFiles(ext, path.join(process.cwd(), Meanio.modules[name].source, name.toLowerCase(), 'public'));
    }
  };

  Meanio.aggregate = function(ext, asset, options, config) {
    var aggregator;
    options = options || {};
    if (!asset) {
      return;
    }
    aggregator = new Aggregator(options, true, config);
    if (options.inline) return aggregator.addInlineCode(ext, asset);
    else if (options.url) return aggregator.getRemoteCode(ext, asset);
    else if (options.singlefile) return aggregator.processDirOfFile(ext, asset);
    else return aggregator.readFile(ext, path.join(process.cwd(), asset));
  };

  Meanio.prototype.aggregate = Meanio.aggregate;
}

module.exports = supportAggregate;
