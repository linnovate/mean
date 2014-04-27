'use strict';
//组件脚本
var _group =[
            {
                'gid':'0',
                'group_type':'虚拟组',
                'entity_type':'virtual',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'1',
                'group_type':'羽毛球',
                'entity_type':'Badminton',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'2',
                'group_type':'蓝球',
                'entity_type':'BasketBall',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'3',
                'group_type':'阅读',
                'entity_type':'Reading',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'4',
                'group_type':'自行车',
                'entity_type':'Bicycle',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'5',
                'group_type':'台球',
                'entity_type':'TableTennis',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'6',
                'group_type':'钓鱼',
                'entity_type':'Fishing',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'7',
                'group_type':'足球',
                'entity_type':'FootBall',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'8',
                'group_type':'k歌',
                'entity_type':'KTV',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'9',
                'group_type':'户外',
                'entity_type':'OutDoor',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'10',
                'group_type':'乒乓球',
                'entity_type':'PingPong',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'11',
                'group_type':'跑步',
                'entity_type':'Running',
                'icon':'default',
                'active':true,
                'group_rule':'default'
            },
            {
                'gid':'12',
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
        };
//公司脚本
var _company = [
    {
        'id': '0001-0001-0001-0001-000100010001',
        'username': 'donler',
        'login_email': 'hr@55yali.com',
        'hashed_password': 'vZRsWfoPblxHVF0lXGAjS8nX2dpPuZuo7CM3OWjWpVVX9xUCeNcI29LinkN5sUyQAOWI36JJZga8IJT3uWpL4w==',
        'salt': 'wFcQpGsWKS0wgA4y09zkSg==',
        'email':{ "domain" : [  "55yali.com" ] },
        'status': {
            'active': true,
            'date': new Date().getTime()
        },
        'info': {
            'name': '上海动梨信息技术有限公司',
            'city': {
                'province': '上海',
                'city': '上海',
            'address': '上海市',
            'phone': '18801910101',

            //固话
            'lindline': {
                'areacode': '021',         //区号
                'number': '66666666',           //号码
                'extension': '8888'         //分机
            },
            'linkman': '动力',              //联系人
            'email': 'hr@55yali.com',
            'brief': '我们是动力',
            'official_name': '上海动梨信息技术有限公司'
            }
        },
        'register_date': new Date(),
        'provider': 'company',
        'group':[
            {
                "gid" : "1",
                "group_type" : "羽毛球",
                "entity_type" : "Badminton"
            },
            {
                "gid" : "2",
                "group_type" : "蓝球",
                "entity_type" : "BasketBall"
            },
            {
                "gid" : "3",
                "group_type" : "阅读",
                "entity_type" : "Reading"
            },
            {
                "gid" : "4",
                "group_type" : "自行车",
                "entity_type" : "Bicycle",
            },
            {
                "gid" : "6",
                "group_type" : "钓鱼",
                "entity_type" : "Fishing"
            },
            {
                "gid" : "7",
                "group_type" : "足球",
                "entity_type" : "FootBall"
            },
            {
                "gid" : "8",
                "group_type" : "k歌",
                "entity_type" : "KTV"
            },
            {
                "gid" : "9",
                "group_type" : "户外",
                "entity_type" : "OutDoor"
            },
            {
                "gid" : "10",
                "group_type" : "乒乓球",
                "entity_type" : "PingPong"
            },
            {
                'gid':'11',
                'group_type':'跑步',
                'entity_type':'Running'
            },
            {
                'gid':'12',
                'group_type':'游泳',
                'entity_type':'Swimming'
            }]
    },
    {
        'id': '0002-0002-0002-0002-000200020002',
        'username': 'yali',
        'login_email': 'yali_hr@163.com',
        'hashed_password': 'uyHqfnGw7B4Mrz0adXtZ47CVmi2YujUou/Pq6ijQkqgytN47FE6ft5vplCgRgdi05qHxR4sCS1bySCn/6b/wrQ==',
        'salt': 'kbFXuKyh79K9sn9hfPVKRA==',
        'email':{ "domain" : [  "163.com" ] },
        'status': {
            'active': true,
            'date': new Date().getTime()
        },
        'info': {
            'name': '上海鸭梨信息技术有限公司',
            'city': {
                'province': '上海',
                'city': '上海',
            'address': '上海市',
            'phone': '18801910101',

            //固话
            'lindline': {
                'areacode': '021',         //区号
                'number': '66666666',           //号码
                'extension': '8888'         //分机
            },
            'linkman': '鸭梨',              //联系人
            'email': 'yali_hr@163.com',
            'brief': '我们是鸭梨',
            'official_name': '上海鸭梨信息技术有限公司'
            }
        },
        'register_date': new Date(),
        'provider': 'company',
        'group':[
            {
                "gid" : "1",
                "group_type" : "羽毛球",
                "entity_type" : "Badminton"
            },
            {
                "gid" : "2",
                "group_type" : "蓝球",
                "entity_type" : "BasketBall"
            },
            {
                "gid" : "3",
                "group_type" : "阅读",
                "entity_type" : "Reading"
            },
            {
                "gid" : "4",
                "group_type" : "自行车",
                "entity_type" : "Bicycle",
            },
            {
                "gid" : "6",
                "group_type" : "钓鱼",
                "entity_type" : "Fishing"
            },
            {
                "gid" : "7",
                "group_type" : "足球",
                "entity_type" : "FootBall"
            },
            {
                'gid':'11',
                'group_type':'跑步',
                'entity_type':'Running'
            },
            {
                'gid':'12',
                'group_type':'游泳',
                'entity_type':'Swimming'
            }]
    },
    {
        'id': '0003-0001-0003-0003-000300030003',
        'username': 'apple',
        'login_email': 'pingguo_hr@sina.com',
        'hashed_password': 'MSOs/uNdWcrG17ft2mD8tf4npF21uSFxkNUBglBz24ApO5ZNcozjvRPHBWQt2oToMVEZnkW/wys0RCD51B3Llg==',
        'salt': 'JmQmYa6E/GGqVkNB834Fzw==',
        'email':{ "domain" : [  "sina.com" ] },
        'status': {
            'active': true,
            'date': new Date().getTime()
        },
        'info': {
            'name': '上海苹果信息技术有限公司',
            'city': {
                'province': '上海',
                'city': '上海',
            'address': '上海市',
            'phone': '18801910101',

            //固话
            'lindline': {
                'areacode': '021',         //区号
                'number': '66666666',           //号码
                'extension': '8888'         //分机
            },
            'linkman': '苹果',              //联系人
            'email': 'pingguo_hr@sina.com',
            'brief': '我们是苹果',
            'official_name': '上海苹果信息技术有限公司'
            }
        },
        'register_date': new Date(),
        'provider': 'company',
        'group':[
            {
                "gid" : "2",
                "group_type" : "蓝球",
                "entity_type" : "BasketBall"
            },
            {
                "gid" : "4",
                "group_type" : "自行车",
                "entity_type" : "Bicycle",
            },
            {
                "gid" : "6",
                "group_type" : "钓鱼",
                "entity_type" : "Fishing"
            },
            {
                "gid" : "7",
                "group_type" : "足球",
                "entity_type" : "FootBall"
            },
            {
                "gid" : "9",
                "group_type" : "户外",
                "entity_type" : "OutDoor"
            },
            {
                "gid" : "10",
                "group_type" : "乒乓球",
                "entity_type" : "PingPong"
            },
            {
                'gid':'11',
                'group_type':'跑步',
                'entity_type':'Running'
            }]
    },
    {
        'id': '0004-0004-0004-0004-000400040004',
        'username': 'banana',
        'login_email': 'xiangjiao_hr@sohu.com',
        'hashed_password': 'IGY1Vu9Hh5+83bQXI2WkzKX1dBx5YPYzbVdzZU8iyEMSd1W4/6VtSvdSN6gmKLnyanSg1l8mS9DNMXXYqaV8cg==',
        'salt': 'HArJWxTy/vdIQPpwprcOGw==',
        'email':{ "domain" : [  "sohu.com" ] },
        'status': {
            'active': true,
            'date': new Date().getTime()
        },
        'info': {
            'name': '上海香蕉信息技术有限公司',
            'city': {
                'province': '上海',
                'city': '上海',
            'address': '上海市',
            'phone': '18801910101',

            //固话
            'lindline': {
                'areacode': '021',         //区号
                'number': '66666666',           //号码
                'extension': '8888'         //分机
            },
            'linkman': '香蕉',              //联系人
            'email': 'xiangjiao_hr@sohu.com',
            'brief': '我们是香蕉',
            'official_name': '上海香蕉信息技术有限公司'
            }
        },
        'register_date': new Date(),
        'provider': 'company',
        'group':[
            {
                "gid" : "1",
                "group_type" : "羽毛球",
                "entity_type" : "Badminton"
            },
            {
                "gid" : "2",
                "group_type" : "蓝球",
                "entity_type" : "BasketBall"
            },
            {
                "gid" : "3",
                "group_type" : "阅读",
                "entity_type" : "Reading"
            },
            {
                "gid" : "7",
                "group_type" : "足球",
                "entity_type" : "FootBall"
            },
            {
                "gid" : "8",
                "group_type" : "k歌",
                "entity_type" : "KTV"
            },
            {
                "gid" : "9",
                "group_type" : "户外",
                "entity_type" : "OutDoor"
            },
            {
                'gid':'11',
                'group_type':'跑步',
                'entity_type':'Running'
            },
            {
                'gid':'12',
                'group_type':'游泳',
                'entity_type':'Swimming'
            }
        ]
    }
];
try{
    _company.forEach(function (value) {
        db.companies.insert(value);
    });
} catch (e){
    print(e);
};
//员工脚本
var _users =[
{
"active" : true,
"cid" : "0001-0001-0001-0001-000100010001",
"department" : "hr",
"email" : "eric@55yali.com",
"group" : [
    {
        "gid" : "1",
        "group_type" : "羽毛球",
        "entity_type" : "Badminton",
        "leader" : false
    },
    {
        "gid" : "2",
        "group_type" : "蓝球",
        "entity_type" : "BasketBall",
        "leader" : false
    },
    {
        "gid" : "3",
        "group_type" : "阅读",
        "entity_type" : "Reading",
        "leader" : false
    },
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "leader" : true
    },
    {
        "gid" : "8",
        "group_type" : "k歌",
        "entity_type" : "KTV",
        "leader" : false
    }
],
"hashed_password" : "IGY1Vu9Hh5+83bQXI2WkzKX1dBx5YPYzbVdzZU8iyEMSd1W4/6VtSvdSN6gmKLnyanSg1l8mS9DNMXXYqaV8cg==",
"id" : "0001-0001-0001-0001-000100010002",
"nickname" : "eric",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "HArJWxTy/vdIQPpwprcOGw==",
"username" : "eric@55yali.com"
},
{
"active" : true,
"cid" : "0002-0002-0002-0002-000100010002",
"department" : "hr",
"email" : "yali_yg1@163.com",
"group" : [
    {
        "gid" : "1",
        "group_type" : "羽毛球",
        "entity_type" : "Badminton",
        "leader" : false
    },
    {
        "gid" : "2",
        "group_type" : "蓝球",
        "entity_type" : "BasketBall",
        "leader" : false
    },
    {
        "gid" : "3",
        "group_type" : "阅读",
        "entity_type" : "Reading",
        "leader" : false
    },
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "leader" : true
    },
    {
        "gid" : "8",
        "group_type" : "k歌",
        "entity_type" : "KTV",
        "leader" : false
    }
],
"hashed_password" : "IGY1Vu9Hh5+83bQXI2WkzKX1dBx5YPYzbVdzZU8iyEMSd1W4/6VtSvdSN6gmKLnyanSg1l8mS9DNMXXYqaV8cg==",
"id" : "0002-0002-0002-0002-000200020003",
"nickname" : "yali_yg1",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "HArJWxTy/vdIQPpwprcOGw==",
"username" : "yali_yg1@163.com"
},
{
"active" : true,
"cid" : "0001-0001-0001-0001-000100010001",
"department" : "hr",
"email" : "eric@55yali.com",
"group" : [
    {
        "gid" : "1",
        "group_type" : "羽毛球",
        "entity_type" : "Badminton",
        "leader" : false
    },
    {
        "gid" : "2",
        "group_type" : "蓝球",
        "entity_type" : "BasketBall",
        "leader" : false
    },
    {
        "gid" : "3",
        "group_type" : "阅读",
        "entity_type" : "Reading",
        "leader" : false
    },
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "leader" : true
    },
    {
        "gid" : "8",
        "group_type" : "k歌",
        "entity_type" : "KTV",
        "leader" : false
    }
],
"hashed_password" : "IGY1Vu9Hh5+83bQXI2WkzKX1dBx5YPYzbVdzZU8iyEMSd1W4/6VtSvdSN6gmKLnyanSg1l8mS9DNMXXYqaV8cg==",
"id" : "0001-0001-0001-0001-000100010002",
"nickname" : "eric",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "HArJWxTy/vdIQPpwprcOGw==",
"username" : "eric@55yali.com"
},
{
"active" : true,
"cid" : "0001-0001-0001-0001-000100010001",
"department" : "hr",
"email" : "eric@55yali.com",
"group" : [
    {
        "gid" : "1",
        "group_type" : "羽毛球",
        "entity_type" : "Badminton",
        "leader" : false
    },
    {
        "gid" : "2",
        "group_type" : "蓝球",
        "entity_type" : "BasketBall",
        "leader" : false
    },
    {
        "gid" : "3",
        "group_type" : "阅读",
        "entity_type" : "Reading",
        "leader" : false
    },
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "leader" : true
    },
    {
        "gid" : "8",
        "group_type" : "k歌",
        "entity_type" : "KTV",
        "leader" : false
    }
],
"hashed_password" : "IGY1Vu9Hh5+83bQXI2WkzKX1dBx5YPYzbVdzZU8iyEMSd1W4/6VtSvdSN6gmKLnyanSg1l8mS9DNMXXYqaV8cg==",
"id" : "0001-0001-0001-0001-000100010002",
"nickname" : "eric",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "HArJWxTy/vdIQPpwprcOGw==",
"username" : "eric@55yali.com"
},
{
"active" : true,
"cid" : "0001-0001-0001-0001-000100010001",
"department" : "hr",
"email" : "eric@55yali.com",
"group" : [
    {
        "gid" : "1",
        "group_type" : "羽毛球",
        "entity_type" : "Badminton",
        "leader" : false
    },
    {
        "gid" : "2",
        "group_type" : "蓝球",
        "entity_type" : "BasketBall",
        "leader" : false
    },
    {
        "gid" : "3",
        "group_type" : "阅读",
        "entity_type" : "Reading",
        "leader" : false
    },
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "leader" : true
    },
    {
        "gid" : "8",
        "group_type" : "k歌",
        "entity_type" : "KTV",
        "leader" : false
    }
],
"hashed_password" : "IGY1Vu9Hh5+83bQXI2WkzKX1dBx5YPYzbVdzZU8iyEMSd1W4/6VtSvdSN6gmKLnyanSg1l8mS9DNMXXYqaV8cg==",
"id" : "0001-0001-0001-0001-000100010002",
"nickname" : "eric",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "HArJWxTy/vdIQPpwprcOGw==",
"username" : "eric@55yali.com"
},
{
"active" : true,
"cid" : "0001-0001-0001-0001-000100010001",
"department" : "hr",
"email" : "eric@55yali.com",
"group" : [
    {
        "gid" : "1",
        "group_type" : "羽毛球",
        "entity_type" : "Badminton",
        "leader" : false
    },
    {
        "gid" : "2",
        "group_type" : "蓝球",
        "entity_type" : "BasketBall",
        "leader" : false
    },
    {
        "gid" : "3",
        "group_type" : "阅读",
        "entity_type" : "Reading",
        "leader" : false
    },
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "leader" : true
    },
    {
        "gid" : "8",
        "group_type" : "k歌",
        "entity_type" : "KTV",
        "leader" : false
    }
],
"hashed_password" : "IGY1Vu9Hh5+83bQXI2WkzKX1dBx5YPYzbVdzZU8iyEMSd1W4/6VtSvdSN6gmKLnyanSg1l8mS9DNMXXYqaV8cg==",
"id" : "0001-0001-0001-0001-000100010002",
"nickname" : "eric",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "HArJWxTy/vdIQPpwprcOGw==",
"username" : "eric@55yali.com"
}
];

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