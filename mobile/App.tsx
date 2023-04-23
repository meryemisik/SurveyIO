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

import {BottomSheet, Input, Icon} from '@rneui/themed';

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

  const [modalVisible, setModalVisible] = useState(null);
  const [activeLabelIndex, setActiveLabelIndex] = useState(null);

  const isNumeric = value => {
    return /^\d+$/.test(value);
  };

  const toggleOverlay = (index = null) => {
    if (isNumeric(index)) {
      setActiveLabelIndex(index);
    }

    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    if (modalVisible != null) {
      if (modalVisible) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }
  }, [modalVisible]);

  const [newChart, setNewChart] = React.useState([
    {
      chartType: 'bar',
      chartTitle: 'Your Survey Title',
      votingOptions: [
        {
          labelTitle: 'Column Label 1',
          bgColor: `rgba(${Math.floor(Math.random() * 255)} ${Math.floor(
            Math.random() * 255,
          )} ${Math.floor(Math.random() * 255)} / .3)`,
          borderColor: `rgba(${Math.floor(Math.random() * 255)} ${Math.floor(
            Math.random() * 255,
          )} ${Math.floor(Math.random() * 255)} / 1)`,
          voteCount: 0,
        },
        {
          labelTitle: 'Column Label 2',
          bgColor: `rgba(${Math.floor(Math.random() * 255)} ${Math.floor(
            Math.random() * 255,
          )} ${Math.floor(Math.random() * 255)} / .3)`,
          borderColor: `rgba(${Math.floor(Math.random() * 255)} ${Math.floor(
            Math.random() * 255,
          )} ${Math.floor(Math.random() * 255)} / 1)`,
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
        createdDate: chartList[chartID].createdDate,
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
    var setColor = colorKit.RGB(hex).object();

    var votingOptionData = newChart[0].votingOptions;
    votingOptionData[
      activeLabelIndex
    ].bgColor = `rgba(${setColor.r} ${setColor.g} ${setColor.b} / .3)`;
    votingOptionData[
      activeLabelIndex
    ].borderColor = `rgba(${setColor.r} ${setColor.g} ${setColor.b} / 1)`;
    setNewChart([{...newChart[0], votingOptions: [...votingOptionData]}]);
  };

  const deleteNewChartColumn = index => {
    var votingOptionData = newChart[0].votingOptions;
    votingOptionData.splice(index, 1);
    setNewChart([{...newChart[0], votingOptions: [...votingOptionData]}]);
  };

  const addNewChartColumn = () => {
    var votingOptionData = newChart[0].votingOptions;
    votingOptionData.push({
      labelTitle: 'Column Label',
      bgColor: `rgba(${Math.floor(Math.random() * 255)} ${Math.floor(
        Math.random() * 255,
      )} ${Math.floor(Math.random() * 255)} / .3)`,
      borderColor: `rgba(${Math.floor(Math.random() * 255)} ${Math.floor(
        Math.random() * 255,
      )} ${Math.floor(Math.random() * 255)} / 1)`,
      voteCount: 0,
    });
    setNewChart([{...newChart[0], votingOptions: [...votingOptionData]}]);
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
                <Text>
                  {currentChart.chartTitle} (
                  {`${new Date(currentChart.createdDate).getDate()}.${
                    new Date(currentChart.createdDate).getMonth() + 1
                  }.${new Date(currentChart.createdDate).getFullYear()}`}
                  )
                </Text>
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
          <Text>Select Chart Type</Text>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) => {
              setNewChart([{...newChart[0], chartType: itemValue}]);
              setSelectedLanguage(itemValue);
            }}>
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
                containerStyle={{position: 'absolute', top: 4, right: 30}}
                badgeStyle={{
                  width: 20,
                  height: 20,
                  backgroundColor: e.bgColor,
                  borderColor: e.borderColor,
                }}
                onPress={() => toggleOverlay(index)}
              />

              {newChart[0].votingOptions.length > 1 && (
                <Badge
                  containerStyle={{position: 'absolute', top: 4, right: -4}}
                  value="Sil"
                  status="error"
                  onPress={() => deleteNewChartColumn(index)}
                />
              )}
            </View>
          ))}

          <Badge
            containerStyle={{marginEnd: 'auto', marginBottom: 10}}
            value="Add a Column"
            status="primary"
            onPress={() => addNewChartColumn()}
          />

          <Button
            title="Oluştur"
            color="success"
            onPress={() => createNewChart()}
          />

          <Button
            title="İptal"
            color="error"
            onPress={() => setIsVisible(false)}
          />
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
