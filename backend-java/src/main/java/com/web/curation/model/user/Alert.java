package com.web.curation.model.user;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Alert {
	@Id
	private int alertId;
	
	private String type; // comment: 댓글 작성, like: 피드 좋아요, follow: 팔로우 등록
	private int senderId;
	private String senderNickname;
	private int targetId;
	
	@JsonIgnore
	private int checked;
	
	private boolean checkedResult;
	
	private LocalDateTime alertDate;
	private int feedId;
	private int commentId;
	private String profileUrl;
	
	public Alert(String type, int senderId, String senderNickname, int targetId,
			LocalDateTime alertDate, int feedOrCommentId) {
		this.type = type; // comment, follow, feedLike, commentLike
		this.senderId = senderId;
		this.senderNickname = senderNickname;
		this.targetId = targetId;
		this.alertDate = alertDate;
		
		if(type.equals("feedLike") || type.equals("comment")) {
			this.feedId = feedOrCommentId; // type = follow나 commentLike일 경우 feedId는 0
		}
		else if(type.equals("commentLike")) {
			this.commentId = feedOrCommentId;
		}
	}
}
