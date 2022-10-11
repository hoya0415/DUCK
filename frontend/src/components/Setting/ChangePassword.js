import { React, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './ChangePassword.css';
import { useNavigate } from 'react-router-dom';
import 기본프로필 from '../../assets/기본프로필.png';
import floatDuck from '../../assets/흘러가는오리-1.gif';
import { Avatar, Button, Box, TextField } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import ProfileAvatar from '../ProfileAvatar';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [activePw, setActivePw] = useState(null);
  const [preInputPassword, setPreInputPassword] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputPasswordConfirm, setInputPasswordConfirm] = useState('');
  const { userId, puImg, accessToken } = useSelector((state) => ({
    userId: state.user.luUserId,
    puImg: state.user.profileUrl,
    accessToken: state.user.luAccessToken,
  }));

  // 비밀번호 입력 감지
  const onPrePasswordChange = (event) => {
    setPreInputPassword(event.target.value.trim());
  };
  const onPasswordChange = (event) => {
    setInputPassword(event.target.value.trim());
    isPassword(event.target.value.trim());
  };
  const onPasswordChangeConfirm = (event) => {
    setInputPasswordConfirm(event.target.value.trim());
  };

  // 비밀번호 유효성 검사
  const isPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    if (password) {
      setActivePw(passwordRegex.test(password));
    } else {
      setActivePw(true);
    }
  };

  const isSamePassword = () => {
    if (inputPassword === inputPasswordConfirm || inputPasswordConfirm === '') {
      return true;
    } else {
      return false;
    }
  };

  const saveChangePwd = () => {
    if (activePw && isSamePassword()) {
      axios({
        method: 'put',
        url: 'http://3.35.207.243:9999/duck/user/password/edit',
        data: {
          accessToken: accessToken,
          newPassword: inputPassword,
          oldPassword: preInputPassword,
          type: 'edit',
        },
      }).then((res) => {
        if (res.status == 200) {
          alert('비밀번호 변경이 완료되었습니다.');
          navigate(`/profile/${userId}`);
        } else {
          alert('현재 비밀번호가 일치하지 않습니다.');
        }
      });
    } else if (activePw && !isSamePassword()) {
      alert('비밀번호 일치 여부를 확인해주세요.');
    } else if (!activePw && isSamePassword()) {
      alert('비밀번호 형식을 확인해주세요.');
    } else {
      alert('비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className='profile'>
      <div className='top-bar-fld'>
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBack fontSize='large' className='top-bar-button' />
        </Button>
        <h4 onClick={saveChangePwd} className='complete-button'>
          완료
        </h4>
      </div>
      <div className='profile-fld'>
        <img
          className='float-duck-img-pro-1'
          src={floatDuck}
          alt='흘러가는 오리'
        />
        <img
          className='float-duck-img-pro-2'
          src={floatDuck}
          alt='흘러가는 오리'
        />
        <div className='pofile-img-fld'>
          <ProfileAvatar w={140} h={140} imgUrl={puImg} />
        </div>
      </div>
      <div className='back-card'>
        <div id='change-password-form'>
          <Box
            component='form'
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete='off'
          >
            <div className='account-fld'>
              <div className='input-fld' style={{ marginTop: '40px' }}>
                <TextField
                  id='input-pw'
                  label='현재 비밀번호'
                  type='password'
                  autoComplete='current-password'
                  value={preInputPassword || ''}
                  onChange={onPrePasswordChange}
                  className='pwd-input-box'
                />
                <TextField
                  id='input-pw'
                  label='새 비밀번호'
                  type='password'
                  autoComplete='current-password'
                  value={inputPassword || ''}
                  onChange={onPasswordChange}
                  className='pwd-input-box'
                />
                {activePw === false ? (
                  <span className='err-msg'>
                    영어+숫자+특수문자 8자이상 16자 이하
                  </span>
                ) : null}
                <TextField
                  id='input-pw-confirm'
                  label='새 비밀번호 확인'
                  type='password'
                  autoComplete='current-password'
                  value={inputPasswordConfirm || ''}
                  onChange={onPasswordChangeConfirm}
                  className='pwd-input-box'
                />
                {isSamePassword() === false ? (
                  <span className='err-msg'>비밀번호가 일치하지 않습니다.</span>
                ) : null}
              </div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
