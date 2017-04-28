function normalAlert(data) {
    $("#data").css("color", "#292b2c");
    $("#data_remainder").html(data.total - data.used);
    $("#data_remainder_label").html('remaining');
}

function overageAlert(data) {
    var overageCost = Math.ceil((data.used - data.total + 1) / 50) * 10;
    overageCost = overageCost >= 200 ? 200 : overageCost;
    $("#data").css("color", "#D71328");
    $("#data_remainder").html(data.used - data.total);
    $("#data_remainder_label").html('over limit');
    $("#data_overage_charges").html(overageCost);
    $("#data_overage_charges_row").css("display", "initial");
}

function daysRemaining() {
    var date = new Date();
    var firstofNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    var timeDiff = Math.abs(firstofNextMonth.getTime() - date.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function updateStats(data) {
    var percent = 100 * data.used / data.total;
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
        overageAlert(data);
    } else {
        normalAlert(data);
    }
    $("#data_used").html(data.used);
    $("#data_total").html(data.total);
    $("#data_units").html(data.unit);
    $("#days_remaining").html(daysRemaining());
    $(".progress-bar").html(percentInt + "%");
    $(".progress-bar").css("width", percent + "%");
    $(".progress-bar").addClass(progressBarBackground);
}

function loadComcastQuery() {
    $.get("response", function(data) {
        updateStats(JSON.parse(data));
        $("#loader").hide();
        $("#data").css("display", "block");
        $("#date").css("display", "block");
        $("#data_progress").css("display", "block");
        $("#reload").css("display", "block");
    });
}

function reloadComcastQuery() {
    $(".fa-refresh").addClass("fa-spin");
    $("#data_used").addClass("half-transparent");
    $("#data_total").addClass("half-transparent");
    $("#data_remainder").addClass("half-transparent");
    $("#data_overage_charges").addClass("half-transparent");
    $("#days_remaining").addClass("half-transparent");
    $(".progress-bar").addClass("half-transparent");
    $.get("response", function(data) {
        updateStats(JSON.parse(data));
        $(".fa-refresh").removeClass("fa-spin");
        $("#data_used").removeClass("half-transparent");
        $("#data_total").removeClass("half-transparent");
        $("#data_remainder").removeClass("half-transparent");
        $("#data_overage_charges").removeClass("half-transparent");
        $("#days_remaining").removeClass("half-transparent");
        $(".progress-bar").removeClass("half-transparent");
    });
}

$("#reload").click(function() {
    reloadComcastQuery();
});

setInterval(function(){
    reloadComcastQuery();
}, 1800000);

loadComcastQuery();
