const execSync = require('child_process').execSync;
/**
 * Used to merge webpack configs.
 */
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helpers = require('../helpers');

const REPO_NAME_RE = /Push {2}URL: ((git@github\.com:)|(https:\/\/github\.com\/)).+\/(.+)\.git/;

function getWebpackConfigModule(options) {
  if (options.githubDev) {
    return require('../webpack.dev.js');
  } else if (options.githubProd) {
    return require('../webpack.prod.js');
  } else {
    throw new Error('Invalid compile option.');
  }
}

function getRepoName(remoteName) {
  remoteName = remoteName || 'origin';

  var stdout = execSync('git remote show ' + remoteName),
      match = REPO_NAME_RE.exec(stdout);

  if (!match) {
    throw new Error('Could not find a repository on remote ' + remoteName);
  } else {
    return match[4];
  }
}

function stripTrailing(str, char) {

  if (str[0] === char) {
    str = str.substr(1);
  }

  if (str.substr(-1) === char) {
    str = str.substr(0, str.length - 1);
  }

  return str;
}

/**
 * Given a string remove trailing slashes and adds 1 slash at the end of the string.
 *
 * Example:
 * safeUrl('/value/')
 * // 'value/'
 *
 * @param url
 * @returns {string}
 */
function safeUrl(url) {
  const stripped = stripTrailing(url || '', '/');
  return stripped ? stripped + '/' : '';
}

function replaceHtmlWebpackPlugin(plugins, ghRepoName) {
  for (var i=0; i<plugins.length; i++) {
    if (plugins[i] instanceof HtmlWebpackPlugin) {
      /**
       * Remove the old instance of the html plugin.
       */
      const htmlPlug = plugins.splice(i, 1)[0];
      const METADATA = webpackMerge(htmlPlug.options.metadata, {
        /**
         * Prefixing the REPO name to the baseUrl for router support.
         * This also means all resource URIs (CSS/Images/JS) will have this prefix added by the browser
         * unless they are absolute (start with '/'). We will handle it via `output.publicPath`
         */
        baseUrl: '/' + ghRepoName + '/' + safeUrl(htmlPlug.options.metadata.baseUrl)
      });

      /**
       * Add the new instance of the html plugin.
       */
      plugins.splice(i, 0, new HtmlWebpackPlugin({
        template: htmlPlug.options.template,
        title: htmlPlug.options.title,
        chunksSortMode: htmlPlug.options.chunksSortMode,
        metadata: METADATA,
        inject: htmlPlug.options.inject
      }));
      return;
    }
  }
}
exports.getWebpackConfigModule = getWebpackConfigModule;
exports.getRepoName = getRepoName;
exports.safeUrl = safeUrl;
exports.replaceHtmlWebpackPlugin = replaceHtmlWebpackPlugin;
