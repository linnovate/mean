//组件列表控制器
'use strict';


var groupApp = angular.module('group', []);

var _addListener = function(target,type,func){
  if(target.addEventListener){
      console.log('listenner');
      target.addEventListener(type, func, false);
  }else if(target.attachEvent){
      console.log('attch');
      target.attachEvent("on" + type, func);
  }else{
      console.log('on');
      target["on" + type] = func;
  }
};
var allowDrop =function(e){
  e.preventDefault();
};

var drag =function(e){
  e.dataTransfer.setData("member_id",e.target.id);
  e.dataTransfer.setData("nowx",e.pageX);
  e.dataTransfer.setData("nowy",e.pageY);
};


var drop =function(e){
  e.preventDefault();
  var competition_team = $('#competition_content').attr('data-nowteam');
  var data=e.dataTransfer.getData("member_id");
  var _newEle ={};
  var _x = $(e.target).offset().left;
  var _y = $(e.target).offset().top;
  var _width = $(e.target).width();
  var _height = $(e.target).height();
  var _offsetX = e.pageX - _x - 10;
  var _offsetY = e.pageY - _y -10;
  if(competition_team=='A'&&_offsetX > _width / 2||competition_team=='B'&&_offsetX < _width / 2){
    return false;
  };
  if(data.indexOf('on_')!=0){
    _newEle = $('#'+data).clone(true);
    _newEle.attr('id','on_'+data);
    _newEle.css('top',_offsetY > 0 ? _offsetY : 0);
    _newEle.css('left',_offsetX > 0 ? _offsetX : 0);
    $(e.target).parent().append(_newEle);
    $('#'+data).attr('draggable',false);
  }
  else{
    _newEle = $('#'+data);
    var _top= _newEle.position().top;
    var _left= _newEle.position().left;
    var datax=e.dataTransfer.getData("nowx");
    var datay=e.dataTransfer.getData("nowy");
    _offsetX = _left + e.pageX - datax;
    _offsetY = _top +e.pageY - datay;
    _newEle.css('top',_offsetY > 0 ? _offsetY : 0);
    _newEle.css('left',_offsetX > 0 ? _offsetX : 0);
  };
  var _percentX = 100 * _offsetX / _width;
  var _percentY = 100 * _offsetY / _height;
  updateFormatData(data,_percentX.toFixed(2),_percentY.toFixed(2));
};
var dragend = function(e){
  var _id = e.target.id;
  if(_id.indexOf('on_')==0){
    var $field = $('#formatField');
    var _left = $field.offset().left;
    var _top = $field.offset().top;
    var _right = _left + $field.width();
    var _bottom = _top +$field.height();
    var _nowx = e.pageX;
    var _nowy = e.pageY;
    if (_nowx < _left || _nowx > _right || _nowy > _bottom || _nowy < _top) {
      $(e.target).remove();
      _id = getMemberId(_id);
      $('#'+_id).attr('draggable',true);
    };
  }
};
var updateFormatData = function(id,percentX,percentY){
  id = getMemberId(id);
  window['competition_format'][id] ={
    'x':percentX,
    'y':percentY
  };
  var competition_team = $('#competition_content').attr('data-nowteam');
  var competition_id = $('#competition_id').val();
  $.post('/group/updateFormation/'+competition_id,{'formation':window['competition_format'],'competition_team':competition_team},function(data,status){
    if(data.result===0){
      //TODO
      alert(data.msg);
    }
  });
};
var getMemberId = function(id){
  return (id.indexOf('on_')==0) ? id.substr(3) : id;
};
(function(window){
  $(function(){
    window['competition_format'] ={};
    var _conetent = $('#competition_content');
    _conetent.find('.onmemberA').each(function(){
      var _id = $(this).attr('id');
      var _x = $(this).attr('data-left');
      var _y = $(this).attr('data-top');
      _id = getMemberId(_id);
      window['competition_format'][_id] ={
        'x':_x,
        'y':_y
      };
      $(this).css('left',_x+'%');
      $(this).css('top',_y+'%');
      _id = getMemberId(_id);
      $('#'+_id).attr('draggable',false);
    });
    _conetent.find('.onmemberB').each(function(){
      var _id = $(this).attr('id');
      var _x = $(this).attr('data-left');
      var _y = $(this).attr('data-top');
      $(this).css('left',_x+'%');
      $(this).css('top',_y+'%');
      _id = getMemberId(_id);
      window['competition_format'][_id] ={
        'x':_x,
        'y':_y
      };
      $('#'+_id).attr('draggable',false);
    });
  });
}(window));
