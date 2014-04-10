
var db =connect("localhost/mean-dev");

var _group =[
            {
                'gid':0,
                'group_type':'虚拟组',
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
            db.groups.dropIndexes();
            _group.forEach(function (value) {
                db.groups.insert(value);
            });
        } catch (e){
            print(e);
        }

// insert to companygroups for test
/*
var user = db.users.findOne();
var company = db.companies.findOne();
var group = db.groups.findOne();

var gm1 = {
  group: {
    gid: '1',
    group_type: '足球'
  },
  active: true,
  date: '20140401',
  poster: {
    cid: company.id,
    uid: user.id,
    cname: company.info.name,
    realname: user.realname,
    username: user.username,
    role: 'LEADER'
  },
  content: '足球比赛'
};

var gm2 = {
  group: {
    gid: '4',
    group_type: '游泳'
  },
  active: true,
  date: '20140401',
  poster: {
    cid: company.id,
    uid: user.id,
    cname: company.info.name,
    realname: user.realname,
    username: user.username,
    role: 'LEADER'
  },
  content: '搏击大海'
};

db.groupmessages.insert(gm1);
db.groupmessages.insert(gm2);

var campaign = {
    campaign: {
        gid: [group.id],
        group_type: [group.group_type],
        cid: [company.id],
        cname: [company.name],
        poster: {
            cid: company.id,
            uid: user.id,
            cname: company.info.name,
            realname: user.realname,
            username: user.username,
            role: 'LEADER'
        },
        content: '测试活动',
        member: [
            {
            cid: company.id,
            gid: group.id,
            uid: user.id
            }
        ]
    },
    create_time: '20140401',
    start_time: '20140405',
    end_time: '20140606'
};

db.campaigns.insert(campaign);
*/