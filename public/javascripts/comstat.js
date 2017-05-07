var socket = io.connect();

socket.on('notifyComcastQuery', function() {
    $(".loader").show();
    $(".fa-refresh").addClass("fa-spin");
    $("#refresh").prop("disabled",true);
});

socket.on('updateComcastQuery', function(data) {
    updateStats(data);
    $(".loader").hide();
    $(".fa-refresh").removeClass("fa-spin");
    $("#refresh").prop("disabled",false);
});

socket.on('updateComcastQueryStatus', function(data) {
    $('nav .loader').html(data);
});

function daysRemaining() {
    var date = new Date();
    var firstofNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    var timeDiff = Math.abs(firstofNextMonth.getTime() - date.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function updateStats(data) {
    var alertOptions;
    var percent = 100 * data.totalUsed / dataCap;
    var percentInt = Math.round(percent);
    var progressBarClasses = $(".progress-bar").attr("class").split(/\s+/);
    var progressBarBackground;
    if (percentInt >= 50 && percentInt < 70) {
        progressBarBackground = 'bg-success';
    } else if (percentInt >= 70 && percentInt < 90) {
        progressBarBackground = 'bg-warning';
    } else if (percentInt >= 90) {
        progressBarBackground = 'bg-danger';
    }
    $.each(progressBarClasses, function(index, item) {
        if (item.startsWith('bg-')) {
            $(".progress-bar").removeClass(item);
        }
    });
    if (percent >= 100) {
        percent = 100;
        var overageCost = Math.ceil((data.totalUsed - dataCap + 1) / 50) * 10;
        alertOptions = {
            color: '#D71328',
            label: 'over limit',
            charges: overageCost >= 200 ? 200 : overageCost,
            chargesDisplay: 'initial'
        }
    } else {
        alertOptions = {
            color: '#292b2c',
            label: 'remaining',
            charges: 0,
            chargesDisplay: 'none'
        }
    }

    $("#percent").html(percentInt + "%");
    $("#details").css("color", alertOptions.color);
    $("#data_used").html(data.totalUsed);
    $("#data_remainder").html(Math.abs(data.totalUsed - dataCap));
    $("#data_remainder_label").html(alertOptions.label);
    $("#data_overage_charges").html(alertOptions.charges);
    $("#data_overage_charges_row").css("display", alertOptions.chargesDisplay);
    $("#days_remaining").html(daysRemaining());
    $(".progress-bar").css("width", percent + "%");
    $(".progress-bar").addClass(progressBarBackground);
}

function requestComcastQuery() {
    socket.emit('requestComcastQuery', 'test', function(data) {
        updateStats(data);
    });
}

$("#refresh").click(function() {
    requestComcastQuery();
});

$(document).ready(function() {
    requestComcastQuery()
});
