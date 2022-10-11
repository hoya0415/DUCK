package com.web.curation.model.chat;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatCreateRequest {
	
	int userId;
	String chatTitle;
	String chatContents;
	String videoUrl;
	
}
