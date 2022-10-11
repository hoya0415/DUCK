package com.web.curation.model.mapper;

import java.sql.SQLException;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.curation.model.feed.Feed;
import com.web.curation.model.user.Profile;

@Mapper
public interface TrendMapper {
	public List<Feed> searchFeedList(String keyword) throws SQLException;
	public List<Profile> searchProfileList(String keyword) throws SQLException;
	public List<Feed> searchLikeRanking() throws SQLException;
	public List<Feed> searchFeedListByCategory(String keyword) throws SQLException;
}
