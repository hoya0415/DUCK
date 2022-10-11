package com.web.curation.service;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.curation.model.feed.Comment;
import com.web.curation.model.mapper.CommentMapper;

@Service
public class CommentServiceImpl implements CommentService {
	
	@Autowired
	private CommentMapper cMapper;

	@Override
	public List<Comment> getCommentList(int feedId) throws SQLException {
		List<Comment> list = cMapper.getCommentList(feedId);
		
		if(list.isEmpty()) {
			throw new SQLException();
		}
		
		return list;
	}

	@Override
	public int commentWrite(int feedId, int userId, String nickname, String contents, LocalDateTime createDate) throws SQLException {
		return cMapper.commentWrite(feedId, userId, nickname, contents, createDate);
	}

	@Override
	public int commentEdit(int commentId, String contents, LocalDateTime editDate) throws SQLException {
		return cMapper.commentEdit(commentId, contents, editDate);
	}

	@Override
	public int commentDelete(int commentId) throws Exception {
		return cMapper.commentDelete(commentId);
	}

	@Override
	public int commentHide(int commentId) throws Exception {
		return cMapper.commentHide(commentId);
	}

	@Override
	public int commentLike(int commentId) throws Exception {
		return cMapper.commentLike(commentId);
	}

	@Override
	public int commentLikeTableInsert(int commentId, int userId, LocalDateTime likeDate) throws Exception {
		return cMapper.commentLikeTableInsert(commentId, userId, likeDate);
	}

	@Override
	public int isLikeCheck(int commentId, int userId) throws Exception {
		return cMapper.isLikeCheck(commentId, userId);
	}

	@Override
	public int getUserId(int commentId) throws Exception {
		return cMapper.getUserId(commentId);
	}

	@Override
	public int cancelCommentLike(int commentId, int userId) {
		return cMapper.cancelCommentLike(commentId, userId);
	}

	@Override
	public int likeCntDecrease(int commentId) {
		return cMapper.likeCntDecrease(commentId);
	}

	@Override
	public int commentUnhide(int commentId) {
		return cMapper.commentUnhide(commentId);
	}

}
