function switchPanes() {
        $('.setup-box.step-1').fadeOut();
}

$('.setup-box .btn[value="Next"]').click(function() {
      $('.setup-box.step-2).fadeIn();
      $('.setup-box.step-1).fadeOut();
});