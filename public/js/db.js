
var db =connect("localhost/mean-dev");

var _group =[
            {
                'gid':0,
                'group_type':'篮球',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':1,
                'group_type':'足球',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':2,
                'group_type':'排球',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':3,
                'group_type':'桌球',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':4,
                'group_type':'游泳',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':5,
                'group_type':'桌游',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':6,
                'group_type':'阅读',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':7,
                'group_type':'唱歌',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':8,
                'group_type':'写生',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':9,
                'group_type':'桑拿',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':10,
                'group_type':'跳舞',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':11,
                'group_type':'约炮',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            }
        ];
        
        try{
          _group.forEach(function (value) {
            db.groups.insert(value);
          });
        }
        catch (e){
          print(e);
        }

        /*
        for( var i = 0; i < _group.length; i ++) {
          try{
            db.groups.insert(_group[i]);
            print(i);
          } catch (e) {
            print(e);
          }
          
        }
        */
        

