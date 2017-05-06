$('#accountDetails').submit(function(e) {
    $('.loader .fa-circle-o-notch').show();
    $('.loader .fa-check-circle').hide();
    $('.loader .fa-times-circle').hide();
    $.post('comcast/check', $('form#accountDetails').serialize(), function(data) {
        if (data == 'ok') {
            $('.loader .fa-circle-o-notch').hide();
            $('.loader .fa-check-circle').show();
            setTimeout(setComcastAccount(), 1000);
        } else {
            $('.loader .fa-circle-o-notch').hide();
            $('.loader .fa-times-circle').show();
        }
        console.log(data);
    })
    e.preventDefault();
});

function setComcastAccount() {
    $.post('config', $('form#accountDetails').serialize(), function(data) {
        window.location = '/';
    });
}
