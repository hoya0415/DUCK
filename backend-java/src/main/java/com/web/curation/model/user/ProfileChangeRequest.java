package com.web.curation.model.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProfileChangeRequest {
	@JsonIgnore
	private String email;
	private String nickname;
	private String bio;
	private String url;
	private String fileName;
}
