package com.web.curation.model.mapper;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.web.curation.model.feed.Comment;

@Mapper
public interface CommentMapper {
	
	public List<Comment> getCommentList(int feedId) throws SQLException;
	
	public int commentWrite(@Param("feedId") int feedId,
			@Param("userId") int userId,
			@Param("nickname") String nickname,
			@Param("contents") String contents,
			@Param("createDate") LocalDateTime createDate) throws SQLException;
	
	public int commentEdit(@Param("commentId") int commentId,
			@Param("contents") String contents,
			@Param("editDate") LocalDateTime editDate) throws SQLException;
	
	public int commentDelete(int commentId) throws Exception;
	public int commentHide(int commentId) throws Exception;
	public int commentLike(int commentId) throws Exception;
	
	public int commentLikeTableInsert(@Param("commentId") int commentId,
			@Param("userId") int userId,
			@Param("likeDate") LocalDateTime likeDate) throws Exception;
	
	public int isLikeCheck(@Param("commentId") int commentId,
			@Param("userId") int userId) throws Exception;
	
	public int getUserId(int commentId) throws Exception;
	
	public int cancelCommentLike(@Param("commentId") int commentId,
			@Param("userId") int userId);
	public int likeCntDecrease(int commentId);

	public int commentUnhide(int commentId);
	
}
