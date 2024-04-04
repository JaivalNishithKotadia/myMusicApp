import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
} from 'react-native-track-player';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getActiveTrackIndex();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      icon: require('./assets/icons/appIconForNoti.png'),
      progressUpdateEventInterval: 2,
    });

    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function addTracks(data) {
  await TrackPlayer.add(data);
  console.log(data);
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
  // TODO: Attach remote event handlers
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    TrackPlayer.skipToNext();
    const delay = 150;
    const timerId = setTimeout(async () => {
      // Your function to be executed after delay
      const currentTrack = await TrackPlayer.getActiveTrack();
      await TrackPlayer.updateNowPlayingMetadata({
        artwork: currentTrack.artwork,
      });
    }, delay);
    return () => {
      clearTimeout(timerId);
    };
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    TrackPlayer.skipToPrevious();
    const delay = 150;
    const timerId = setTimeout(async () => {
      // Your function to be executed after delay
      const currentTrack = await TrackPlayer.getActiveTrack();
      await TrackPlayer.updateNowPlayingMetadata({
        artwork: currentTrack.artwork,
      });
    }, delay);
    return () => {
      clearTimeout(timerId);
    };
  });
  TrackPlayer.addEventListener('remote-seek', ({position}) => {
    TrackPlayer.seekTo(position);
  });
}
