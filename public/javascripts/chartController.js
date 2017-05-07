function gimme30() {
    var array = [];
    var month = d = new Date().getMonth();
    for (var i = 1; i < 30; i++) {
        array.push(month + '/' + i)
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
	var historyData = [9,24,30,33,45,47,62,81,94,101,117,123,126,180,200,212,232,240,253,263,290,320,326,360,672,682,699,711,1024]

	// for (var i = 0; i <= historyData.length; i++) {
	// 	cumulativeUse[i] = historyData[i].totalUsed;
	// }
	//
	// for (var i = 0; i <= historyData.length; i++) {
	// 	dailyUse[i] = historyData[i].dayUsed;
	// }

    var data = {
        labels: gimme30(),
        datasets: [{
            type: 'line',
            fill: true,
            backgroundColor: 'rgb(215, 19, 40)',
            borderColor: 'rgb(215, 19, 40)',
            borderWidth: 2,
            data: historyData
        }]
    };

    var options = {
        scales: {
            xAxes: [{
				ticks: {
                    display: false,
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
