import React from 'react';
import './ChattingVideo.css';

const ChattingVideo = ({ url }) => {
  return (
    <div className='chat-video'>
      <iframe
        id='player'
        type='text/html'
        src={url || 'https://www.youtube.com/embed/I6ElaRzbZ4w'}
        title='YouTube video player'
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default ChattingVideo;
