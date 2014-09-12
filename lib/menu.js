var allMenus = [];

function supportMenus(Meanio){
  function Menus() {
  };
  Menus.prototype.add = function(options) {
    //console.log('adding menu',options);
    if (!Array.isArray(options)) options = [options];

    options.forEach(function(opt) {
      opt.menu = opt.menu || 'main';
      opt.roles = opt.roles || ['anonymous'];
      allMenus[opt.menu] = allMenus[opt.menu] || [];
      allMenus[opt.menu].push(opt);
    });
    //console.log('finally',allMenus);
    return this;
  };

  Menus.prototype.get = function(options) {
    var allowed = [];
    options = options || {};
    options.menu = options.menu || 'main';
    options.roles = options.roles || ['anonymous'];
    options.defaultMenu = options.defaultMenu || [];

    var items = options.defaultMenu.concat(allMenus[options.menu] || []);
    items.forEach(function(item) {

      var hasRole = false;
      options.roles.forEach(function(role) {
        if (role === 'admin' || item.roles.indexOf('anonymous') !== -1 || item.roles.indexOf(role) !== -1) {
          hasRole = true;
        }
      });

      if (hasRole) {
        allowed.push(item);
      }
    });
    //console.log('getting menu for',options,'=>',allowed);
    return allowed;
  };
  Meanio.prototype.Menus =  Menus;

};

module.exports = supportMenus;
