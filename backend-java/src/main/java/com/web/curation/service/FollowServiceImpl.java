package com.web.curation.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.curation.model.mapper.FollowMapper;
import com.web.curation.model.user.Follow;
import com.web.curation.model.user.FollowReturn;

@Service
public class FollowServiceImpl implements FollowService {
	
	@Autowired
	private FollowMapper fMapper;

	@Override
	public void addFollow(Follow f) throws Exception {
		fMapper.addFollow(f);
	}
	
	@Override
	public List<FollowReturn> getFollowingList(Follow f) {
		return fMapper.getFollowingList(f);
	}

	@Override
	public List<FollowReturn> getFollowerList(Follow f) {
		return fMapper.getFollowerList(f);
	}

	@Override
	public int deleteFollow(int fromUserId, int toUserId) {
		return fMapper.deleteFollow(fromUserId, toUserId);
	}

	@Override
	public int getIsFollowed(int fromUserId, int toUserId) {
		return fMapper.getIsFollowed(fromUserId, toUserId);
	}
}
