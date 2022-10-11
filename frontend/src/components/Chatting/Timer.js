import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

function Timer({ chatId }) {
  const { chatList } = useSelector((state) => ({
    chatList: state.chat.chatList,
  }));
  const createDate = chatList.filter((room) => room.chatId === chatId)[0]
    .createDate;
  const [hour, sethour] = useState();
  const [min, setmin] = useState();
  const [second, setsecond] = useState();
  let interval = useRef();

  const startTimer = () => {
    const today = new Date(createDate);
    const tomorrow = new Date(createDate);
    tomorrow.setDate(today.getDate() + 1);

    interval = setInterval(() => {
      const now = new Date().getTime();

      const distance = tomorrow - now;

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        // 타이머 멈춤
        clearInterval(interval.current);
      } else {
        // 타이머 업데이트
        sethour(hours + 9);
        setmin(minutes);
        setsecond(seconds);
      }
    });
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  });

  return (
    <div className='timer'>
      {hour} : {min} : {second}
    </div>
  );
}

export default Timer;
