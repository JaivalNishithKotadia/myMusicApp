import AsyncStorage from '@react-native-async-storage/async-storage';
import {addTracks} from './trackPlayerServices';

const MUSIC_DATA_KEY = 'musicData';

export const storeMusicData = async (musicData, navigation) => {
  try {
    let existingData = await AsyncStorage.getItem(MUSIC_DATA_KEY);
    console.log(`Existing Data - ${existingData}`);
    if (existingData) {
      const existingDataArray = JSON.parse(existingData);
      existingDataArray.push(musicData);
      await AsyncStorage.setItem(
        MUSIC_DATA_KEY,
        JSON.stringify(existingDataArray),
      );
      console.log(
        `Music data stored successfully ${JSON.stringify(existingDataArray)}`,
      );
    } else {
      await AsyncStorage.setItem(MUSIC_DATA_KEY, JSON.stringify([musicData]));
      console.log(
        `Music data stored successfully ${JSON.stringify([musicData])}`,
      );
    }
  } catch (error) {
    console.log('Error storing music data:', error);
  }
};

export const getMusicData = async () => {
  try {
    const musicDataString = await AsyncStorage.getItem(MUSIC_DATA_KEY);
    if (musicDataString) {
      return JSON.parse(musicDataString);
    } else {
      console.log('No music data found');
      return [];
    }
  } catch (error) {
    console.log('Error retrieving music data:', error);
    return [];
  }
};

export const setMusicData = async data => {
  try {
    await AsyncStorage.setItem(MUSIC_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.log('Error Playlist');
  }
};
