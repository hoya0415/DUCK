package com.web.curation.model.feed;

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
public class Comment {
	@Id
	private int commentId;
	private int userId;
	private String contents;
	private boolean isHiddenResult;
	private LocalDateTime createDate;
	private LocalDateTime editDate;
	private int commentLikeCnt;
	private String profileUrl;
	private String nickname;
	@JsonIgnore
	private int isHidden;
	private boolean isLiked;
	
}
