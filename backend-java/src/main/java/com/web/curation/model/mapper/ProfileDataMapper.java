package com.web.curation.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.curation.model.feed.FeedList;
import com.web.curation.model.user.ProfileChangeRequest;

@Mapper
public interface ProfileDataMapper {
	public int getFeedCnt(int userId) throws Exception;
	public int getFollowerCnt(int toUserId) throws Exception;
	public int getFollowingCnt(int fromUserId) throws Exception;
	public int getLikeSum(int userId) throws Exception;
	public List<FeedList> getFeedList(int userId) throws Exception;
	public List<FeedList> getLikeFeedList(int userId) throws Exception;
	public int updateProfile(ProfileChangeRequest profileChange) throws Exception;
	public int profileFile(ProfileChangeRequest profileChange);
	public void deleteProfile(String email);
	public String getFileName(String email);
	public int getUserId(String email);
	public List<String> getCategoryList();
}
