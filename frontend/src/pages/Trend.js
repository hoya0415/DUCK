import { useState } from 'react';
import './Trend.css';
import TrendLikeList from '../components/Trend/TrendLikeList';
import TrendSearchBar from '../components/Trend/TrendSearchBar';

const Trend = () => {
  const [isSearch, setIsSearch] = useState(false);

  const searching = (data) => {
    setIsSearch(data);
  };

  return (
    <div>
      <TrendSearchBar searching={searching} />
      {isSearch ? (
        <div></div>
      ) : (
        <div>
          <TrendLikeList />
        </div>
      )}
      <div className='trend-css-baseline'></div>
    </div>
  );
};

export default Trend;
