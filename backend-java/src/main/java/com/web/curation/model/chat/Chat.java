package com.web.curation.model.chat;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.web.curation.model.user.FileInfo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Chat {
	
	int chatId;
	int userId;
	String chatTitle;
	String chatContents;
	FileInfo fileInfo;
	LocalDateTime createDate;
	String thumbUrl;
	String profileUrl;
	String userNickname;
	String videoUrl;
	
}
