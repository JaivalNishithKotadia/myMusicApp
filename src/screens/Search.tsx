import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Keyboard,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import {storeMusicData, getMusicData} from '../../MusicDataStorage';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect} from 'react';
import AnimatedStatusBar from './components/AnimatedStatusBar';
import {useMaterialYou} from '@assembless/react-native-material-you';
import {Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import RNFS from 'react-native-fs';
import RNRestart from 'react-native-restart';
import {usePlaybackState} from 'react-native-track-player';

const SearchResultItem = ({
  id,
  title,
  imgSource,
  artist,
  darkerColor,
  navigation,
  musicDataForTrackPlayer,
}: any) => {
  const {palette} = useMaterialYou({});
  function sanitizeFilename(filename: any) {
    // Replace special characters with underscores or remove them
    return filename.replace(/[\\/:*?"<>|]/g, '_');
  }
  const primary40 = palette.system_accent1[8];
  const isMusicPlaying = usePlaybackState();
  const dotSource = require('../../assets/icons/threedot.png');
  var artistText:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | null
    | undefined;
  var titleText:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | null
    | undefined;
  if (artist.length > 15) {
    artistText = artist.slice(0, 15) + '...';
  } else {
    artistText = artist;
  }
  if (title.length > 20) {
    titleText = title.slice(0, 20) + '...';
  } else {
    titleText = title;
  }
  const highImgSource = imgSource.replace(/120/g, '544');

  const handleButtonPress = async (
    id: any,
    title: any,
    imgSource: any,
    artist: any,
  ) => {
    console.log('Pressed!');
    const fetch = require('node-fetch');

    const urlL = 'https://youtube-mp36.p.rapidapi.com/dl?id=' + id;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '5b5b1650fdmshe1a9fb9669d1d42p1ffbbejsn17db281da228',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(urlL, options);
      const result = await response.text();
      const obj = await JSON.parse(result);
      const sanitizedTitle = sanitizeFilename(titleText);
      const path =
        RNFS.ExternalStorageDirectoryPath + '/Music/' + sanitizedTitle + '.mp3';
      console.log(path);
      Alert.alert('Info', 'Your Song is being added to your playlist!', [], {
        cancelable: false,
      });
      await RNFS.downloadFile({fromUrl: obj.link, toFile: path})
        .promise.then(async response => {
          const musicData = {
            artwork: highImgSource,
            url: 'file://' + path,
            title: title,
            artist: artistText,
            id: Math.floor(Math.random() * 90000) + 10000,
          };

          storeMusicData(musicData);
          RNRestart.restart();

          console.log('File downloaded!', response);
        })
        .catch(err => {
          console.log('Download error:', err);
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <TouchableOpacity
      onPress={() => handleButtonPress(id, title, imgSource, artistText)}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 10,
          padding: 10,
          backgroundColor: darkerColor,
          borderRadius: 25,
          marginHorizontal: 5,
        }}>
        <View style={{flexDirection: 'row', width: '70%'}}>
          <Image
            source={{uri: highImgSource}}
            width={55}
            height={55}
            style={{borderRadius: 17, alignSelf: 'center'}}
          />
          <View
            style={{
              justifyContent: 'center',
              padding: 12,
            }}>
            <Text
              style={{
                fontFamily: 'ClashDisplay-Semibold',
                fontSize: 18,
                color: palette.system_accent1[3],
                marginBottom: 3,
              }}>
              {titleText}
            </Text>
            <Text
              style={{
                fontFamily: 'ClashDisplay-Regular',
                fontSize: 14,
                color: palette.system_accent1[3],
              }}>
              {artistText}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={{justifyContent: 'center', padding: 5}}>
          <Image
            source={dotSource}
            style={{
              width: 22,
              height: 22,
              resizeMode: 'contain',
              tintColor: palette.system_accent1[3],
            }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const Search = ({navigation}: any) => {
  const {palette} = useMaterialYou({});
  const [musicDataForTrackPlayer, setMusicDataForTrackPlayer] = React.useState(
    [],
  );
  useEffect(() => {
    loadMusicData();
  }, []);

  const loadMusicData = async () => {
    const data = await getMusicData();
    setMusicDataForTrackPlayer(data);
  };
  const primary40 = palette.system_accent1[8];
  const newShade = (hexColor: any, magnitude: number) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
      const decimalColor = parseInt(hexColor, 16);
      let r = (decimalColor >> 16) + magnitude;
      r > 255 && (r = 255);
      r < 0 && (r = 0);
      let g = (decimalColor & 0x0000ff) + magnitude;
      g > 255 && (g = 255);
      g < 0 && (g = 0);
      let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
      b > 255 && (b = 255);
      b < 0 && (b = 0);
      return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
      return hexColor;
    }
  };
  const lighterColor = newShade(primary40, 50);
  const alertShadow = newShade(primary40, 90);
  const darkerColor = newShade(primary40, -70);
  const startDarkerColor = newShade(primary40, -10);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchBtnPressed, setSearchBtnPressed] = React.useState(false);
  const [showAlert, setshowAlert] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState(null);
  const handleSearchBtnPressed = async () => {
    Keyboard.dismiss();
    if (searchQuery.length > 0) {
      const fetch = require('node-fetch');

      const url =
        'https://youtube-music-api3.p.rapidapi.com/search?q=' +
        searchQuery +
        '&type=song';
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            '5b5b1650fdmshe1a9fb9669d1d42p1ffbbejsn17db281da228',
          'X-RapidAPI-Host': 'youtube-music-api3.p.rapidapi.com',
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.text();
        const obj = JSON.parse(result);
        setSearchResult(obj.result);
      } catch (error) {
        console.error(error);
      }
    } else if (searchQuery.length === 0) {
      setshowAlert(true);
    }
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      <LinearGradient
        colors={[startDarkerColor, darkerColor, '#000000']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 0.7}}
        style={styles.gradient}>
        <AnimatedStatusBar backgroundColor={startDarkerColor} />
        <View
          style={{
            marginTop: 20,
            paddingLeft: 15,
          }}>
          <Text
            style={[
              {
                fontFamily: 'shesia',
                fontSize: 30,
                color: '#ffffff',
              },
            ]}>
            Search ~
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            //backgroundColor: 'red',
            justifyContent: 'center',
          }}>
          <Searchbar
            placeholder="Search for the song you like!"
            onChangeText={setSearchQuery}
            value={searchQuery}
            elevation={5}
            style={{
              backgroundColor: lighterColor,
              width: '80%',
              paddingHorizontal: 5,
            }}
            inputStyle={{
              fontFamily: 'ClashDisplay-Regular',
              color: '#ffffff',
            }}
            iconColor="#ffffff"
            placeholderTextColor={'#ffffff'}
            cursorColor={primary40}
            onClearIconPress={() => setSearchResult(null)}
          />
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => handleSearchBtnPressed()}>
            <Icon
              name="search"
              size={30}
              color={'white'}
              style={{
                backgroundColor: darkerColor,
                borderRadius: 30,
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                padding: 10,
                marginLeft: 10,
                elevation: 5,
              }}
            />
          </TouchableOpacity>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Alert"
            message="Please type something before search!"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showConfirmButton={true}
            confirmText="Ok"
            confirmButtonColor="#DD6B55"
            onConfirmPressed={() => {
              setshowAlert(false);
            }}
            useNativeDriver={true}
            onDismiss={() => {
              setshowAlert(false);
            }}
            titleStyle={{
              fontFamily: 'ClashDisplay-Medium',
              fontSize: 25,
              color: 'white',
            }}
            contentContainerStyle={{
              backgroundColor: lighterColor,
              borderRadius: 20,
              width: '80%',
              shadowOffset: {
                width: 0,
                height: 50,
              },

              elevation: 15,
              shadowColor: alertShadow,
            }}
            messageStyle={{
              fontFamily: 'ClashDisplay-Regular',
              fontSize: 20,
              color: 'white',

              padding: 10,
              textAlign: 'center',
            }}
            confirmButtonStyle={{
              backgroundColor: darkerColor,
              borderRadius: 10,
              width: 90,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            confirmButtonTextStyle={{
              fontFamily: 'ClashDisplay-Regular',
              fontSize: 20,
              color: 'white',
            }}
          />
        </View>
        {searchResult !== null ? (
          <FlatList
            data={searchResult}
            renderItem={({item}) => (
              <SearchResultItem
                title={item.title}
                id={item.videoId}
                imgSource={item.thumbnail}
                artist={item.author}
                darkerColor={darkerColor}
                navigation={navigation}
                musicDataForTrackPlayer={musicDataForTrackPlayer}
              />
            )}
            keyExtractor={item => item.videoId.toString()}
            style={{marginTop: 7}}
            showsVerticalScrollIndicator={false}
            fadingEdgeLength={200}
            contentContainerStyle={{paddingBottom: 120}}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 50,
            }}>
            <Text
              style={{fontFamily: 'ClashDisplay-Regular', color: lighterColor}}>
              {' '}
              Your Searched Songs Would List Here!{' '}
            </Text>
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
export default Search;
