'use strict';
var _ = require('lodash');

//helper functions
function extractNames (v) {
  return v.name;
}

function get_get (roles,v) {
  return v.get(roles);
}

function remove_nulls (v) {
  return v;
}

//MenuItem class
function MenuItem (options) {
  options = _.assign ({name: null, title:null, link:null, roles:null}, options);
  options.name = options.name || (options.link ? options.link.replace('/','_') : undefined) || options.title;
  this.name = options.name;
  this.title = options.title;
  this.link = options.link;
  this.roles = options.roles;
  this.icon = options.icon;
  this.submenus = options.submenus || [];
}

function mapDoStrip (v) {
  return v ? v.strip() : undefined;
}

MenuItem.prototype.strip = function () {
  return {
    name: this.name, 
    title:this.title,
    link: this.link,
    roles:this.roles,
    icon: this.icon,
    submenus: this.submenus.map(mapDoStrip)
  };
};


MenuItem.hasRole = function (role, roles) {
  return (roles.indexOf(role) > -1);
};

MenuItem.prototype.props = function () {
  return {
    name: this.name,
    title:this.title,
    link:this.link,
    icon: this.icon,
    roles:this.roles
  };
};

MenuItem.prototype.findOrCreate = function (path) {
  if (!path.length) return this;
  var p = path.shift();
  var index = this.list().indexOf(p);
  if (index > -1) return this.submenus[index].findOrCreate(path);
  var n = new MenuItem();
  n.name = p;
  this.submenus.push (n);
  return n.findOrCreate(path);
};

MenuItem.prototype.list = function () {
  return this.submenus.map(extractNames);
};

MenuItem.prototype.get = function (roles, path) {
  roles = roles ? roles.slice() : [];
  if (roles.indexOf('anonymous') < 0 && roles.indexOf('authenticated') < 0) {
    roles.push ('authenticated');
  }
  if (roles.indexOf('all') < 0) roles.push('all');

  var list = this.list();
  if (path) {
    if (!path.length) return this;
    var n = path.shift();
    var index = list.indexOf (n);
    return this.submenus[index] ? this.submenus[index].get(roles,path) : undefined;
  }

  if(!MenuItem.hasRole('admin', roles)) {
    if (this.roles) {
      if (!_.intersection(this.roles, roles).length) return undefined;
    }
  }

  return new MenuItem ({
    roles: this.roles || null,
    link : this.link || null,
    title:this.title || null,
    name : this.name || null,
    icon : this.icon || null,
    submenus : this.submenus.map(get_get.bind(null, roles)).filter(remove_nulls),
  });
};

MenuItem.prototype.add = function (mi) {
  var index = this.list().indexOf(mi.name);
  var itm;
  if (index > -1) {
    var ts = mi.props();
    itm = this.submenus[index];
    for (var i in ts) itm[i] = ts[i];
  }else{
    itm = mi;
    this.submenus.push (itm);
  }
  return itm;
};

var allMenus = new MenuItem (),
  _ = require('lodash');
function Menus() {
}

function supportMenus(Meanio){


  Menus.prototype.add = function(options) {
    if (arguments.length === 0) return this;
    if (options instanceof Array) {
      options.forEach( Menus.prototype.add.bind(this) );
      return this;
    }
    if (arguments.length > 1) {
      Array.prototype.forEach.call(arguments,this.add.bind(this));
      return this;
    }
    
    //fixes scaffolding: menu=path
    if(options.menu !== undefined) {
      options.path = options.menu;
    }
    
    options = _.assign({
      path : 'main', 
      roles: ['anonymous'],
    },
    options);
    options.path = options.path.replace(/^\//, '');
    var item = allMenus.findOrCreate(options.path.split('/'));
    item.add(new MenuItem(options));
    return this;
  };

  Menus.prototype.get = function(options) {
    options = options || {};
    options.menu = options.menu || 'main';
    options.roles = options.roles || ['anonymous'];
    options.defaultMenu = options.defaultMenu || [];

    var sm = allMenus.get(options.roles, options.menu.split('/'));
    if (!sm) {
      //no menu at all
      return options.defaultMenu;
    }
    var ret = sm.get(options.roles);
    return ret ? options.defaultMenu.concat(ret.submenus.map(mapDoStrip)) : options.defaultMenu; 
  };
  Meanio.prototype.Menus =  Menus;

}

module.exports = supportMenus;
