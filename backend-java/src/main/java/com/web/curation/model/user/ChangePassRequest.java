package com.web.curation.model.user;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChangePassRequest {

	private String accessToken;
	private String type;
	private String email;
	private String oldPassword;
	private String newPassword;
	
}
