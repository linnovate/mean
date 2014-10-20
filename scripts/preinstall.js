process.argv.forEach(function(arg) {
  if (['-g', '--global'].indexOf(arg) > -1) {
    console.log('Please install \'mean-cli\' globally instead of \'meanio\' as:');
    console.log('');
    console.log('  $ npm install -g mean-cli');
    console.log('');
    process.exit(1);
  }
});
