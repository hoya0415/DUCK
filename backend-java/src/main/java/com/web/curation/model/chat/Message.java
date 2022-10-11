package com.web.curation.model.chat;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Message {
	
	int messageId;
	int chatId;
	int userId;
	String nickname;
	String contents;
	String profileUrl;
	LocalDateTime sendTime;

}
