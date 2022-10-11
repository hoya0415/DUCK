import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategorySearch } from '../../_action/trend_action';
import { Button } from 'react-bootstrap';
import {ArrowBack} from '@mui/icons-material';
import TrendCategorySearchItem from './TrendCategorySearchItem';
import './TrendCategorySearch.css'

const TrendCategorySearch = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const accessToken = useSelector((state) => state.user.luAccessToken);
  const loggedUserId = useSelector((state) => state.user.luUserId);
  const csFeedList = useSelector((state) => state.trend.csFeedList);


  useEffect(() => {
    dispatch(getCategorySearch(accessToken,params.category,loggedUserId))
  }, [params.category, dispatch]);

  const sortCsFeedList = csFeedList?.sort((a,b) => b['likeCnt'] - a['likeCnt'])
  

  return (
    <div className="grade-back">
      <div className='top-fld'>
        <Button
          variant='link'
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBack fontSize='large' className='top-bar-button' />
        </Button>
          
      </div>
      <div className='cs-white-back'>
      <div id="cs-tag">#{params.category}</div>
      {sortCsFeedList?.map((item) =>
         <TrendCategorySearchItem key={item.feedId} item={item}/>
      )}
      </div>
    </div>
  )
}

export default TrendCategorySearch;