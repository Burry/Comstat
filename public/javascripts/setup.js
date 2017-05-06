$('#accountDetails').submit(function(e) {
    var successIcon = $('.loader .fa-check-circle');
    var failureIcon = $('.loader .fa-times-circle');
    var loadingIcon = $('.loader .fa-circle-o-notch');
    var submitButton = $('.setup-box input.btn');

    loadingIcon.show();
    successIcon.hide();
    failureIcon.hide();
    submitButton.prop("disabled",true);

    $.post('comcast/check', $('form#accountDetails').serialize(), function(data) {
        if (data == 'ok') {
            loadingIcon.hide();
            successIcon.show();
            setTimeout(setComcastAccount(), 1000);
        } else {
            loadingIcon.hide();
            failureIcon.show();
            submitButton.prop("disabled",false);
        }
        console.log(data);
    })
    e.preventDefault();
});

function setComcastAccount() {
    $.post('config', $('form#accountDetails').serialize(), function(data) {
        location.reload();
    });
}
