import { useNavigate } from "react-router-dom";

const TrendFeedSearchListItem = ({feed}) => {
  
  const navigate = useNavigate()
  const feedId = feed.feedId

  const moveToDetail = () => {
    navigate(`/feed/detail/${feedId}`);
  }

  return (
    <div onClick={moveToDetail} style={{cursor:'pointer'}}>
      <div style={{margin:'15px 20px', textAlign:'start'}}>{feed.title}</div>
    </div>
  )
}

export default TrendFeedSearchListItem;