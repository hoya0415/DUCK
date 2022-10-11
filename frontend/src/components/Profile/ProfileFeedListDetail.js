import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Badge, Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import floatDuck from "../../assets/흘러가는오리-1.gif";
import { Favorite, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ProfileSideBar from "./ProfileSideBar";
import ProfileAvatar from "../ProfileAvatar";


export default function QuiltedImageList() {
  const navigate = useNavigate();
  const { puImg, feedList, likeSum } = useSelector((state) => ({
    puImg: state.user.profileUrl,
    feedList: state.user.puFeedList,
    likeSum: state.user.puLikeSum,
  }));

  const [sideBar, setSideBar] = useState(true);

  const moveToDetail = (id) => {
      navigate(`/feed/detail/${id}`);
  };

  return (
    <div className="grade-back">
      <div className="top-fld">
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBack fontSize="large" className="top-bar-button" />
        </Button>
        {sideBar && <ProfileSideBar />}
      </div>
      <div className="profile-fld">
        <img
          className="float-duck-img-pro-1"
          src={floatDuck}
          alt="흘러가는 오리"
        />
        <img
          className="float-duck-img-pro-2"
          src={floatDuck}
          alt="흘러가는 오리"
        />
        <div className="pofile-img-fld">
          <Badge
            badgeContent={likeSum}
            overlap="circular"
            id="like-sum-badge"
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              badgeContent={
                <Favorite color="error" fontSize="large"></Favorite>
              }
            >
              <ProfileAvatar w={140} h={140} imgUrl={puImg} />
            </Badge>
          </Badge>
        </div>
      </div>
      <div className="white-back feed-update-back">
        <p className="list-name-profile">게시물</p>
        <div style={{overflow:'scroll'}}>
          <ImageList
            variant="woven"
            cols={4}
            gap={8}
          >
            {feedList.map((item, idx) => (
              <ImageListItem
                key={item.url}
                cols={item.cols || 1}
                rows={item.rows || 1}
              >
                <img
                  src={`${item.url}?w=161&fit=crop&auto=format`}
                  srcSet={`${item.url}?w=161&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading="lazy"
                  onClick={() => moveToDetail(item.feedId)}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
    </div>
  );
}
