import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CardMedia,
  Card,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedList } from '../../_action/feed_action';
import axios from 'axios';

const FeedUpdate = () => {
  const {
    luUserId,
    luAccessToken,
    fdFeedId,
    fdTitle,
    fdContents,
    category,
    fdImgs,
  } = useSelector((state) => ({
    luUserId: state.user.luUserId,
    luAccessToken: state.user.luAccessToken,
    fdFeedId: state.feed.fdFeedId,
    fdTitle: state.feed.fdTitle,
    fdContents: state.feed.fdContents,
    category: state.feed.fdCategory,
    fdImgs: state.feed.fdImgs,
  }));

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputTitle, setInputTitle] = useState(fdTitle);
  const [activeTitle, setActiveTitle] = useState(null);
  const [inputContents, setInputContents] = useState(fdContents);
  const [activeContents, setActiveContents] = useState(null);
  const [inputCategory, setInputCategory] = useState(category);
  const [activeCategory, setActiveCategory] = useState(null);

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
    if (category === '') {
      setActiveCategory(false);
    } else {
      setActiveCategory(true);
    }
  };

  useEffect(() => {
    isCategory(inputCategory);
    isTitle(inputTitle);
  });
  // 피드 수정
  const onEditFeed = () => {
    axios({
      method: 'put',
      url: `http://3.35.207.243:9999/duck/feed/edit`,
      data: {
        feedId: fdFeedId,
        title: inputTitle,
        category: inputCategory,
        contents: inputContents,
      },
      headers: { accessToken: luAccessToken },
    }).then((res) => {
      dispatch(getFeedList(luUserId, luAccessToken));
    });
    navigate(`/feed/detail/${fdFeedId}`);
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
          <h4 onClick={onEditFeed} className='complete-button'>
            완료
          </h4>
        ) : null}
      </div>
      <div className='white-back feed-update-back'>
        <div id='img-add-container'>
          {fdImgs?.map((item) => (
            <div id='img-add-list'>
              <Card sx={{ width: 120, height: 120 }} id='img-add-card'>
                <CardMedia component='img' image={item} />
              </Card>
            </div>
          ))}
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
                  autoFocus
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
        <span className='err-msg text-secondary '>이미지는 변경할 수 없습니다.</span>
      </div>
    </div>
  );
};

export default FeedUpdate;
