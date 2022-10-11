package com.web.curation.model.feed;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.web.curation.model.user.FileInfo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Feed {

	private int feedId;
	private int userId;
	private String nickname;
	private String title;
	private String category;
	private String contents;
	private List<FileInfo> fileInfos; // feed file infos
	private String url; // title image url
	private String profileUrl; // profile image url
	private LocalDateTime uploadDate;
	@JsonIgnore
	private LocalDateTime editDate;
	private int likeCnt;
	private boolean isLiked;
	
}
