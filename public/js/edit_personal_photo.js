'use strict';

(function($) {
  $(function() {
    var temp_photo_form = $('#temp_photo_form');
    temp_photo_form.submit(function() {
      var options = {
        success: function(data, status) {
          $('#edit_img').attr('src', '/img/user/photo/temp/' + data.img);
          $('#preview').attr('src', '/img/user/photo/temp/' + data.img);
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
      var rx = 100 / coords.w;
      var ry = 100 / coords.h;

      $('#preview').css({
        width: Math.round(rx * 500) + 'px',
        height: Math.round(ry * 370) + 'px',
        marginLeft: '-' + Math.round(rx * coords.x) + 'px',
        marginTop: '-' + Math.round(ry * coords.y) + 'px'
      });
    }

    $('#edit_img').Jcrop({
      onChange: showPreview,
      aspectRatio: 1
    });

  });

}(jQuery));