import { FC, useEffect, useState } from 'react';
import { createStyles, SimpleGrid } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { AgoraVideoPlayer, ClientConfig, createClient, createMicrophoneAndCameraTracks, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-react";
import { Check } from 'tabler-icons-react';

const useStyles = createStyles(() => ({
  wrapper: {
    maxHeight: '300px',
    overflowY: 'scroll'
  },
  video: {
    height: '300px',
    width: '100%'
  }
}));

const config: ClientConfig = { mode: "rtc", codec: "vp8" };
const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const appId = import.meta.env.VITE_AGORA_APP_ID;
const token = import.meta.env.VITE_AGORA_TOKEN;
const channel = 'monaco-demo';

const Live: FC = () => {
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    const init = async (name: string) => {
      console.log('init', name);

      client.on('user-joined', user => {
        showNotification({
          title: 'Channel Joined!',
          message: `${user.uid} 께서 입장하셨습니다`,
          icon: <Check />
        });
      });

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log('subscribe success');

        if (mediaType === 'video')
          setUsers(prev => ([...prev, user]));

        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user, type) => {
        console.log('unpublished', user, type);

        if (type === 'audio') {
          user.audioTrack?.stop();
        }

        if (type === 'video') {
          setUsers(prev => prev.filter(user => user.uid !== user.uid));
        }
      });

      client.on('user-left', user => {
        console.log('leaving', user);
        showNotification({
          title: 'Channel Leave!',
          message: `${user.uid} 께서 떠나셨습니다.`,
          icon: <Check />,
          color: 'red'
        });
        setUsers(prev => prev.filter(user => user.uid !== user.uid));
      });

      await client.join(String(appId), name, String(token), null);

      if (tracks) {
        await client.publish([tracks[0], tracks[1]]);
        setStart(true);
      }
    };

    if (ready && tracks) {
      console.log('init ready');
      showNotification({
        title: 'Channel ready!',
        message: '채널에 입장하셨습니다',
        icon: <Check />,
        color: 'green'
      });

      init(String(channel));
    }
  }, [channel, client, ready, tracks]);

  return (
    <>
      { start && tracks && <Videos users={ users } tracks={ tracks } /> }
    </>
  );
};

type videosProps = {
  users: IAgoraRTCRemoteUser[],
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack],
};

const Videos: FC<videosProps> = props => {
  const { classes } = useStyles();
  const { users, tracks } = props;
  return (
    <SimpleGrid className={ classes.wrapper } cols={ 2 } >
      <AgoraVideoPlayer className={ classes.video } videoTrack={ tracks[1] } />
      { users.length > 0 &&
        users.map(user => user.videoTrack ? <AgoraVideoPlayer className={ classes.video } videoTrack={ user.videoTrack } key={ user.uid } /> : null
        ) }
    </SimpleGrid>
  );
};

export default Live;