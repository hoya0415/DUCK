import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import floatDuck from '../assets/흘러가는오리-1.gif';
import domLogo from '../assets/덕친소_logo.png';
import logo from '../assets/덕후의친구를소개합니다_logo.png';
import { Check } from '@mui/icons-material';
import { signupUser } from '../_action/user_action';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Typography,
  Backdrop,
  Box,
  TextField,
  Button,
} from '@mui/material';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputPasswordConfirm, setInputPasswordConfirm] = useState('');
  const [activeBtn, setActiveBtn] = useState(false); // 이메일, 비밀번호 유효성 검사 & 비밀번호 일치 여부
  const [activeEmail, setActiveEmail] = useState(null); // 이메일 유효성 검사
  const [activePw, setActivePw] = useState(null); // 비밀번호 유효성 검사
  const [dpNameCheck, setDpNameCheck] = useState(null); // 이메일 중복 여부
  const [activeDpBtn, setActiveDpBtn] = useState(false); // 이메일 중복확인 버튼 보이기 여부
  const [open, setOpen] = useState(false); // 이메일 중복 경고 창 오픈 여부
  const handleClose = () => setOpen(false);

  // 회원가입 버튼 활성화 여부
  const onActiveBtn = () => {
    if (isSamePassword() && inputPasswordConfirm !== '') {
      if (inputEmail && activePw && activeEmail) {
        setActiveBtn(true);
      }
    }
  };
  // 이메일 유효성 검사
  const isEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9_]+@+(([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,})$/i;
    if (email) {
      setActiveEmail(emailRegex.test(email));
      setActiveDpBtn(emailRegex.test(email));
    } else {
      setActiveEmail(true);
      setActiveDpBtn(false);
    }
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
  // 이메일 입력 감지
  const onEmailChange = (event) => {
    setInputEmail(event.target.value.trim());
    isEmail(event.target.value.trim());
    setDpNameCheck(null);
  };
  // 비밀번호 입력 감지
  const onPasswordChange = (event) => {
    setInputPassword(event.target.value.trim());
    isPassword(event.target.value.trim());
  };
  const onPasswordChangeConfirm = (event) => {
    setInputPasswordConfirm(event.target.value.trim());
  };
  // {비밀번호 확인}과 {비밀번호}가 같은지 검사
  const isSamePassword = () => {
    if (inputPassword === inputPasswordConfirm || inputPasswordConfirm === '') {
      return true;
    } else {
      return false;
    }
  };
  // 회원가입 제출
  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(signupUser(inputEmail, inputPassword)).then(() => {
      navigate('/');
    });
  };

  // 이메일 중복 체크
  const dpCheck = () => {
    axios({
      method: 'get',
      url: `http://3.35.207.243:9999/duck/user/duple/email/${inputEmail}`,
    })
      .then((res) => {
        if (res.data.isDuple) {
          setOpen(true);
        } else {
          setDpNameCheck(true);
        }
      })
      .catch((err) => {
        console.log(err);
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
    backgroundColor: '#ffffff',
    border: '2px solid white',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
    padding: '10%',
    opacity: '80%',
  };

  return (
    <div id='Signup'>
      <div className='logo-fld'>
        <img className='logo-img' src={logo} alt='' />
        <img className='float-duck-img' src={floatDuck} alt='흘러가는 오리' />
        <img className='dom-logo-img' src={domLogo} alt='' />
      </div>
      {/* 회원가입 필드 */}
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
            <div className='parent'>
              <TextField
                autoFocus
                id='input-email'
                label='이메일'
                value={inputEmail || ''}
                onChange={onEmailChange}
                onKeyUp={onActiveBtn}
              />
              {/* 이메일 형식이 맞으면 중복체크 버튼 보이고 중복 확인 해달라는 메시지 보이기  */}
              {activeDpBtn === false ? null : (
                <div>
                  {/* 이메일 중복 검사 결과 false면 체크 버튼 / true면 체크표시로 바꾸기 */}
                  {dpNameCheck === null ? (
                    <Button
                      id='check-btn'
                      onClick={dpCheck}
                      className='child'
                      variant='outlined'
                    >
                      <span className='check-txt'>중복확인</span>
                    </Button>
                  ) : (
                    <Check id="checkiconbg" className='child check-icon' />
                  )}
                </div>
              )}
            </div>
            {activeEmail === true &&
              dpNameCheck !== true &&
              activeDpBtn === true ? (
              <span className='err-msg'>이메일 중복 확인을 해주세요.</span>
            ) : null}
            {activeEmail === false ? (
              <span className='err-msg'>이메일 형식을 확인해주세요.</span>
            ) : null}
            <TextField
              id='input-pw'
              label='비밀번호'
              type='password'
              autoComplete='current-password'
              value={inputPassword || ''}
              onChange={onPasswordChange}
              onKeyUp={onActiveBtn}
            />
            {activePw === false ? (
              <span className='err-msg'>
                영어+숫자+특수문자 8자이상 16자 이하
              </span>
            ) : null}
            <TextField
              id='input-pw-confirm'
              label='비밀번호 확인'
              type='password'
              autoComplete='current-password'
              value={inputPasswordConfirm || ''}
              onChange={onPasswordChangeConfirm}
              onKeyUp={onActiveBtn}
            />
            {isSamePassword() === false ? (
              <span className='err-msg'>비밀번호가 일치하지 않습니다.</span>
            ) : null}
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
              회원가입
            </Button>
          </div>
        </div>
      </Box>
      <div className='move-to-fld'>
        <span>이미 계정이 있으신가요?</span>
        <Link to='/' className='move-to'>
          {' '}
          로그인
        </Link>
      </div>
      {/* 모달 */}
      <div>
        <Modal
          open={open}
          onClose={handleClose}
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
              중복 확인 실패
            </Typography>
            <Typography id='modal-modal-description' sx={{ mt: 2 }}>
              이미 가입된 이메일입니다.
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default SignUp;
