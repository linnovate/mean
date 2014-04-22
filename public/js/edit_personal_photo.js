'use strict';

(function($) {
  $(function() {
    var temp_photo_form = $('#temp_photo_form');
    temp_photo_form.submit(function() {
      var options = {
        success: function(data, status) {
          var temp_src = '/img/user/photo/temp/' + data.img;
          var jcrop_img = $('#edit_img');
          jcrop_img.attr('src', temp_src);
          $('#preview').attr('src', temp_src);

          jcrop_img.Jcrop({
            setSelect: [0, 0, 128, 128],
            aspectRatio: 1,
            onChange: showPreview

          });
        }
      };

      $(this).ajaxSubmit(options);
      return false;
    });

    var temp_photo = $('#temp_photo');
    temp_photo.change(function() {
      temp_photo_form.submit();
    });

    function showPreview(coords)
    {
      var rx = 128 / coords.w;
      var ry = 128 / coords.h;
      var img = $('#edit_img');
      var imgx = img.width();
      var imgy = img.height();

      $('#w').val(coords.w);
      $('#h').val(coords.h);
      $('#x').val(coords.x);
      $('#y').val(coords.y);

      $('#preview').css({
        width: Math.round(rx * imgx) + 'px',
        height: Math.round(ry * imgy) + 'px',
        marginLeft: '-' + Math.round(rx * coords.x) + 'px',
        marginTop: '-' + Math.round(ry * coords.y) + 'px'
      });
    }


  });

}(jQuery));