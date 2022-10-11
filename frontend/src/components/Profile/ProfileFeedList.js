import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from "react-router-dom";

const ProfileFeedList = ({item}) => {
  const navigate = useNavigate();
  const moveToDetail = (id) => {
    navigate(`/feed/detail/${id}`);
  };

  return (
    <div>
      <div>
        <Card sx={{ width: 150, height: 150 }} id='profile-feed-list-card'>
          <CardMedia
          onClick={() => moveToDetail(item.feedId)}
          component='img'
          width='150'
          height='150'
          image={item.url || 'https://ww.namu.la/s/face0a745016a7ed1514a9a0c46644cb15198b5f8dc7b1228fd827babe41176963ec36c129e51093afd017e5901ae9d9ac1dc9d68d394e1280513eff0730689f05b6e15f29f7ec962b7b11517e87e1581cfa8cde59b369402d27e9611dd56275'}
          />
        </Card>
      </div>
    </div>
  );
};

export default ProfileFeedList;
