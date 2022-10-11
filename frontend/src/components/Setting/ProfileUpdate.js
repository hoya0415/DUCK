import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { editProfile, getUserProfile } from '../../_action/user_action';
import './ProfileUpdate.css';
import floatDuck from '../../assets/흘러가는오리-1.gif';
import {
  Avatar,
  Badge,
  Button,
  TextField,
  Box,
  Modal,
  Backdrop,
  Typography,
} from '@mui/material';
import { ArrowBack, Check } from '@mui/icons-material';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import axios from 'axios';
import ProfileAvatar from '../ProfileAvatar';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { luAccessToken, luImg, luUserId, puNickname, puBio } = useSelector(
    (state) => ({
      luAccessToken: state.user.luAccessToken,
      luImg: state.user.luImg,
      luUserId: state.user.luUserId,
      puBio: state.user.puBio,
      puNickname: state.user.puNickname,
    })
  );
  const [profileImg, setProfileImg] = useState(luImg);
  const [preview, setPreview] = useState(luImg);
  const [inputNickname, setInputNickname] = useState(puNickname);
  const [bio, setBio] = useState(puBio);
  const [dpNicknameCheck, setDpNicknameCheck] = useState(true); // 닉네임 중복 검사
  const [activeNickname, setActiveNickname] = useState(true); // 닉네임 규칙 검사

  const [open, setOpen] = useState(false); // 이메일 중복 경고 창 오픈 여부
  const [checkOpen, setCheckOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleCheckClose = () => setCheckOpen(false);
  const handleConfirmClose = () => setConfirmOpen(false);

  const onNicknameChange = (event) => {
    setInputNickname(event.target.value.trim());
    isNickname(event.target.value.trim());
    setDpNicknameCheck(null);
  };

  const onBioChange = (event) => {
    if (event.target.value.length > 20) {
      setBio(event.target.value.substr(0, 20));
    } else {
      setBio(event.target.value);
    }
  };
  
  const imgChange = (e) => {
    setPreview(URL.createObjectURL(e.target.files[0]));
    setProfileImg(e.target.files[0]);
  };

  const deleteFileImage = () => {
    URL.revokeObjectURL(preview);
    setPreview(null);
    setProfileImg(null);
  };


  const isNickname = (nickname) => {
    const emailRegex = /^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣~!@#$%^&*_]{2,10}$/i;
    if (nickname) {
      setActiveNickname(emailRegex.test(nickname));
    } else {
      setActiveNickname(false);
    }
  };

  const isNicknameDp = () => {
    axios({
      method: 'get',
      url: `http://3.35.207.243:9999/duck/user/duple/nickname/${inputNickname}`,
    })
      .then((res) => {
        if (res.data.isDuple) {
          setOpen(true);
        } else {
          setDpNicknameCheck(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      });
  };

  const clickDone = (event) => {
    event.preventDefault();
    if (dpNicknameCheck === true) {
      setConfirmOpen(true);
    } else {
      setCheckOpen(true);
    }
  };

  const updateProfile = (event) => {
    const formData = new FormData();
    formData.append('nickname', inputNickname);
    formData.append('bio', bio);
    formData.append('file', profileImg);
    dispatch(editProfile(formData, luAccessToken, inputNickname));
    dispatch(getUserProfile(luUserId, luUserId));
    navigate(`/profile/${luUserId}`);
  };

  const modalStyle = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: '#ffffff',
    border: '2px solid white',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
    padding: '10%',
    opacity: '80%',
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
        <h4 onClick={clickDone} className='complete-button'>
          <Check id='top-bar-fld-check'/>
        </h4>
      </div>
      <div className='profile-fld'></div>
      <div className='profile-edit-ducks'>
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
      </div>
      <div className='back-card'>
        <div>
          <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              preview ? (
                <button
                  className='FileInput-clear-button'
                  onClick={() => deleteFileImage()}
                >
                  <RemoveCircleRoundedIcon fontSize='large'></RemoveCircleRoundedIcon>
                </button>
              ) : (
                <CameraAltRoundedIcon fontSize='large'></CameraAltRoundedIcon>
              )
            }
          >
            <ProfileAvatar w={250} h={250} imgUrl={preview} />
            {
              <input
                type='file'
                className='FileInput-hidden'
                onChange={imgChange}
                accept='image/*'
              />
            }
          </Badge>
        </div>

        <Box
          component='form'
          sx={{
            '& .MuiTextField-root': { m: 1, width: '30ch' },
          }}
          noValidate
          autoComplete='off'
        >
          <div className='account-fld'>
            <div className='input-fld' style={{ marginTop: '30px' }}>
              <div className='parent'>
                <TextField
                  autoFocus
                  id='input-email'
                  label='닉네임'
                  value={inputNickname || ''}
                  onChange={onNicknameChange}
                  className='profile-update-input'
                />
                {/* 닉네임 형식이 맞으면 중복체크 버튼 보이고 중복 확인 해달라는 메시지 보이기  */}
                {/* 닉네임 중복 검사 결과 false면 체크 버튼 / true면 체크표시로 바꾸기 */}

                {activeNickname !== true ? null : (
                  <div>
                    {dpNicknameCheck === null ? (
                      <Button
                        id='check-btn'
                        onClick={isNicknameDp}
                        className='profile-child'
                        variant='outlined'
                      >
                        <span className='check-txt'>중복확인</span>
                      </Button>
                    ) : (
                      <Check
                        id='checkiconbg'
                        className='profile-child check-icon'
                      />
                    )}
                  </div>
                )}
              </div>
              {activeNickname === true && dpNicknameCheck !== true ? (
                <span className='err-msg'>닉네임 중복 확인을 해주세요.</span>
              ) : null}
              {activeNickname === false ? (
                <span className='err-msg'>
                  2글자 이상, 10글자 이하로 입력해주세요.
                </span>
              ) : null}
              <TextField
                id='outlined-multiline-static'
                label='한 줄 소개'
                rows={4}
                value={bio || ''}
                onChange={onBioChange}
                multiline
                className='profile-update-input'
              />
            </div>
          </div>
        </Box>
      </div>
      {/* 닉네임 중복 확인 모달 */}
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
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
              사용 중인 닉네임입니다.
            </Typography>
          </Box>
        </Modal>
      </div>
      {/* 완료 */}
      <div>
        <Modal
          open={checkOpen}
          onClose={handleCheckClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
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
              닉네임 중복 확인을 해주세요.
            </Typography>
          </Box>
        </Modal>
      </div>
      {/* 수정 확인 모달 */}
      <div>
        <Modal
          open={confirmOpen}
          onClose={handleConfirmClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box style={modalStyle}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              수정하시겠습니까?
            </Typography>
            <Button
              onClick={updateProfile}
              id='modal-modal-description'
              sx={{ mt: 2 }}
            >
              수정
            </Button>
            <Button
              onClick={handleConfirmClose}
              id='modal-modal-description'
              sx={{ mt: 2 }}
            >
              취소
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default ProfileUpdate;
