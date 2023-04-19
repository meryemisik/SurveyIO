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
import React, {useEffect, useRef, useState} from 'react';

import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';

import {Button, Overlay, Badge} from '@rneui/base';

import {BottomSheet, Input} from '@rneui/themed';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import ColorPicker, {
  Panel1,
  colorKit,
  HueSlider,
} from 'reanimated-color-picker';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import ChartType from './components/ChartType';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [chartList, setChartList] = React.useState([]);
  const [activeChartID, setActiveChartID] = React.useState(null);
  const [currentChart, setCurrentChart] = React.useState(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const newChartTitleInput = React.createRef();
  const [selectedLanguage, setSelectedLanguage] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  const toggleOverlay = (index = null) => {
   
    if (!!index) {
      console.log('çalıştı modal : ', index);
    }
console.log("wedfsdaf" , newChart[0].votingOptions)
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    if (modalVisible) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [modalVisible]);

  const [newChart, setNewChart] = React.useState([
    {
      chartType: 'bar',
      chartTitle: 'Your Chart Title',
      votingOptions: [
        {
          labelTitle: 'deneme1',
          bgColor: 'rgba(69 106 225 / .5)',
          borderColor: 'rgba(69 106 225 / 1)',
          voteCount: 0,
        },
        {
          labelTitle: 'deneme2',
          bgColor: 'rgba(200 0 159 / .5)',
          borderColor: 'rgba(200 0 159 / 1)',
          voteCount: 0,
        },
      ],
    },
  ]);

  const setChart = id => {
    if ((id != null && activeChartID == null) || id != activeChartID) {
      setActiveChartID(id);
    }
    var chartID = chartList.findIndex(x => x.id == id);
    if (chartID >= 0) {
      var chartData = {
        id: chartList[chartID].id,
        chartType: chartList[chartID].chartType,
        chartTitle: chartList[chartID].chartTitle,
        labels: [],
        voteCounts: [],
        colors: [],
        borderColors: [],
      };
      chartList[chartID].votingOptions.map(x => {
        chartData.labels.push(x.labelTitle);
        chartData.voteCounts.push(x.voteCount);
        chartData.colors.push(x.bgColor);
        chartData.borderColors.push(x.borderColor);
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

  const createNewChart = () => {
    socket.emit('newChartSendServer', newChart[0]);
  };

  const onSelectColor = ({hex}) => {
    // do something with the selected color.
    console.log(hex);
    console.log(colorKit.RGB(hex).object());
  };

  return (
    <SafeAreaProvider style={backgroundStyle}>
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
                <ChartType
                  title={currentChart.chartType}
                  labels={currentChart.labels}
                  data={currentChart.voteCounts}
                  colors={currentChart.colors}
                />

                <View>
                  {currentChart.labels.map((e, index) => (
                    <Button
                      title={e}
                      key={index}
                      onPress={() => addVote(e)}
                      style={{marginBottom: 5}}
                      buttonStyle={{
                        backgroundColor: currentChart.colors[index],
                        borderColor: currentChart.borderColors[index],
                        borderWidth: 1,
                      }}
                      titleStyle={{color: currentChart.borderColors[index]}}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
        <View></View>
        <View>
          <Button color="secondary" onPress={() => setIsVisible(true)}>
            Create a survey
          </Button>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            padding: 10,
          }}>
          {chartList?.length > 0 &&
            chartList.map((e, index) => (
              <View key={index} style={{padding: '0 5%', display: 'flex'}}>
                <Button
                  title={e.chartTitle}
                  onPress={() => setChart(e.id)}
                  style={{marginBottom: 10}}
                />
              </View>
            ))}
        </View>
      </ScrollView>

      <BottomSheet modalProps={{}} isVisible={isVisible}>
        <View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 10,
          }}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            <Picker.Item label="Bar Chart" value="bar" />
            <Picker.Item label="Line Chart" value="line" />
            <Picker.Item label="Pie Chart" value="pie" />
          </Picker>

          <Input
            ref={newChartTitleInput}
            placeholder={newChart[0].chartTitle || 'Chart Title Girin'}
            value={newChart[0].chartTitle}
            onChangeText={text => {
              setNewChart([{...newChart[0], chartTitle: text}]);
            }}
          />

          {newChart[0].votingOptions.map((e, index) => (
            <View key={index}>
              <Input
                placeholder={e.labelTitle || 'Column Label Girin'}
                value={e.labelTitle}
                onChangeText={text => {
                  var votingOptionData = newChart[0].votingOptions;
                  votingOptionData[index].labelTitle = text;
                  setNewChart([
                    {...newChart[0], votingOptions: [...votingOptionData]},
                  ]);
                }}
              />
              <Badge
                containerStyle={{position: 'absolute', top: -4, right: -4}}
                badgeStyle={{width: 20, height: 20, backgroundColor: e.bgColor, borderColor: e.borderColor}}
                onPress={() => toggleOverlay(index)}
              />
            </View>
          ))}

          <Button color="success" onPress={() => createNewChart()}>
            Oluştur
          </Button>

          <Button color="error" onPress={() => setIsVisible(false)}>
            İptal
          </Button>
        </View>
      </BottomSheet>
      <Overlay
        overlayStyle={{width: '80%'}}
        isVisible={modalVisible}
        onBackdropPress={() => toggleOverlay(null)}>
        <View>
          <ColorPicker
            style={{width: '100%'}}
            value="red"
            onComplete={onSelectColor}>
            <Panel1 />
            <HueSlider />
          </ColorPicker>
          <Button
            title="Onayla"
            onPress={() => toggleOverlay(null)}
            style={{marginBottom: 10, marginTop: 20}}
          />
        </View>
      </Overlay>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});

export default App;
