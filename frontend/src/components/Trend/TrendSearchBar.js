import { useState, useEffect } from 'react';
import axios from 'axios';
import {InsertCommentRounded, Search} from '@mui/icons-material';
import './TrendSearchBar.css'
import { InputAdornment, Box, TextField, Divider, getListItemSecondaryActionClassesUtilityClass } from '@mui/material';
import { useSelector } from "react-redux";
import TrendFeedSearchList from '../Trend/TrendFeedSearchList';
import TrendProfileSearchList from './TrendProfileSearchList';
import TrendSearchResult from './TrendSearchResult';

const TrendSearchBar = ({ searching }) => {
  const [searchInput, setSearchInput] = useState('');
  const loggedUserId = useSelector((state) => state.user.luUserId);
  const accessToken = useSelector((state) => state.user.luAccessToken);
  const [feedResultList, setFeedResultList] = useState([]) 
  const [profileResultList, setProfileResultList] = useState([])
  const [isEnter, setIsEnter] = useState(false)
  const [mode, setMode] = useState(0)

  const TREND_URL = 'http://3.35.207.243:9999/duck/trend'

  const showResult = (event) => {
    if (event.code === 'Enter') {
      setIsEnter(true)
    }
  }

  const inputChange = () => {
    axios({
      method:'get',
      url: `${TREND_URL}/feed/title/keyword=${searchInput}&&loginId=${loggedUserId}`,
      headers: {
        accessToken: accessToken
      }
    })
    .then((res) => {
      if (res.status === 202) {
        setFeedResultList(res.data.feedList)
      } else {
        console.log(`err code: ${res.status}`)
      }
    })
    axios({
      method:'get',
      url: `${TREND_URL}/profile/keyword=${searchInput}&&loginId=${loggedUserId}`,
      headers: {
        accessToken: accessToken
      }
    })
    .then((res) => {
      if (res.status === 202) {
        setProfileResultList(res.data.profileList)
      } else {
        console.log(`err code: ${res.status}`)
      }
    })
  }

  useEffect(() => {
    if (searchInput) {
      inputChange()
      searching(true)
      if (isEnter) {
        setIsEnter(false)
      }
    } else {
      searching(false)
    }
  }, [searchInput])

  return (
    <div style={{margin:'25px auto', width:'400px'}}>
      <Box>
        <TextField
          onChange={event => setSearchInput(event.target.value)}
          className='trend-search-box'
          onKeyPress={showResult}
          placeholder='유저 & 게시물 검색'
          label='Search'
          variant='outlined'
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search id="search-icon"/>
              </InputAdornment>
            ),
          }} />
      </Box>
      {searchInput !== '' ? 
        (isEnter ? 
          <TrendSearchResult feedResults={feedResultList} profileResults={profileResultList} searchInput={searchInput} /> :
          <Box className='trend-search-container'>
            <div>
              <TrendFeedSearchList results={feedResultList} />
              <Divider variant="middle" className="trend-result-divider" />
              <TrendProfileSearchList results={profileResultList} />
            </div>
          </Box>
        )
        :
        <div></div>
      }
      
    </div>
  )
}

export default TrendSearchBar