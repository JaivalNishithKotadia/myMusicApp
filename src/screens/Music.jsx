import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {getColors} from 'react-native-image-colors';
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
//@ts-ignore
import Slider from 'react-native-slider';

const backBtnSource = require('../../assets/icons/prev-song.png');
const backBtnScreen = require('../../assets/icons/back.png');
const nextBtnSource = require('../../assets/icons/next-song.png');
const pauseButtonSource = require('../../assets/icons/pause-button.png');
const playButtonSource = require('../../assets/icons/play-button.png');
const MusicControl = ({imageColors, artwork}) => {
  const playBackState = usePlaybackState();

  const nextKeLiye = async () => {
    const infoFromTrack = await TrackPlayer.getActiveTrack();
    setInfo(infoFromTrack);
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
  };
  const togglePlayback = async playback => {
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
  if (imageColors !== null) {
    var btnColor = imageColors;
  } else {
    var btnColor = '#ffffff';
  }
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
  const darkerColorForBtn = newShade(btnColor, -60);

  return (
    <LinearGradient
      colors={['#111111', '#111111']}
      style={[
        {
          width: '85%',
          marginTop: 50,
          height: '35%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          borderRadius: 35,
          flexDirection: 'row',
        },
      ]}>
      <TouchableOpacity onPress={skipToPrevious}>
        <View style={styles.btnContainer}>
          <Image
            source={backBtnSource}
            style={{width: 26, height: 26, tintColor: '#dbdbdb'}}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => togglePlayback(playBackState.state)}>
        <LinearGradient
          colors={[btnColor, darkerColorForBtn]}
          style={{
            width: 66,
            height: 66,
            borderRadius: 33,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={
              playBackState.state === State.Playing
                ? pauseButtonSource
                : playButtonSource
            }
            style={
              playBackState.state === State.Playing
                ? {
                    width: 30,
                    height: 30,
                    tintColor: '#1c1c1c',
                  }
                : {
                    width: 27,
                    height: 27,
                    tintColor: '#1c1c1c',
                    marginLeft: 4,
                  }
            }
          />
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={skipToNext}>
        <View style={styles.btnContainer}>
          <Image
            source={nextBtnSource}
            style={{width: 26, height: 26, tintColor: '#dbdbdb'}}
          />
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const device = Dimensions.get('screen');
const Music = ({route, navigation}) => {
  const playBackState = usePlaybackState();
  const [sound, setSound] = useState();
  const [info, setInfo] = useState([]);
  const [imageColors, setImageColors] = React.useState(null);
  const {position, duration} = useProgress();
  const MusicControl = ({imageColors, artwork}) => {
    const nextKeLiye = async () => {
      const infoFromTrack = await TrackPlayer.getActiveTrack();
      setInfo(infoFromTrack);
      await TrackPlayer.updateNowPlayingMetadata({
        artwork: infoFromTrack.artwork,
      });
    };
    const prevKeLiye = async () => {
      const infoFromTrack = await TrackPlayer.getActiveTrack();
      setInfo(infoFromTrack);
      await TrackPlayer.updateNowPlayingMetadata({
        artwork: infoFromTrack.artwork,
      });
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
    const togglePlayback = async playback => {
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
    if (imageColors !== null) {
      var btnColor = imageColors;
    } else {
      var btnColor = '#ffffff';
    }
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
    const darkerColorForBtn = newShade(btnColor, -60);

    return (
      <LinearGradient
        colors={['#111111', '#111111']}
        style={[
          {
            width: '85%',
            marginTop: 50,
            height: '35%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            borderRadius: 35,
            flexDirection: 'row',
          },
        ]}>
        <TouchableOpacity onPress={skipToPrevious}>
          <View style={styles.btnContainer}>
            <Image
              source={backBtnSource}
              style={{width: 26, height: 26, tintColor: '#dbdbdb'}}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => togglePlayback(playBackState.state)}>
          <LinearGradient
            colors={[btnColor, darkerColorForBtn]}
            style={{
              width: 66,
              height: 66,
              borderRadius: 33,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={
                playBackState.state === State.Paused
                  ? playButtonSource
                  : pauseButtonSource
              }
              style={
                playBackState.state === State.Paused
                  ? {
                      width: 27,
                      height: 27,
                      tintColor: '#1c1c1c',
                      marginLeft: 4,
                    }
                  : {
                      width: 30,
                      height: 30,
                      tintColor: '#1c1c1c',
                    }
              }
            />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToNext}>
          <View style={styles.btnContainer}>
            <Image
              source={nextBtnSource}
              style={{width: 26, height: 26, tintColor: '#dbdbdb'}}
            />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  };
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
  const getInfo = async () => {
    const infoFromTrack = await TrackPlayer.getActiveTrack();
    setInfo(infoFromTrack);
  };
  const getImgColor = async () => {
    if (info.length !== 0) {
      getColors(info.artwork)
        .then(colors => {
          const lighterColor = newShade(colors.dominant, 100);

          setImageColors(lighterColor);
        })
        .catch(error => {
          console.error('Error extracting colors:', error);
        });
    }
  };
  const automaticTrackChange = async () => {
    const infoFromTrack = await TrackPlayer.getActiveTrack();
    setInfo(infoFromTrack);
  };
  React.useEffect(() => {
    const delay = 100;
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
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#000000'}}>
      <View>
        <ImageBackground
          onLoad={() => {
            getImgColor();
          }}
          source={{
            uri:
              info.length !== 0
                ? info.artwork
                : 'https://placehold.co/400x400.png',
          }}
          blurRadius={5}
          style={{
            width: '100%',
            height: device.height / 2.5,
            alignSelf: 'center',

            alignItems: 'center',
          }}>
          <LinearGradient
            colors={['rgba(0,0,0,.2)', 'rgba(0,0,0,1)']}
            locations={[0, 1]}
            style={styles.gradient}
          />
          <TouchableOpacity
            onPress={() => navigation.pop()}
            style={{
              position: 'absolute',
              alignSelf: 'flex-start',
              top: 35,
              left: 15,
            }}>
            <View
              style={{
                width: 46,
                height: 46,
                backgroundColor: '#1c1c1c',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={backBtnScreen}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: imageColors !== null ? imageColors : '#ffffff',
                }}
              />
            </View>
          </TouchableOpacity>
          <Image
            onLoad={() => {
              getImgColor();
            }}
            source={{
              uri:
                info.length !== 0
                  ? info.artwork
                  : 'https://placehold.co/400x400.png',
            }}
            style={{
              width: device.width / 1.6,
              height: device.width / 1.6,
              borderRadius: 40,
              marginTop: 170,
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.5,
              shadowColor: imageColors,
            }}
          />
          <View
            style={{
              marginHorizontal: 20,

              width: '90%',
              alignItems: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={[
                {
                  marginTop: 40,
                  fontFamily: 'ClashDisplay-Semibold',
                  fontSize: 30,
                  textAlign: 'center',
                  color: imageColors !== null ? imageColors : '#ffffff',
                },
              ]}>
              {info.length !== 0 ? info.title : 'Loading...'}
            </Text>
            <Text
              style={{
                fontFamily: 'ClashDisplay-Regular',
                fontSize: 15,
                color: '#f2f2f2',
                alignSelf: 'center',
                marginTop: 8,
              }}>
              {info.length !== 0 ? info.artist : 'Loading...'}
            </Text>
          </View>

          {/*TODO :-React Native Awesome Slider */}
          <Slider
            value={position}
            minimumValue={0}
            maximumValue={duration}
            thumbTintColor={imageColors !== null ? imageColors : '#ffffff'}
            maximumTrackTintColor="#FFF"
            style={styles.sliderContainer}
            thumbStyle={[stylesThumb(imageColors).thumb]}
            trackStyle={[stylesThumb(imageColors).thumb]}
            minimumTrackTintColor={imageColors}
            onValueChange={value => console.log(value)}
            onSlidingStart={async () => {
              if (!playBackState.state === State.Playing) {
                return;
              }
              try {
                await TrackPlayer.pause();
              } catch (error) {
                console.log('Error Slider-', error);
              }
            }}
            onSlidingComplete={async value => {
              try {
                await TrackPlayer.seekTo(Math.floor(value));
                await TrackPlayer.play();
              } catch (error) {
                console.log('Error Complete-', error);
              }
            }}
          />
          <View style={stylesThumb(imageColors).timeContainer}>
            <Text style={stylesThumb(imageColors).time}>
              {new Date(position * 1000).toISOString().substring(15, 19)}
            </Text>
            <Text style={stylesThumb(imageColors).time}>
              {new Date(duration * 1000).toISOString().substring(15, 19)}
            </Text>
          </View>

          <MusicControl imageColors={imageColors} artwork={info.artwork} />
        </ImageBackground>
      </View>
    </View>
  );
};

export default Music;

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',

    width: '75%',
    marginTop: 20,
  },
  sliderContainer: {
    width: '80%',
    height: 40,
    marginTop: 25,
  },
  btnContainer: {
    backgroundColor: '#1c1c1c',
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const stylesThumb = imageColors =>
  StyleSheet.create({
    thumb: {
      shadowColor: imageColors,
      elevation: 8,
    },
    timeContainer: {
      width: '80%',

      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    time: {
      color: imageColors,
      fontFamily: 'ClashDisplay-Regular',
    },
  });
