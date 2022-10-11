package com.web.curation.model.user;

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
public class Profile {
	@Id
	private int userId;
	private int profileImageId;
	private String nickname;
	private String bio;
	private boolean isFollowed;
	private String profileUrl;
}
