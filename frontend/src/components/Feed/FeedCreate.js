import {
  Badge,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CardMedia,
  Card,
  IconButton,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  AddPhotoAlternateRounded,
  ClearRounded,
} from '@mui/icons-material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { createFeed, getFeedList } from '../../_action/feed_action';

const items = [{ feedId: 1 }, { feedId: 2 }, { feedId: 3 }];

const FeedCreate = () => {
  const { luUserId, luAccessToken, feedList, initFeedList } = useSelector(
    (state) => ({
      luUserId: state.user.luUserId,
      luAccessToken: state.user.luAccessToken,
      feedList: state.feed.feedList,
      initFeedList: state.feed.feedList,
    })
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputImg, setInputImg] = useState([]);
  const [previewList, setPreviewList] = useState([]);
  const [inputTitle, setInputTitle] = useState('');
  const [activeTitle, setActiveTitle] = useState(null);
  const [inputContents, setInputContents] = useState('');
  const [activeContents, setActiveContents] = useState(null);
  const [inputCategory, setInputCategory] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  // 이미지

  const inputContentsList = [];
  const onImgInput = (e) => {
    for (let i = 0; i < e.target.files.length; i += 1) {
      setInputImg((prevItem) => [...prevItem, e.target.files[i]]);
      setPreviewList((prevItem) => [
        ...prevItem,
        URL.createObjectURL(e.target.files[i]),
      ]);
    }
  };

  const deleteFileImage = (event) => {
    URL.revokeObjectURL(previewList[event]);
    setPreviewList((prevItem) =>
      prevItem.filter((item, index) => index !== event)
    );
    setInputImg((prevItem) =>
      prevItem.filter((item, index) => index !== event)
    );
  };

  // 제목
  const onTitleChange = (event) => {
    setInputTitle(event.target.value);
    isTitle(event.target.value);
  };

  const isTitle = (title) => {
    const textRegex = /^.{1,30}$/;
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
    if (500 < contents.length) {
      setActiveContents(false);
    } else {
      setActiveContents(true);
    }
  };

  // 카테고리
  const onCategoryChange = (event) => {
    setInputCategory(event.target.value);
    isCategory(event.target.value);
  };

  const isCategory = (category) => {
    if (category == '') {
      setActiveCategory(false);
    } else {
      setActiveCategory(true);
    }
  };

  // 피드 생성
  // 피드로 넘어갔을 때 바로바로 렌더링 되려면.. 3중디스패치 불가피..
  const onCreateFeed = () => {
    const formData = new FormData();
    formData.append('userId', luUserId);
    formData.append('title', inputTitle);
    formData.append('category', inputCategory);
    formData.append('contents', inputContents);
    inputImg.forEach((file) => formData.append('file', file));
    dispatch(createFeed(formData, luAccessToken)).then((res) => {
      dispatch(getFeedList(luUserId, luAccessToken));
    });

    navigate(`/feed`);
  };

  const categories = [
    '굿즈',
    'd-log',
    '앨범꾸미기',
    '덕친소',
    '슬덕생',
    '포카',
    '티켓',
    '판매',
    '구매',
    '교환',
    '예절',
    '맛집',
  ];
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
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
        {activeCategory && activeTitle ? (
          <h4 onClick={onCreateFeed} className='complete-button'>
            완료
          </h4>
        ) : null}
      </div>
      <div className='white-back feed-update-back'>
        <Box
          component='form'
          sx={{
            '& .MuiTextField-root': { m: 1, width: '30ch' },
          }}
          noValidate
          autoComplete='off'
        >
          <div className='account-fld'>
            {/* 이미지 필드 */}
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              badgeContent={
                previewList ? (
                  <div
                    className='FileInput-clear-button'
                    onClick={() => deleteFileImage(0)}
                  >
                    <ClearRounded
                      fontSize='large'
                      id='delete-photo-icon'
                    ></ClearRounded>
                  </div>
                ) : null
              }
            >
              <div className='img-input-fld'>
                {previewList?.length ? (
                  <img className='feed-input-img' src={previewList[0]}></img>
                ) : (
                  <div className='feed-input-none'>
                    <input
                      type='file'
                      className='FileInput-hidden-overlay'
                      id='test111'
                      onChange={onImgInput}
                      accept='image/*'
                      multiple='multiple'
                    />
                    <AddPhotoAlternateRounded className='add-photo-icon' />
                  </div>
                )}
              </div>
            </Badge>

            {previewList?.length > 0 ? (
              <div id='img-add-container'>
                {previewList.slice(1, previewList.length)?.map((url, index) => (
                  <div id='img-add-list' key={url} url={url}>
                    <Card sx={{ width: 120, height: 120 }} id='img-add-card'>
                      <CardMedia component='img' image={url} />
                    </Card>
                    <div
                      id='img-add-delete'
                      onClick={() => deleteFileImage(index + 1)}
                    >
                      <ClearRounded
                        fontSize='small'
                        id='delete-photo-icon'
                      ></ClearRounded>
                    </div>
                  </div>
                ))}
                {previewList.length !== 10 ? (
                  <div>
                    <Card sx={{ width: 120, height: 120 }} id='img-add'>
                      <IconButton aria-label='next' className='feed-input-none'>
                        <input
                          type='file'
                          className='FileInput-hidden-overlay'
                          onChange={onImgInput}
                          accept='image/*'
                          multiple='multiple'
                        />
                        <AddPhotoAlternateRounded className='add-photo-icon' />
                      </IconButton>
                    </Card>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className='input-fld'>
              {/* 카테고리 필드 */}
              <FormControl sx={{ m: 1 }}>
                <InputLabel id='input-category-label'>카테고리</InputLabel>
                <Select
                  id='input-category'
                  value={inputCategory}
                  onChange={onCategoryChange}
                  MenuProps={MenuProps}
                  label='카테고리'
                >
                  <MenuItem value=''>
                    <em>선택해!</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className='text-input'>
                {/* 제목 필드 */}
                <TextField
                  id='input-title'
                  label='제목'
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
                  label='내용'
                  rows={8}
                  value={inputContents || ''}
                  multiline
                  onChange={onContentsChange}
                  className='input-form'
                />
              </div>
              {activeContents === false ? (
                <span className='err-msg w-100 px-3'>
                  500글자 이하로 입력해주세요.
                </span>
              ) : null}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default FeedCreate;
