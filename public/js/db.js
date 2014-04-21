'use strict';

var _group =[
            {
                'gid':0,
                'group_type':'虚拟组',
                'entity_type':'virtual',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':1,
                'group_type':'羽毛球',
                'entity_type':'Badminton',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':2,
                'group_type':'蓝球',
                'entity_type':'BasketBall',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':3,
                'group_type':'阅读',
                'entity_type':'Reading',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':4,
                'group_type':'自行车',
                'entity_type':'Bicycle',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':5,
                'group_type':'台球',
                'entity_type':'TableTennis',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':6,
                'group_type':'钓鱼',
                'entity_type':'Fishing',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':7,
                'group_type':'足球',
                'entity_type':'FootBall',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':8,
                'group_type':'k歌',
                'entity_type':'KTV',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':9,
                'group_type':'户外',
                'entity_type':'OutDoor',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':10,
                'group_type':'乒乓球',
                'entity_type':'PingPong',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':11,
                'group_type':'跑步',
                'entity_type':'Running',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':12,
                'group_type':'游泳',
                'entity_type':'Swimming',
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