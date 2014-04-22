'use strict';

(function($) {
  $(function() {
    var temp_photo_form = $('#temp_photo_form');
    temp_photo_form.submit(function() {
      var options = {
        success: function(data, status) {
          var temp_src = '/img/user/photo/temp/' + data.img;
          $('#edit_img').attr('src', temp_src);
          $('#edit_photo').find('.jcrop-holder img').attr('src', temp_src);
          $('#preview').attr('src', temp_src);
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

      $('#preview').css({
        width: Math.round(rx * imgx) + 'px',
        height: Math.round(ry * imgy) + 'px',
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