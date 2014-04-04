var mongoose = require('mongoose'),
    group = mongoose.model('Group');


exports.create = function() {
    var _group = new group();
    _group.group.gid = [0,1,2,3,4,5,6,7,8,9,10,11];
    _group.group._type = ['篮球','桑拿','瑜伽','唱歌','桌游','德玛西亚','无聊','扔飞镖','吃饭','逛街','游戏','virtual'];
   

    _group.save(function(err) {
        if (err) {
            console.log(err);
    
        }
    });
};