var args = process.argv.slice(2);

if (~args.indexOf('meanio') && (~args.indexOf('-g') || ~args.indexOf('--global'))) {
  console.log('Please install \'mean-cli\' globally instead of \'meanio\' as:');
  console.log('');
  console.log('  $ npm install -g mean-cli');
  console.log('');
  process.exit(1);
} else if (~args.indexOf('mean-cli')) {
  var spawn = require('child_process').spawn;
  npmls = spawn('npm', ['ls', '--global', '--parseable', '--depth', '0']),
  grep = spawn('grep', ['meanio']);

  npmls.stdout.on('data', function(data) {
    grep.stdin.write(data);
  });

  npmls.on('close', function(code) {
    grep.stdin.end();
  });

  grep.stdout.on('data', function(data) {
    console.log('' + data);
  });

  grep.on('close', function(code) {
    // meanio global was found
    if (code === 0) {
      console.log('  Please run \'npm uninstall -g meanio\' prior to installing mean-cli');
      console.log('');
      process.exit(1);
    }
  });
}
