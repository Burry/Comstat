function gimme30() {
    var array = [];
    var month = d = new Date().getMonth();
    for (var i = 1; i < 30; i++) {
        array.push(month + '/' + i)
    }
    return array;
}

function setChartHeight() {
	$(".chart-container").height($(".jumbotron-fluid").css("height"));
}

$(document).ready(function() {
	var historyData = [9,24,30,33,45,47,62,81,94,101,117,123,126,180,200,212,232,240,253,263,290,320,326,360,672,682,699,711,860,1024]

	// for (var i = 0; i <= historyData.length; i++) {
	// 	cumulativeUse[i] = historyData[i].totalUsed;
	// }
	//
	// for (var i = 0; i <= historyData.length; i++) {
	// 	dailyUse[i] = historyData[i].dayUsed;
	// }

    var chartData = {
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

    var chartOptions = {
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

	setChartHeight();

    var ctx = $("#chart");

    var chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
});

$(window).resize(function() {
	setChartHeight();
});
