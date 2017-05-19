/**
 * Created by briluu on 5/18/17.
 */


// runs this block of code when the page is ready/loaded
$(function() {

    $("#cycles").DataTable();

    initChart();

    // initializes the chart. uses Chart.js library.
    function initChart() {
        var ctx = document.getElementById("myChart").getContext("2d");
        ctx.canvas.width = 800;
        ctx.canvas.height = 600;

        var response = {"15348":[],"15340":[{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"2089.33","1":"2089.33"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"2089.33","1":"2089.33"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"2089.33","1":"2089.33"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"2089.33","1":"2089.33"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"2089.33","1":"2089.33"}],"15342":[{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"36.8333","1":"36.8333"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"36.8333","1":"36.8333"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"36.8333","1":"36.8333"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"}]};

        var data = {
            labels: ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5', 'Cycle 6', 'Cycle 7'],
            datasets: [
                {
                    label: "Chlorine Production Rate",
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    data: [65, 59, 80, 81, 74, 77, 85]  // data points go here
                }
            ],
            yLabels: ["label"]
        };
        var options = {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Chlorine Produced (mL)'
                    }
                }]
            }
        };
        var myLineChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
    }

});