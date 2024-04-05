import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import RNRestart from 'react-native-restart';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import {getMusicData, setMusicData} from '../../MusicDataStorage';
import {useMaterialYou} from '@assembless/react-native-material-you';
import AwesomeAlert from 'react-native-awesome-alerts';
import AnimatedStatusBar from './components/AnimatedStatusBar';
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
} from 'react-native-track-player';
//@ts-ignore
import Slider from 'react-native-slider';
import {setupPlayer, addTracks} from '../../trackPlayerServices';
import RNFS from 'react-native-fs';
const backBtnSource = require('../../assets/icons/prev-song.png');

const nextBtnSource = require('../../assets/icons/next-song.png');
const pauseButtonSource = require('../../assets/icons/pause-button.png');
const playButtonSource = require('../../assets/icons/play-button.png');
const dotSource = require('../../assets/icons/threedot.png');
const newShade = (hexColor, magnitude) => {
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

const Home = ({navigation}) => {
  const [musicArray, setMusicArray] = React.useState([]);
  const [currentTrack, setCurrentTrack] = useState([]);
  const playbackState = usePlaybackState();
  const [isPlayerReady, setIsPlayerReady] = React.useState(false);
  async function setup(data) {
    let isSetup = await setupPlayer();

    if (isSetup) {
      await addTracks(data);
      console.log('setup');
    } else {
      console.log('No');
    }

    setIsPlayerReady(isSetup);
  }

  var hour = new Date().getHours();

  const {palette} = useMaterialYou({});

  const primary40 = palette.system_accent1[8];

  const darkerColor = newShade(primary40, -70);
  const lighterColor = newShade(primary40, 30);
  const startDarkerColor = newShade(primary40, -10);
  const space = ' ';
  const getInfo = async () => {
    const infoFromTrack = await TrackPlayer.getActiveTrack();
    setCurrentTrack(infoFromTrack);
  };
  const automaticTrackChange = async () => {
    const infoFromTrack = await TrackPlayer.getActiveTrack();
    await TrackPlayer.updateNowPlayingMetadata({
      artwork: infoFromTrack.artwork,
    });
    setCurrentTrack(infoFromTrack);
  };
  useEffect(() => {
    loadMusicData();
  }, []);

  const loadMusicData = async () => {
    const data = await getMusicData();
    setMusicArray(data);
    await setup(data);
    const delay = 500;
    const timerId = setTimeout(() => {
      // Your function to be executed after delay
      getInfo();
    }, delay);
    const trackChangeSubscription = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async data => {
        // data contains information about the track that changed
        const delay = 100;
        const timerId = setTimeout(() => {
          // Your function to be executed after delay
          automaticTrackChange();
        }, delay);

        // Run your custom function here
        // For example, you can update your UI, fetch additional track information, etc.
        // yourFunction();
      },
    );

    // Clean up the timer to prevent memory leaks
    return () => {
      clearTimeout(timerId);
      trackChangeSubscription.remove();
    };
  };
  const HomeSong = ({
    id,
    title,
    imgSource,
    artist,
    darkerColor,
    navigation,
    musicArray,
    index,

    url,
    duration,
  }) => {
    const {palette} = useMaterialYou({});
    const playbackState = usePlaybackState();
    const primary40 = palette.system_accent1[8];
    const lightColorPlaying = newShade(darkerColor, 35);
    const [showAlert, setshowAlert] = useState(false);
    const alertShadow = newShade(primary40, 90);

    const indexForSong = index;

    const artworkForNoti = imgSource;

    if (artist.length > 15) {
      var artistText = artist.slice(0, 15) + '...';
    } else {
      var artistText = artist;
    }
    if (title.length > 20) {
      var titleText = title.slice(0, 20) + '...';
    } else {
      var titleText = title;
    }

    const handleButtonPress = async () => {
      navigation.navigate('Music');

      var currentTrack = await TrackPlayer.getActiveTrackIndex();

      if (currentTrack !== null) {
        if (
          playbackState.state === State.Paused ||
          playbackState.state === State.Ready
        ) {
          await TrackPlayer.skip(indexForSong);
          await TrackPlayer.updateNowPlayingMetadata({artwork: artworkForNoti});
          await TrackPlayer.play();
        } else {
          if (currentTrack !== indexForSong) {
            console.log(indexForSong);

            await TrackPlayer.skip(indexForSong);
            await TrackPlayer.updateNowPlayingMetadata({
              artwork: artworkForNoti,
            });
            await TrackPlayer.play();
          }
        }
      } else {
        console.log('chec');
      }
    };
    const handleDelete = async () => {
      await TrackPlayer.stop();
      await RNFS.unlink(url)
        .then(() => {
          console.log('FILE DELETED');
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch(err => {
          console.log(err.message);
        });
      await musicArray.splice(
        musicArray.findIndex(function (i) {
          return i.id === id;
        }),
        1,
      );
      await console.log(musicArray);
      await setMusicData(musicArray).then(() => RNRestart.restart());
    };
    return (
      <TouchableOpacity onPress={() => handleButtonPress()}>
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 10,
              padding: 10,
              backgroundColor: darkerColor,
              borderRadius: 25,
              marginHorizontal: 5,
            },
          ]}>
          <View style={{flexDirection: 'row', width: '70%'}}>
            <Image
              source={{uri: imgSource}}
              style={{
                borderRadius: 15,
                width: 55,
                height: 55,

                alignSelf: 'center',
              }}
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

          <View
            style={{
              justifyContent: 'center',
              padding: 5,
            }}>
            <TouchableOpacity onPress={() => setshowAlert(true)}>
              <Image
                source={dotSource}
                style={{
                  width: 22,
                  height: 22,
                  resizeMode: 'contain',

                  tintColor: palette.system_accent1[3],
                  alignSelf: 'center',
                  transform: [{rotate: '90deg'}],
                }}
              />
            </TouchableOpacity>
            <Text style={{fontFamily: 'ClashDisplay-Regular'}}>{duration}</Text>
          </View>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Confirmation"
            message="Are you sure you want to delete this song from your playlist?"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showConfirmButton={true}
            showCancelButton={true}
            confirmText="Ok"
            confirmButtonColor="#DD6B55"
            cancelButtonColor="#DD6B55"
            onConfirmPressed={() => {
              setshowAlert(false);
              handleDelete();
            }}
            onCancelPressed={() => {
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
            cancelButtonStyle={{
              backgroundColor: darkerColor,
              borderRadius: 10,
              width: 90,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            cancelButtonTextStyle={{
              fontFamily: 'ClashDisplay-Regular',
              fontSize: 20,
              color: 'white',
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const togglePlayback = async (playback, artwork) => {
    const currentTrack = await TrackPlayer.getActiveTrackIndex();
    await TrackPlayer.updateMetadataForTrack(currentTrack, {
      artwork: artwork, // URI of your custom artwork
    });
    if (currentTrack !== null) {
      if (playback === State.Paused || playback === State.Ready) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };
  const nextKeLiye = async () => {
    const infoFromTrack = await TrackPlayer.getActiveTrack();
    setCurrentTrack(infoFromTrack);
  };
  const prevKeLiye = async () => {
    const infoFromTrack = await TrackPlayer.getActiveTrack();
    setCurrentTrack(infoFromTrack);
  };
  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
    const delay = 100;
    const timerId = setTimeout(() => {
      // Your function to be executed after delay
      nextKeLiye();
    }, delay);

    // Clean up the timer to prevent memory leaks
    return () => clearTimeout(timerId);
  };
  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
    const delay = 100;
    const timerId = setTimeout(() => {
      // Your function to be executed after delay
      prevKeLiye();
    }, delay);

    // Clean up the timer to prevent memory leaks
    return () => clearTimeout(timerId);
  };
  return (
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
              fontSize: 35,
              color: '#ffffff',
            },
          ]}>
          Good{' '}
          {(hour < 12 && 'Morning') || (hour < 18 && 'Afternoon') || 'Evening'}{' '}
          ,
        </Text>
      </View>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontFamily: 'ClashDisplay-Medium',
            fontSize: 15,
            marginLeft: 10,
            color: palette.system_accent1[3],
          }}>
          ---------
        </Text>

        <Text
          style={{
            fontFamily: 'ClashDisplay-Medium',
            fontSize: 35,
            marginLeft: 10,
            color: palette.system_accent1[3],
          }}>
          Your {space}Playlist
        </Text>

        {musicArray.length > 0 ? (
          <FlatList
            data={musicArray.map((item, index) => ({...item, index}))}
            renderItem={({item, index}) => (
              <HomeSong
                title={item.title}
                id={item.id}
                imgSource={item.artwork}
                artist={item.artist}
                darkerColor={darkerColor}
                navigation={navigation}
                musicArray={musicArray}
                index={index}
                duration={item.duration}
                url={item.url}
              />
            )}
            keyExtractor={item => item.id}
            style={{marginTop: 7}}
            showsVerticalScrollIndicator={false}
            fadingEdgeLength={200}
            contentContainerStyle={{paddingBottom: 220}}
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
              style={{
                fontFamily: 'ClashDisplay-Medium',
                fontSize: 25,
                color: palette.system_accent1[3],
              }}>
              Add songs to your Playlist!
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 110,
            alignSelf: 'center',
            width: '85%',
          }}
          onPress={async () => {
            playbackState.state === State.Playing
              ? navigation.navigate('Music')
              : console.log('Nothing');
          }}>
          <View
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 10,
                padding: 10,
                backgroundColor: primary40,
                borderRadius: 25,
                marginHorizontal: 5,
                elevation: 7,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                width: '60%',

                overflow: 'hidden',
              }}>
              <Image
                source={{
                  uri:
                    currentTrack !== undefined
                      ? currentTrack.artwork
                      : 'https://placehold.co/400x400.png',
                }}
                style={{
                  borderRadius: 15,
                  width: 55,
                  height: 55,

                  alignSelf: 'center',
                }}
              />

              <View
                style={{
                  justifyContent: 'center',
                  padding: 12,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'ClashDisplay-Semibold',
                    fontSize: 18,
                    color: palette.system_accent1[3],
                    marginBottom: 3,
                  }}>
                  {currentTrack !== undefined
                    ? currentTrack.title
                    : 'No Music is Playing'}
                </Text>
                <Text
                  style={{
                    fontFamily: 'ClashDisplay-Regular',
                    fontSize: 14,
                    color: palette.system_accent1[3],
                  }}>
                  {currentTrack !== undefined ? currentTrack.artist : ''}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{justifyContent: 'center', padding: 5}}
              onPress={() => skipToPrevious()}>
              <Image
                source={backBtnSource}
                style={{
                  width: 22,
                  height: 22,
                  resizeMode: 'contain',
                  tintColor: palette.system_accent1[3],
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{justifyContent: 'center', padding: 5}}
              onPress={() =>
                togglePlayback(playbackState.state, currentTrack.artwork)
              }>
              <Image
                source={
                  playbackState.state === State.Paused
                    ? playButtonSource
                    : pauseButtonSource
                }
                style={{
                  width: 22,
                  height: 22,
                  resizeMode: 'contain',
                  tintColor: palette.system_accent1[3],
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{justifyContent: 'center', padding: 5}}
              onPress={() => skipToNext()}>
              <Image
                source={nextBtnSource}
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
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardImage: {
    height: 180,
    marginBottom: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  gradient: {
    flex: 1,
  },
  label: {
    padding: 16,
    color: '#ffffff',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Adjust height as needed
    zIndex: 10,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Adjust height as needed
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust the opacity as needed
    zIndex: 11,
  },
  sliderContainer: {
    width: '80%',
    height: 40,
    marginTop: 25,
  },
});
export default Home;
