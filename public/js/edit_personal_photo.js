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
          $('#preview_big').attr('src', temp_src);
          $('#preview_middle').attr('src', temp_src);
          $('#preview_small').attr('src', temp_src);

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
      var save_button = $('#save_button');
      if (temp_photo.val() === null) {
        save_button[0].disabled = true;
      } else {
        save_button[0].disabled = false;
      }
      $('#photo_path').text(temp_photo.val());
      temp_photo_form.submit();
    });

    function showPreview(coords)
    {
      var img = $('#edit_img');
      var imgx = img.width();
      var imgy = img.height();

      // 裁剪参数，单位为百分比
      $('#w').val(coords.w / imgx);
      $('#h').val(coords.h / imgy);
      $('#x').val(coords.x / imgx);
      $('#y').val(coords.y / imgy);

      var thumbnails = [$('#preview_big'), $('#preview_middle'), $('#preview_small')];
      var sizes = [150, 50, 27]; // size.x = size.y

      for(var i = 0; i < thumbnails.length; i++) {

        var rx = sizes[i] / coords.w;
        var ry = sizes[i] / coords.h;
        thumbnails[i].css({
          width: Math.round(rx * imgx) + 'px',
          height: Math.round(ry * imgy) + 'px',
          marginLeft: '-' + Math.round(rx * coords.x) + 'px',
          marginTop: '-' + Math.round(ry * coords.y) + 'px'
        });
      }

    }


  });

}(jQuery));