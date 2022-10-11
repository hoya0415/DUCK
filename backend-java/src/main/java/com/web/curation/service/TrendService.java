package com.web.curation.service;

import java.sql.SQLException;
import java.util.List;

import com.web.curation.model.feed.Feed;
import com.web.curation.model.user.Profile;

public interface TrendService {
	public List<Feed> searchFeedList(String keyword) throws SQLException;
	public List<Profile> searchProfileList(String keyword) throws SQLException;
	public List<Feed> searchLikeRanking() throws SQLException;
	public List<Feed> searchFeedListByCategory(String keyword) throws SQLException;
}
