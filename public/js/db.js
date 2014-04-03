
var db =connect("localhost/mean-dev");
var _group =[
            {type:'1',name:'足球1'},
            {type:'2',name:'篮球1'},
            {type:'3',name:'跑步1'},
            {type:'4',name:'读书1'},
            {type:'5',name:'足球2'},
            {type:'6',name:'篮球2'},
            {type:'7',name:'跑步2'},
            {type:'8',name:'读书2'},
            {type:'9',name:'足球3'},
            {type:'10',name:'篮球3'},
            {type:'11',name:'跑步3'},
            {type:'12',name:'读书3'}
        ];
        try{
          _group.forEach(function (value) {
            db.groups.insert(value);
          });
        }
        catch (e){
          print(e);
        }

