package com.web.curation.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.web.curation.model.user.Follow;
import com.web.curation.model.user.FollowReturn;

@Mapper
public interface FollowMapper {
	void addFollow(Follow f) throws Exception;
	List<FollowReturn> getFollowingList(Follow f);
	List<FollowReturn> getFollowerList(Follow f);
	int deleteFollow(@Param("fromUserId") int fromUserId,
			@Param("toUserId") int toUserId);
	int getIsFollowed(@Param("fromUserId") int fromUserId,
			@Param("toUserId") int toUserId);
}
