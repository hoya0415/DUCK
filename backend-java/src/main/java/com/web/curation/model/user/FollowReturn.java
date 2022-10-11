package com.web.curation.model.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FollowReturn {
	@Id
	@Column(name = "follow_id")
    private String followId;
	private int userId;
	private String nickname;
	private String profileUrl;
	private boolean isFollowed;
	
}
