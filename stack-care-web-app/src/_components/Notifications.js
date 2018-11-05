import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './light-highchart-theme'
import { groupBy } from '../_helpers'

export function Notifications(props) {

  const options = {
    chart: {
      type: 'column',
      animation: Highcharts.svg, // don't animate in old IE
      marginRight: 10,
      events: {
        load: function () {
  
          // set up the updating of the chart each second
          var series = this.series[0];
          /*setInterval(function () {
            var x = (new Date()).getTime(), // current time
              y = Math.random();
            series.addPoint([x, y], true, true);
          }, 30000);*/
        }
      }
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      tickInterval: 24 * 3600 * 1000
    },
    yAxis: {
      title: {
        text: 'No. of events'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b><br/>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
          Highcharts.numberFormat(this.y, 2);
      }
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{
      name: 'Notifications',
      data: (function () {
        var finalData = []
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var cat = props.eventsWithCommunityId.map(e => ({
          ...e,
          day: new Date(e.time_created).getDate() + ' ' + monthNames[new Date(e.time_created).getMonth()] + ' ' + new Date(e.time_created).getFullYear()
        }))
        var data = groupBy(cat, 'day')
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            finalData.push([
              Date.parse(key), data[key].length
            ])
          }
        }
        return finalData;
      }())
    }]
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}