import React from 'react';
import {View, Text, Dimensions} from 'react-native';

import {LineChart, BarChart, PieChart} from 'react-native-chart-kit';

type Props = {
  title: string;
  labels: any;
  data: any;
  colors: any;
};

function ChartType({title, labels, data, colors}: Props) {
  if (title == 'line') {
    return (
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={(Dimensions.get('window').width * 90) / 100} // from react-native
        height={220}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        fromZero={true}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    );
  } else if (title == 'polarArea') {
    var chartData = [];
    labels.map((e, index) => {
      chartData.push({
        name: e,
        population: data[index],
        color: colors[index],
      });
    });

    console.log('datasss : ', chartData);
    return (
      <PieChart
        data={chartData}
        width={(Dimensions.get('window').width * 90) / 100} // from react-native
        height={220}
        accessor={'population'}
        center={[16, 0]}
        backgroundColor={'#ececec'}
        absolute
        chartConfig={{
        
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
         
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    );
  }

  return (
    <BarChart
      data={{
        labels: labels,
        datasets: [
          {
            data: data,
          },
        ],
      }}
      width={(Dimensions.get('window').width * 90) / 100} // from react-native
      height={220}
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: '#e26a00',
        backgroundGradientFrom: '#fb8c00',
        backgroundGradientTo: '#ffa726',
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: '6',
          strokeWidth: '2',
          stroke: '#ffa726',
        },
      }}
      fromZero={true}
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  );
}

export default ChartType;
