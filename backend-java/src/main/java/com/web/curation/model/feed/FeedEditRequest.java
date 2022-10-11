package com.web.curation.model.feed;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FeedEditRequest {
	
	int feedId;
	String title;
	String category;
	String contents;
	
}
