'use strict';
/*
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
                'group_type':'篮球',
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
*/
/*
//公司脚本
var _company = [
    {
        'id': '0001-0001-0001-0001-000100010001',
        'username': 'donler',
        'login_email': 'hr@55yali.com',
        'hashed_password': 'AMQEr5SljqggnlY9LTJR8ZrHMAnYRRNJLnbNU/PriiZNiTkk9hPqPHc3T21mPcNVUqUL7xX1bJJ8axkoyK0cXQ==',
        'salt': 'oGn/YzIa2UdFMCyju42JWA==',
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
                "gid" : "7",
                "group_type" : "足球",
                "entity_type" : "FootBall",
                "tname":"上海动梨信息技术有限公司-足球队",
                "leader":[{
                    "uid":"0001-0001-0001-0001-000100010002",
                    "nickname":"eric"
                }]
            }
        ]
    },
    {
        'id': '0002-0002-0002-0002-000200020002',
        'username': 'yali',
        'login_email': 'yali_hr@163.com',
        'hashed_password': 'AMQEr5SljqggnlY9LTJR8ZrHMAnYRRNJLnbNU/PriiZNiTkk9hPqPHc3T21mPcNVUqUL7xX1bJJ8axkoyK0cXQ==',
        'salt': 'oGn/YzIa2UdFMCyju42JWA==',
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
                "gid" : "7",
                "group_type" : "足球",
                "entity_type" : "FootBall",
                "tname":"上海鸭梨信息技术有限公司-足球队",
                "leader":[{
                    "uid":"0002-0002-0002-0002-000200020003",
                    "nickname":"yali_yg1"
                }]
            }
        ]
    },
    {
        'id': '0003-0003-0003-0003-000300030003',
        'username': 'apple',
        'login_email': 'pingguo_hr@sina.com',
        'hashed_password': 'AMQEr5SljqggnlY9LTJR8ZrHMAnYRRNJLnbNU/PriiZNiTkk9hPqPHc3T21mPcNVUqUL7xX1bJJ8axkoyK0cXQ==',
        'salt': 'oGn/YzIa2UdFMCyju42JWA==',
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
                "gid" : "7",
                "group_type" : "足球",
                "entity_type" : "FootBall",
                "tname":"上海苹果信息技术有限公司-足球队",
                "leader":[{
                    "uid":"0003-0003-0003-0003-000300030004",
                    "nickname":"apple1"
                }]
            }
        ]
    },
    {
        'id': '0004-0004-0004-0004-000400040004',
        'username': 'banana',
        'login_email': 'xiangjiao_hr@sohu.com',
        'hashed_password': 'AMQEr5SljqggnlY9LTJR8ZrHMAnYRRNJLnbNU/PriiZNiTkk9hPqPHc3T21mPcNVUqUL7xX1bJJ8axkoyK0cXQ==',
        'salt': 'oGn/YzIa2UdFMCyju42JWA==',
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
                "gid" : "7",
                "group_type" : "足球",
                "entity_type" : "FootBall",
                "tname":"上海香蕉信息技术有限公司-足球队",
                "leader":[{
                    "uid":"0004-0004-0004-0004-000400040006",
                    "nickname":"xiangjiao_yg2"
                }]
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
*/
/*
//员工脚本
var _users =[
{
"active" : true,
"cid" : "0001-0001-0001-0001-000100010001",
"department" : "hr",
"email" : "eric@55yali.com",
"group" : [
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "tname":"上海动梨信息技术有限公司-足球队",
        "leader" : true
    }
],
"hashed_password" : "AMQEr5SljqggnlY9LTJR8ZrHMAnYRRNJLnbNU/PriiZNiTkk9hPqPHc3T21mPcNVUqUL7xX1bJJ8axkoyK0cXQ==",
"id" : "0001-0001-0001-0001-000100010002",
"nickname" : "eric",
"realname":"张三",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "oGn/YzIa2UdFMCyju42JWA==",
"username" : "eric@55yali.com"
},
{
"active" : true,
"cid" : "0002-0002-0002-0002-000200020002",
"department" : "hr",
"email" : "yali_yg1@163.com",
"group" : [
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "tname":"上海鸭梨信息技术有限公司-足球队",
        "leader" : true
    }
],
"hashed_password" : "AMQEr5SljqggnlY9LTJR8ZrHMAnYRRNJLnbNU/PriiZNiTkk9hPqPHc3T21mPcNVUqUL7xX1bJJ8axkoyK0cXQ==",
"id" : "0002-0002-0002-0002-000200020003",
"nickname" : "yali_yg1",
"realname":"李三",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "oGn/YzIa2UdFMCyju42JWA==",
"username" : "yali_yg1@163.com"
},
{
"active" : true,
"cid" : "0002-0002-0002-0002-000200020002",
"department" : "IT",
"email" : "yali_yg2@163.com",
"group" : [
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "tname":"上海鸭梨信息技术有限公司-足球队",
        "leader" : false
    }
],
"hashed_password" : "AMQEr5SljqggnlY9LTJR8ZrHMAnYRRNJLnbNU/PriiZNiTkk9hPqPHc3T21mPcNVUqUL7xX1bJJ8axkoyK0cXQ==",
"id" : "0002-0002-0002-0002-000200020004",
"nickname" : "yali_yg2",
"realname":"李四",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "oGn/YzIa2UdFMCyju42JWA==",
"username" : "yali_yg2@163.com"
},
{
"active" : true,
"cid" : "0003-0003-0003-0003-000300030003",
"department" : "hr",
"email" : "pingguo_yg1@sina.com",
"group" : [
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "tname":"上海苹果信息技术有限公司-足球队",
        "leader" : true
    }
],
"hashed_password" : "AMQEr5SljqggnlY9LTJR8ZrHMAnYRRNJLnbNU/PriiZNiTkk9hPqPHc3T21mPcNVUqUL7xX1bJJ8axkoyK0cXQ==",
"id" : "0003-0003-0003-0003-000300030004",
"nickname" : "apple1",
"realname":"王三",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "oGn/YzIa2UdFMCyju42JWA==",
"username" : "pingguo_yg1@sina.com"
},
{
"active" : true,
"cid" : "0004-0004-0004-0004-000400040004",
"department" : "hr",
"email" : "xiangjiao_yg1@sohu.com",
"group" : [
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "tname":"上海香蕉信息技术有限公司-足球队",
        "leader" : false
    }
],
"hashed_password" : "AMQEr5SljqggnlY9LTJR8ZrHMAnYRRNJLnbNU/PriiZNiTkk9hPqPHc3T21mPcNVUqUL7xX1bJJ8axkoyK0cXQ==",
"id" : "0004-0004-0004-0004-000400040005",
"nickname" : "eric",
"realname":"赵四",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "oGn/YzIa2UdFMCyju42JWA==",
"username" : "xiangjiao_yg1@sohu.com"
},
{
"active" : true,
"cid" : "0004-0004-0004-0004-000400040004",
"department" : "IT",
"email" : "xiangjiao_yg2@sohu.com",
"group" : [
    {
        "gid" : "7",
        "group_type" : "足球",
        "entity_type" : "FootBall",
        "tname":"上海香蕉信息技术有限公司-足球队",
        "leader" : true
    }
],
"hashed_password" : "AMQEr5SljqggnlY9LTJR8ZrHMAnYRRNJLnbNU/PriiZNiTkk9hPqPHc3T21mPcNVUqUL7xX1bJJ8axkoyK0cXQ==",
"id" : "0004-0004-0004-0004-000400040006",
"nickname" : "xiangjiao_yg2",
"realname":"赵五",
"phone" : "18801910251",
"photo" : "/img/user/photo/default.png",
"provider" : "user",
"register_date" : new Date(),
"role" : "EMPLOYEE",
"salt" : "oGn/YzIa2UdFMCyju42JWA==",
"username" : "xiangjiao_yg2@sohu.com"
}
];
try{
    _users.forEach(function (value) {
        db.users.insert(value);
    });
} catch (e){
    print(e);
};
*/

/*
// insert to companygroups for test
var _company_groups =[
{
    "cid" : "0001-0001-0001-0001-000100010001",
    "gid" : "7",
    "group_type" : "足球",
    "leader" : [
        {
            "uid" : "0001-0001-0001-0001-000100010002",
            "nickname" : "eric",
            "photo": "/img/user/photo/default.png"
        }
    ],
    "member" : [
        {
            "uid" : "0001-0001-0001-0001-000100010002",
            "nickname" : "eric",
            "photo": "/img/user/photo/default.png"
        }
    ],
    "logo":"/img/group/logo/default.png",
    "entity_type":"FootBall",
    "brief":"足球队"
},
{
    "cid" : "0002-0002-0002-0002-000200020002",
    "gid" : "7",
    "group_type" : "足球",
    "leader" : [
        {
            "uid" : "0002-0002-0002-0002-000200020003",
            "nickname" : "yali_yg1",
            "photo": "/img/user/photo/default.png"
        }
    ],
    "member" : [
        {
            "uid" : "0002-0002-0002-0002-000200020003",
            "nickname" : "yali_yg1",
            "photo": "/img/user/photo/default.png"
        }
    ],
    "logo":"/img/group/logo/default.png",
    "entity_type":"FootBall",
    "brief":"足球队"
},
{
    "cid" : "0003-0003-0003-0003-000300030003",
    "gid" : "7",
    "group_type" : "足球",
    "leader" : [
        {
            "uid" : "0003-0003-0003-0003-000300030004",
            "nickname" : "apple1",
            "photo": "/img/user/photo/default.png"
        }
    ],
    "member" : [
        {
            "uid" : "0003-0003-0003-0003-000300030004",
            "nickname" : "apple1",
            "photo": "/img/user/photo/default.png"
        }
    ],
    "logo":"/img/group/logo/default.png",
    "entity_type":"FootBall",
    "brief":"足球队"
},
{
    "cid" : "0004-0004-0004-0004-000400040004",
    "gid" : "7",
    "group_type" : "足球",
    "leader" : [
        {
            "uid" : "0004-0004-0004-0004-000400040006",
            "nickname" : "xiangjiao_yg2",
            "photo": "/img/user/photo/default.png"
        }
    ],
    "member" : [
        {
            "uid" : "0004-0004-0004-0004-000400040006",
            "nickname" : "xiangjiao_yg2",
            "photo": "/img/user/photo/default.png"
        }
    ],
    "logo":"/img/group/logo/default.png",
    "entity_type":"FootBall",
    "brief":"足球队"
}

];
try{
    _company_groups.forEach(function (value) {
        db.companygroups.insert(value);
    });
} catch (e){
    print(e);
};
*/
/*
//足球组件
var _football = [
    {
        "cid": "0001-0001-0001-0001-000100010001",
        "gid": "7",
        "main_force": [{
            "uid" : "0001-0001-0001-0001-000100010002",
            "nickname" : "eric",
            "photo": "/img/user/photo/default.png"
        }],   //主力
        "create_date": new Date()
    },
    {
        "cid": "0002-0002-0002-0002-000200020002",
        "gid": "7",
        "main_force": [{
            "uid" : "0002-0002-0002-0002-000200020003",
            "nickname" : "yali_yg1",
            "photo": "/img/user/photo/default.png"
        }],   //主力
        "create_date": new Date()
    },
    {
        "cid": "0003-0003-0003-0003-000300030003",
        "gid": "7",
        "main_force": [{
            "uid" : "0003-0003-0003-0003-000300030004",
            "nickname" : "apple1",
            "photo": "/img/user/photo/default.png"
        }],   //主力
        "create_date": new Date()
    },
    {
        "cid": "0004-0004-0004-0004-000400040004",
        "gid": "7",
        "main_force": [{
            "uid" : "0004-0004-0004-0004-000400040006",
            "nickname" : "xiangjiao_yg2",
            "photo": "/img/user/photo/default.png"
        }],   //主力
        "create_date": new Date()
    }
];
try{
    _football.forEach(function (value) {
        db.footballs.insert(value);
    });
} catch (e){
    print(e);
};
*/
//@arema /*
//擂台数据
var _arena = [
{
"id":"0006-0001-0001-0001-000100010001",
"gid":"7",
"group_type":"足球",
"city":{
    "province":"上海",
    "city":"上海"
},
"address":"上海体育场"
},
{
"id":"0006-0001-0001-0001-000100010002",
"gid":"7",
"group_type":"足球",
"city":{
    "province":"北京",
    "city":"北京"
},
"address":"五棵松体育场"
},
{
"id":"0006-0001-0001-0001-000100010003",
"gid":"7",
"group_type":"足球",
"city":{
    "province":"河北",
    "city":"石家庄"
},
"address":"石家庄体育场"
},
{
"id":"0006-0001-0001-0001-000100010004",
"gid":"7",
"group_type":"足球",
"city":{
    "province":"浙江",
    "city":"杭州"
},
"address":"杭州体育场"
},
{
"id":"0006-0001-0001-0001-000100010005",
"gid":"7",
"group_type":"足球",
"city":{
    "province":"上海",
    "city":"上海"
},
"address":"万达体育场"
}
];
try{
    _arena.forEach(function (value) {
        db.arenas.insert(value);
    });
} catch (e){
    print(e);
};
//@arena*/