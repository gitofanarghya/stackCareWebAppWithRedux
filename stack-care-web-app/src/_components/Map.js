import React from 'react'
import Highcharts from 'highcharts'
import HC_map from 'highcharts/modules/map'
import HighchartsReact from 'highcharts-react-official'
import mapData from './world'
import { markersData } from '../_helpers'
import proj4 from 'proj4'
import orange from '@material-ui/core/colors/orange';

HC_map(Highcharts)

export const Map = (props) => {
  window.proj4 = proj4

  const markers = markersData ? markersData : null
  const options = {
    chart: {
      map: mapData,
    },
  
    title: {
      text: ''
    },
  
    mapNavigation: {
      enabled: true
    },

    plotOptions: {
      series: {
          point: {
              events: {
                  click: function () {
                      props.setCommunity(this.id)
                  }
              }
          }
      }
  },
  
    series: [{
      name: 'Basemap',
      borderColor: '#A0A0A0',
      nullColor: 'rgba(200, 200, 200, 0.3)',
      showInLegend: false,
      enableMouseTracking: false
    }, {
      name: 'Separators',
      type: 'mapline',
      nullColor: '#707070',
      showInLegend: false,
      enableMouseTracking: false
    }, {
      allowPointSelect: true,
      cursor: 'pointer',
      type: 'mappoint',
      name: 'Communities',
      color: orange[500],
      showInLegend: false,
      data: markers,
      tooltip: {
        headerFormat: '',
        pointFormat: '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}'
      },
      stickyTracking: false
      
    }]
  }
  

  return <HighchartsReact highcharts={Highcharts} constructorType={'mapChart'} options={options} />
};