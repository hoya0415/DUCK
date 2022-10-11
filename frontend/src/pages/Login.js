import { Link } from 'react-router-dom';
import React from 'react';
import Box from '@mui/material/Box';
import { Modal, Typography, Backdrop, Slide } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import floatDuck from '../assets/흘러가는오리-1.gif';
import domLogo from '../assets/덕친소_logo.png';
import logo from '../assets/덕후의친구를소개합니다_logo.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../_action/user_action';

const Login = () => {
  // 변수 선언
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [activeBtn, setActiveBtn] = useState(false);
  const [activeEmail, setActiveEmail] = useState(null);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [baseChecked, setBaseChecked] = useState(true);

  // 함수 선언
  useEffect(() => {
    setTimeout(() => {
      setChecked(true);
      setBaseChecked(false);
    }, 2000);
  }, []);
  const handleClose = () => setOpen(false);
  const onActiveBtn = () => {
    if (
      inputEmail &&
      inputPassword &&
      inputPassword.trim().length >= 8 &&
      activeEmail
    ) {
      setActiveBtn(true);
    } else {
      setActiveBtn(false);
    }
  };
  const isEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9_]+@+(([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,})$/i;
    if (email) {
      setActiveEmail(emailRegex.test(email));
    } else {
      setActiveEmail(true);
    }
  };
  const onEmailChange = (event) => {
    setInputEmail(event.target.value.trim());
    isEmail(event.target.value);
  };
  const onPasswordChange = (event) => {
    setInputPassword(event.target.value.trim());
  };
  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(inputEmail, inputPassword))
      .then((res) => {
        if (res.payload.accessToken) {
          localStorage.setItem('jwt', res.payload.accessToken);
          navigate('/welcome');
        }
      })
      .catch(() => {
        setOpen(true);
      });
  };

  // 스타일 선언
  const modalStyle = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '170px',
    backgroundColor: '#ffffff',
    border: '2px solid white',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
    padding: '10%',
    opacity: '80%',
  };

  return (
    <div id='Login'>
      {/* 커버 페이지 */}
      <Slide in={baseChecked} direction='right'>
        <div className='logo-fld-cv'>
          <img className='logo-img-cv' src={logo} alt='' />
          <img
            className='float-duck-img-cv'
            src={floatDuck}
            alt='흘러가는 오리'
          />
          <img className='dom-logo-img-cv' src={domLogo} alt='' />
        </div>
      </Slide>
      <Slide in={checked} direction='left'>
        <div>
          {/* 로고 필드 */}
          <div className='logo-fld'>
            <img className='logo-img' src={logo} alt='' />
            <img
              className='float-duck-img'
              src={floatDuck}
              alt='흘러가는 오리'
            />
            <img className='dom-logo-img' src={domLogo} alt='' />
          </div>

          {/* 로그인 필드 */}
          <Box
            onSubmit={onSubmit}
            component='form'
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete='off'
          >
            <div className='account-fld'>
              <div className='input-fld'>
                <TextField
                  autoFocus
                  id='input-email'
                  label='이메일'
                  value={inputEmail || ''}
                  onChange={onEmailChange}
                  onKeyUp={onActiveBtn}
                />
                {activeEmail === false ? (
                  <span className='err-msg'>이메일 형식을 확인해주세요.</span>
                ) : (
                  false
                )}
                <TextField
                  id='input-pw'
                  label='비밀번호'
                  type='password'
                  autoComplete='current-password'
                  value={inputPassword || ''}
                  onChange={onPasswordChange}
                  onKeyUp={onActiveBtn}
                />
                <Button
                  className='submit-btn'
                  style={{
                    background: activeBtn
                      ? 'linear-gradient(to right, #F86F0B, #F8AB0B)'
                      : '#A1A0A0',
                    color: 'white',
                  }}
                  disabled={!activeBtn}
                  type='submit'
                  variant='contained'
                >
                  로그인
                </Button>
              </div>
            </div>
          </Box>
          <div className='move-to-fld'>
            <span>계정이 없으신가요?</span>
            <Link to='/signup' className='move-to'>
              회원가입
            </Link>
          </div>

          {/* 모달 */}
          <div>
            <Modal
              open={open}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Box style={modalStyle}>
                <Typography id='modal-modal-title' variant='h6' component='h2'>
                  로그인 실패
                </Typography>
                <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                  계정 정보를 확인해주세요.
                </Typography>
              </Box>
            </Modal>
          </div>
        </div>
      </Slide>
    </div>
  );
};

export default Login;
