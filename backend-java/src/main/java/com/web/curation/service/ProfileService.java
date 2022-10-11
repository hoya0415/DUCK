package com.web.curation.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.web.curation.model.feed.FeedList;
import com.web.curation.model.user.ProfileChangeRequest;

public interface ProfileService {
	public int getFeedCnt(int userId) throws Exception;
	public int getFollowerCnt(int toUserId) throws Exception;
	public int getFollowingCnt(int fromUserId) throws Exception;
	public int getLikeSum(int userId) throws Exception;
	public List<FeedList> getFeedList(int userId) throws Exception;
	public List<FeedList> getLikeFeedList(int userId) throws Exception;
	public String updateProfile(ProfileChangeRequest profileChange, MultipartFile file) throws Exception;
	public int getUserId(String email);
	public List<String> getCategoryList() throws Exception;
}
