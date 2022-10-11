import {
  Badge,
  Button,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChattingCreate.css';
import { ArrowBack } from '@mui/icons-material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { createChat } from '../../_action/chat_action';
import { AddPhotoAlternateRounded, ClearRounded } from '@mui/icons-material';

const ChattingCreate = () => {
  const luUserId = useSelector((state) => state.user.luUserId);
  const luAccessToken = useSelector((state) => state.user.luAccessToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputTitle, setInputTitle] = useState('');
  const [activeTitle, setActiveTitle] = useState(null);
  const [inputContents, setInputContents] = useState('');
  const [inputVideoUrl, setInputVideoUrl] = useState('');
  const [inputThumb, setInputThumb] = useState('');
  const [activeContents, setActiveContents] = useState(null);
  const [preview, setPreview] = useState('');

  // 사진
  const chatImgChange = (event) => {
    setPreview(URL.createObjectURL(event.target.files[0]));
    setInputThumb(event.target.files[0]);
  };
  const deleteFileImage = () => {
    URL.revokeObjectURL(preview);
    setPreview(null);
    setInputThumb(null);
  };
  // 유튜브 주소
  const onVideoUrlChange = (event) => {
    setInputVideoUrl(event.target.value);
  };

  // 제목
  const onTitleChange = (event) => {
    setInputTitle(event.target.value);
    isTitle(event.target.value);
  };

  const isTitle = (title) => {
    const textRegex = /^.{1,20}$/;
    if (title) {
      setActiveTitle(textRegex.test(title));
    } else if (title.length < 1) {
      setActiveTitle(false);
    } else {
      setActiveTitle(true);
    }
  };

  // 내용
  const onContentsChange = (event) => {
    setInputContents(event.target.value);
    isContents(event.target.value);
  };

  const isContents = (contents) => {
    if (100 < contents.length) {
      setActiveContents(false);
    } else {
      setActiveContents(true);
    }
  };

  // 피드 생성
  const onCreateChat = (event) => {
    const formData = new FormData();
    formData.append('chatContents', inputContents);
    formData.append('chatTitle', inputTitle);
    formData.append('videoUrl', inputVideoUrl);
    formData.append('file', inputThumb);
    formData.append('userId', luUserId);
    dispatch(createChat(formData, luAccessToken));
    navigate(`/chat`);
  };

  return (
    <div className='grade-back'>
      <div className='top-fld'>
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBack fontSize='large' className='top-bar-button' />
        </Button>
        {activeTitle ? (
          <h4 onClick={onCreateChat} className='complete-button'>
            완료
          </h4>
        ) : null}
      </div>
      <div className='white-back'>
        <Box
          component='form'
          sx={{
            '& .MuiTextField-root': { m: 1, width: '30ch' },
          }}
          noValidate
          autoComplete='off'
        >
          <div className='account-fld'>
            {/* 이미지 */}
            <div>
              <Badge
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  preview ? (
                    <p
                      className='FileInput-clear-button'
                      onClick={() => deleteFileImage()}
                    >
                      <ClearRounded
                        fontSize='large'
                        id='delete-photo-icon'
                      ></ClearRounded>
                    </p>
                  ) : null
                }
              >
                <div className='img-input-fld'>
                  {preview?.length ? (
                    <img className='feed-input-img' src={preview}></img>
                  ) : (
                    <div className='feed-input-none'>
                      <input
                        type='file'
                        className='FileInput-hidden-overlay'
                        onChange={chatImgChange}
                        accept='image/*'
                      />
                      <AddPhotoAlternateRounded className='add-photo-icon' />
                    </div>
                  )}
                </div>
              </Badge>
            </div>
            <div className='input-fld' style={{ marginTop: '30px' }}>
              <div className='text-input'>
                {/* 유튜브 주소 필드 */}
                <TextField
                  id='input-title'
                  label='유튜브 주소'
                  value={inputVideoUrl || ''}
                  onChange={onVideoUrlChange}
                  className='input-form'
                />
                {/* 제목필드 */}
                <TextField
                  id='input-title'
                  label='채팅이름'
                  value={inputTitle || ''}
                  onChange={onTitleChange}
                  className='input-form'
                />
                {activeTitle === false ? (
                  <span className='err-msg w-100 px-3'>
                    30글자 이하로 입력해주세요.
                  </span>
                ) : null}
                {/* 내용 필드 */}
                <TextField
                  id='input-contents'
                  label='소개글'
                  rows={6}
                  value={inputContents || ''}
                  multiline
                  onChange={onContentsChange}
                  className='input-form'
                />
              </div>
              {activeContents === false ? (
                <span className='err-msg w-100 px-3'>
                  100글자 이하로 입력해주세요.
                </span>
              ) : null}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ChattingCreate;
