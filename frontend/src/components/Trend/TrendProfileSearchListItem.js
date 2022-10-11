import './TrendProfileSearchListItem.css'
import { useNavigate } from "react-router-dom"
import { Avatar } from "@mui/material";
import 기본프로필 from "../../assets/기본프로필.png";
import ProfileAvatar from '../ProfileAvatar';

const TrendProfileSearchListItem = ({profile}) => {
  const navigate = useNavigate();
  const profileUserId = profile.userId
  
  const moveToProfile = () => {
    navigate(`/profile/${profileUserId}`)
  }

  return (
    <div className="trend-profile-result" onClick={moveToProfile} >
      <div style={{marginRight: '20px'}}>
        <ProfileAvatar w={45} h={45} imgUrl={profile.profileUrl}/>
      </div>
      <div>{profile.nickname}</div>
    </div>
  )
}
  
  export default TrendProfileSearchListItem;