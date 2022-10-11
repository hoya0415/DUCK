package com.web.curation.service;

import java.util.List;

import com.web.curation.model.user.Follow;
import com.web.curation.model.user.FollowReturn;

public interface FollowService {
	void addFollow(Follow f) throws Exception;
	List<FollowReturn> getFollowingList(Follow f);
	List<FollowReturn> getFollowerList(Follow f);
	int deleteFollow(int fromUserId, int toUserId);
	int getIsFollowed(int fromUserId, int toUserId);
}
