'use strict';

(function($) {
  $(function() {
    var temp_photo_form = $('#temp_photo_form');
    temp_photo_form.submit(function() {
      var options = {
        success: function(data, status) {
          $('#edit_img').attr('src', '/img/user/photo/temp/' + data.img);
        }
      };

      $(this).ajaxSubmit(options);
      return false;
    });

    var temp_photo = $('#temp_photo');
    temp_photo.change(function() {
      temp_photo_form.submit();
    });
  });

}(jQuery));