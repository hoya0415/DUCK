package com.web.curation.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.web.curation.model.feed.Feed;

public interface FeedService {

	boolean write(Feed feed, MultipartFile[] multipartFile) throws IOException;
	boolean edit(Feed feed);
	boolean delete(int feedId);
	boolean like(int feedId);
	List<Feed> list(int userId) throws Exception;
	Feed detail(int feedId);
	public int isLikeCheck(int feedId, int userId);
	public int feedLikeInput(int feedId, int userId, LocalDateTime likeDate);
	public int cancelFeedLike(int feedId, int userId);
	public int likeCntDecrease(int feedId);
	List<String> detailUrl(int feedId);
	public int getUserId(int feedId) throws Exception;

}
