import React from 'react';
import floatDuck from '../assets/흘러가는오리-1.gif';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../components/ProfileAvatar';

const Welcome = () => {
  const { loggedUserId, luImg, luNickname } = useSelector((state) => ({
    loggedUserId: state.user.luUserId,
    luImg: state.user.luImg,
    luNickname: state.user.luNickname,
  }));
  const navigate = useNavigate();

  const handleToMain = (e) => {
    e.preventDefault();
    navigate('/feed');
  };

  return (
    <div className='welcome'>
      <div className='text-fld'>
        <div className='hello'>
          <h1>안녕, {loggedUserId}번 째 오리야!</h1>
        </div>
        <div className='hello-txt'>
          <h4>
            덕친소에 온 걸 환영해! <br /> 지금 바로 오리친구들을 만나보자!
          </h4>
        </div>
        <div className='w-100'>
          <img
            className='float-duck-img-wc'
            src={floatDuck}
            style={{ left: 0 }}
          />
          <img className='float-duck-img-wc ' style={{ right: 0 }} src={floatDuck} />
        </div>
        <div>
          <div className='welcome-profile' onClick={handleToMain}>
            <ProfileAvatar w={140} h={140} imgUrl={luImg} />
          </div>
        </div>
        <span className='welcome-nick'>{luNickname}</span>
      </div>
    </div>
  );
};

export default Welcome;
