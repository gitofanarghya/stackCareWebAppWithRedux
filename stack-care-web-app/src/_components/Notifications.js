import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './light-highchart-theme'
import { groupBy } from '../_helpers'

export function Notifications(props) {
  
  const height = window.innerHeight > 900  ? 313.5 : 217 
  const options = {
    
    yAxis: {
        min: 0,
        title: {
            text: 'No. of events'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
        }
    },
    chart: {
      height: height,
      type: 'column',
      animation: Highcharts.svg, // don't animate in old IE
    },
    title: {
      text: 'Notifications'
    },
    xAxis: {
      categories: (function() {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return props.events.map(e => (
          new Date(e.time_created).getDate() + ' ' + monthNames[new Date(e.time_created).getMonth()] + ' ' + new Date(e.time_created).getFullYear()
        ))
      }() )
      //type: 'datetime',
      //tickInterval: 24 * 3600 * 1000
    },/*
    yAxis: {
      title: {
        text: 'No. of events',
        tickInterval: 1
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
    },*/
    legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
            }
        }
    },
    series: (function () {
        var finalData = [{
          name: 'hub offline',
          data: []             
        },{
          name: 'device offline',
          data: []
        },{
          name: 'battery low',
          data: []
        }]
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var cat = props.events.map(e => ({
          ...e,
          day: new Date(e.time_created).getDate() + ' ' + monthNames[new Date(e.time_created).getMonth()] + ' ' + new Date(e.time_created).getFullYear()
        }))
        var data = groupBy(cat, 'day')
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var hubOfflineCount = data[key].filter(e => e.event_type === 'hub_offline').length
            finalData.find(i => i.name === 'hub offline').data.push(hubOfflineCount)
            var deviceOfflineCount = data[key].filter(e => e.event_type === 'device_offline').length
            finalData.find(i => i.name === 'device offline').data.push(deviceOfflineCount)
            var batteryLowCount = data[key].filter(e => e.event_type === 'battery_low').length
            finalData.find(i => i.name === 'battery low').data.push(batteryLowCount)
          }
        }
        return finalData;
      }())
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}