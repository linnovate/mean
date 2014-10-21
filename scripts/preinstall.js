'use strict';

var args = process.argv;
if (process.env.npm_config_argv) {
  try {
    args = JSON.parse(process.env.npm_config_argv).cooked;
  } catch (e) {}
}

if (~args.indexOf('meanio') && ~args.indexOf('--global')) {
  console.log('Please install \'mean-cli\' globally instead of \'meanio\' as:');
  console.log('');
  console.log('  $ npm install -g mean-cli');
  console.log('');
  process.exit(1);
} else if (~args.indexOf('mean-cli')) {
  var spawn = require('child_process').spawn,
    npmls = spawn('npm', ['ls', '--global', '--json', '--depth', '0']);

  var data = {};
  npmls.stdout.on('data', function(d) {
    data = d;
  });

  npmls.on('close', function() {
    try {
      data = JSON.parse(data);
    } catch (e) {}

    if (data && data.dependencies.meanio) {
      console.log('  Please run \'npm uninstall -g meanio\' prior to installing mean-cli');
      console.log('');
      process.exit(1);
    }
  });
}
