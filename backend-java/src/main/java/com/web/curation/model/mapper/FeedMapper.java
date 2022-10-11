package com.web.curation.model.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.web.curation.model.feed.Feed;

@Mapper
public interface FeedMapper {

	boolean write(Feed feed);
	boolean edit(Feed feed);
	boolean delete(int feedId);
	boolean like(int feedId);
	List<Feed> list(int userId);
	Feed detail(int feedId);
	public int isLikeCheck(@Param("feedId") int feedId,
			@Param("userId") int userId);
	public int feedLikeInput(@Param("feedId") int feedId,
			@Param("userId") int userId,
			@Param("likeDate") LocalDateTime likeDate);
	
	public int cancelFeedLike(@Param("feedId") int feedId,
			@Param("userId") int userId);
	public int likeCntDecrease(int feedId);
	
	boolean writeFile(Feed feed);
	List<String> detailUrl(int feedId);
	
	public int getUserId(int feedId) throws Exception;
	boolean deleteFeedFile(int feedId);
	List<String> getFileNames(int feedId);
	
}
