function updateStats(data) {
    var res = JSON.parse(data);
    var percent = 100 * res.used / res.total;
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
    $("#data_used").html(res.used);
    $("#data_total").html(res.total);
    $("#data_remaining").html(res.total - res.used);
    $(".progress-bar").html(percentInt + "%");
    $(".progress-bar").css("width", percent + "%");
    $(".progress-bar").addClass(progressBarBackground);
}

function loadComcastQuery() {
    $.get("response", function(data) {
        updateStats(data);
        $("#loader").hide();
        $("#data").css("display", "block");
        $("#data_progress").css("display", "block");
        $("#reload").css("display", "block");
    });
}

function reloadComcastQuery() {
    $(".fa-refresh").addClass("fa-spin");
    $("#data_used").addClass("half-transparent");
    $("#data_total").addClass("half-transparent");
    $("#data_remaining").addClass("half-transparent");
    $(".progress-bar").addClass("half-transparent");
    $.get("response", function(data) {
        updateStats(data);
        $(".fa-refresh").removeClass("fa-spin");
        $("#data_used").removeClass("half-transparent");
        $("#data_total").removeClass("half-transparent");
        $("#data_remaining").removeClass("half-transparent");
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
