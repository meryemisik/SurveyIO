/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Socket from 'socket.io-client';

const connectionConfig = {
  transports: ['websocket', 'polling', 'flashsocket'],
};

const socket = Socket('http://localhost:3002', connectionConfig);
import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Button} from '@rneui/base';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import ChartType from './components/ChartType';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <View>
        <Text>Bezier Line Chart</Text>
      </View>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [chartList, setChartList] = React.useState([]);
  const [activeChartID, setActiveChartID] = React.useState(null);
  const [currentChart, setCurrentChart] = React.useState(null);

  const setChart = id => {
    if((id != null && activeChartID == null) || id != activeChartID){
      setActiveChartID(id);
    }
    var chartID = chartList.findIndex(x => x.id == id);
    if(chartID >= 0){
    var chartData = {
      id: chartList[chartID].id,
      chartType: chartList[chartID].chartType,
      chartTitle: chartList[chartID].chartTitle,
      labels: [],
      voteCounts: [],
      colors: [],
    };
    chartList[chartID].votingOptions.map(x => {
      chartData.labels.push(x.labelTitle);
      chartData.voteCounts.push(x.voteCount);
      chartData.colors.push(x.color);
    });
    setCurrentChart(chartData);
    }
  };

  const addVote = label => {
    socket.emit('voteSendServer', {label: label, id: activeChartID});
    setChart(activeChartID);
  };

  useEffect(() => {
    socket.on('dataSendFront', datas => {
      setChartList(datas);
      
    });
  }, []);

  useEffect(() => {
    setChart(activeChartID);
  }, [chartList]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
          
          <View style={{padding: '5%'}}>
            {currentChart && (
              <>
                <Text>{currentChart.chartTitle}</Text>
                <ChartType title={currentChart.chartType} labels={currentChart.labels} data={currentChart.voteCounts} colors={currentChart.colors}/>
               
                <View>
                  {currentChart.labels.map((e, index) => (
                    <Button title={e} key={index} onPress={() => addVote(e)} />
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {chartList?.length > 0 &&
            chartList.map((e, index) => (
              <View key={index} style={{padding: '0 5%', display: 'flex'}}>
                <Text key={index}>{e.chartTitle}</Text>
                <Button title="Seç" onPress={() => setChart(e.id)} />
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});

export default App;
