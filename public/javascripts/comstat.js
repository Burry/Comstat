var socket = io.connect({transports: ['websocket', 'polling']});

$("#refresh").click(function() {
    socket.emit('requestComcastQuery', null, function(data) {
        updateStats(data);
    });
});

socket.on('notifyComcastQuery', function() {
    $(".loader").show();
    $(".fa-refresh").addClass("fa-spin");
    $("#refresh").prop("disabled",true);
});

socket.on('updateComcastQuery', function(data) {
    $(".loader").hide();
    $(".fa-refresh").removeClass("fa-spin");
    $("#refresh").prop("disabled",false);
    updateStats(data);
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
}

function gimme30() {
    var array = [];
    var m = new Date().getMonth();
	var y = new Date().getYear();
	var daysInMonth = new Date(y, m, 0).getDate();
    for (var i = 1; i <= daysInMonth; i++) {
        array.push(m + '/' + i)
    }
    return array;
}

function setChartSize() {
	var size = [$(".jumbotron-fluid .container").css("width"), $(".jumbotron-fluid").css("height")]
	if ($(window).width() >= 576) size[0] = parseInt(size[0].slice(0, -2)) - 30 + 'px';
	size[1] = parseInt(size[1].slice(0, -2)) + 10 + 'px';
	$(".chart-container").width(size[0]);
	$(".chart-container").height(size[1]);
}

$(document).ready(function() {
	var cumulativeUse = [];
	var recordedDate = j = dailyUsageData[0]._id - 2;
	for (var i = 0; i < recordedDate; i++) {
		cumulativeUse[i] = 0;
		if (dailyUsageData[i]) cumulativeUse[j] = dailyUsageData[i].totalUsed;
		j++;
	}

    var data = {
        labels: gimme30(),
        datasets: [{
            type: 'line',
            fill: true,
            backgroundColor: 'rgb(215, 19, 40)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0,
            data: cumulativeUse
        }]
    };

    var options = {
        scales: {
            xAxes: [{
                ticks: {
                    display: false
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                }
            }],
            yAxes: [{
                ticks: {
                    display: false,
                    beginAtZero:true,
                    max: 1024
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                }
            }]
        },
        legend: {
            display: false
        },
        elements: {
            point: {
                radius: 0
            }
        },
		maintainAspectRatio: false
    };

	setChartSize();

    var ctx = $("#chart");

    var chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
});

$(window).resize(function() {
	setChartSize();
});
