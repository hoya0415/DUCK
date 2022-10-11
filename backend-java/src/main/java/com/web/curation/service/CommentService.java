package com.web.curation.service;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

import com.web.curation.model.feed.Comment;

public interface CommentService {

	public List<Comment> getCommentList(int feedId) throws SQLException;
	public int commentWrite(int feedId, int userId, String nickname, String contents, LocalDateTime createDate) throws SQLException;
	public int commentEdit(int commentId, String contents, LocalDateTime editDate) throws SQLException;
	public int commentDelete(int commentId) throws Exception;
	public int commentHide(int commentId) throws Exception;
	public int commentLike(int commentId) throws Exception;
	public int commentLikeTableInsert(int commentId, int userId, LocalDateTime likeDate) throws Exception;
	public int isLikeCheck(int commentId, int userId) throws Exception;
	public int getUserId(int commentId) throws Exception;
	public int cancelCommentLike(int commentId, int userId);
	public int likeCntDecrease(int commentId);
	public int commentUnhide(int commentId);
	
}
