import './TrendSearchResult.css'
import { useState } from 'react';
import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TrendFeedResult from './TrendFeedResult';
import TrendProfileResult from './TrendProfileResult';


const TrendSearchResult = ({ feedResults, profileResults, searchInput }) => {
  const [value, setValue] = useState('1');
  const [mouseState, setMouseState] = useState(false)
  const order = ['최신순', '좋아요순']

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="trend-result-container">
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box>
            <TabList onChange={handleChange} aria-label="trend result">
              <Tab label="게시물" value="1" style={{fontSize:'15px'}} />
              <Tab label="프로필" value="2" style={{fontSize:'15px'}} />
            </TabList>
          </Box>
          <TabPanel className="trend-result-tab" value="1">
            {feedResults.length !== 0 ? 
              <div>
                {feedResults.map((ele, idx) => 
                <div>
                  <TrendFeedResult feed={ele} idx={idx} key={idx} /> 
                </div>
                )}
              </div>
               :
              <div>"{searchInput}" 에 관련된 게시물이 없습니다.</div>
            }
            <div className='trend-css-baseline'></div>
          </TabPanel>
          <TabPanel className="trend-result-tab" value="2">
            {profileResults.length !== 0 ?
              profileResults.map((ele, idx) => <TrendProfileResult profile={ele} key={idx} />) :
              <div>"{searchInput}" 와 일치하는 프로필이 없습니다.</div>
            }
            <div className='trend-css-baseline'></div>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  )
}

export default TrendSearchResult