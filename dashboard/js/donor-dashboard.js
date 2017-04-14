/**
 * Created by briluu on 4/13/17.
 */

'use strict';


//Same thing as document.ready
$(function() {

    initChart();

});


function initMap() {
    var kenya = {lat: 0.0236, lng: 37.9062};
     var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 4,
         center: kenya
     });
     var marker = new google.maps.Marker({
         position: kenya,
         map: map
     });
}

function initChart() {
    var ctx = document.getElementById("myChart").getContext("2d");
    ctx.canvas.width = 800;
    ctx.canvas.height = 500;
    var data = {
        //labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Chlorine Production Rate",
                fill: true,
                lineTension: 0.0,
                backgroundColor: "rgba(75,192,192,0.4)", // The fill color under the line
                borderColor: "rgba(75,192,192,1)", // 	The color of the line
                borderCapStyle: 'round',
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [65, 59, 80, 81, 74, 77, 85], // data points go here
                spanGaps: false, // If true, lines will be drawn between points with no or null data
            }
        ],
        xLabels: ['Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12', 'Apr 13', 'Apr 14'],
    };
    var options = {
        title: {
            display: true,
            text: "Your device at work",
            fontSize: 50,
            padding: 50
        },
        maintainAspectRatio: false
    };
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}