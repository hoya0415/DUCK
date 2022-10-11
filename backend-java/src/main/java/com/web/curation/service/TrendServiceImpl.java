package com.web.curation.service;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.curation.model.feed.Feed;
import com.web.curation.model.mapper.TrendMapper;
import com.web.curation.model.user.Profile;

@Service
public class TrendServiceImpl implements TrendService {
	
	@Autowired
	private TrendMapper tMapper;

	@Override
	public List<Feed> searchFeedList(String keyword) throws SQLException {
		return tMapper.searchFeedList(keyword);
	}

	@Override
	public List<Profile> searchProfileList(String keyword) throws SQLException {
		return tMapper.searchProfileList(keyword);
	}

	@Override
	public List<Feed> searchLikeRanking() throws SQLException {
		return tMapper.searchLikeRanking();
	}

	@Override
	public List<Feed> searchFeedListByCategory(String keyword) throws SQLException {
		return tMapper.searchFeedListByCategory(keyword);
	}

}
