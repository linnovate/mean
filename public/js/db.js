
var db =connect("localhost/mean-dev");
var _group =[
            {
                id[0]:2,
                type[0]:'dsd',
                icon[0]:null
            }
        ];
        try{
          _group.forEach(function (value) {
            db.groups.group.insert(value);
          });
        }
        catch (e){
          print(e);
        }

