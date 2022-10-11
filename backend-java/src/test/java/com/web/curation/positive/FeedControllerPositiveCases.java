package com.web.curation.positive;

import java.io.FileInputStream;
import java.util.HashMap;

import org.json.JSONObject;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.curation.model.feed.FeedEditRequest;
import com.web.curation.model.user.SignupRequest;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(value = MethodOrderer.OrderAnnotation.class)
public class FeedControllerPositiveCases {
	
	@Autowired
	private MockMvc mockMvc;
	
	private static ObjectMapper oMapper = new ObjectMapper();

	Logger logger = LoggerFactory.getLogger(FeedControllerPositiveCases.class);
	
	private static String accessToken;
	
	private static JSONObject sRequests;
	
	private static MockMultipartFile[] mFile = new MockMultipartFile[10];
	
	private static HashMap<String, Object> input;
	
	private static FeedEditRequest fer;
	
	@BeforeAll
	public static void setup() throws Exception {
		String name = "file";
		String originalFileName = "test.jpg";
		String fileFullPath = "D:\\SSAFY\\work_SSAFY\\공통PJT\\S06P12D202\\backend-java\\test.jpg";
		
		mFile[0] = new MockMultipartFile(name, originalFileName, "image/jpg", new FileInputStream(fileFullPath));
		
		SignupRequest sr = new SignupRequest();
		sr.setEmail("string");
		sr.setPassword("string");
		
		sRequests = new JSONObject(oMapper.writeValueAsString(sr));
		
		input = new HashMap<>();
		input.put("contents", "testComment");
		
		fer = new FeedEditRequest();
		fer.setCategory("test");
		fer.setContents("testContents");
		fer.setTitle("testTitle");
	}
	
	@Test
	@Order(1)
	void loginTest() throws Exception {
		ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/user/login")
			.header("Accept", "application/json")
			.contentType("application/json")
			.content(sRequests.toString()))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
		
		accessToken = new JSONObject(result.andReturn().getResponse().getContentAsString()).getString("accessToken");
		String userNickname = new JSONObject(result.andReturn().getResponse().getContentAsString()).getString("nickname");
		int userId = new JSONObject(result.andReturn().getResponse().getContentAsString()).getInt("userId");

		input.put("userId", userId);
		input.put("userNickname", userNickname);
		input.put("nickname", userNickname);
	}
	
	@Test
	@Order(2)
	void feedWriteTest() throws Exception {
		ResultActions result = mockMvc.perform(MockMvcRequestBuilders.multipart("/feed/write")
			.file(mFile[0])
			.file(mFile[0])
			.file(mFile[0])
			.file(mFile[0])
			.file(mFile[0])
			.file(mFile[0])
			.file(mFile[0])
			.file(mFile[0])
			.file(mFile[0])
			.file(mFile[0])
			.header("accessToken", accessToken)
			.param("category", "tmp")
			.param("contents", "testContents")
			.param("title", "testTitle")
			.param("userId", ""+input.get("userId"))
			.contentType("multipart/form-data"))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
		
		JSONObject tmp = new JSONObject(result.andReturn().getResponse().getContentAsString());
		tmp = tmp.getJSONArray("feedList").getJSONObject(0);
		
		int feedId = tmp.getInt("feedId");
		
		fer.setFeedId(feedId);
		input.put("feedId", feedId);
	}
	
	@Test
	@Order(3)
	void feedLikeTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/feedLike")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(4)
	void feedEditTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/edit")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(fer)).toString()))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(5)
	void feedDetailGetTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
				"/feed/detail/feedId="+input.get("feedId")+"&&userId="+input.get("userId")))
				.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
				.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(6)
	void feedListGetTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/feed/"+input.get("userId"))
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(7)
	void feedLikeCancelTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/feedLikeCancel")
			.header("accessToken", accessToken)
			.contentType("application/json").content(accessToken)
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(8)
	void categoryListGetTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/feed/categoryList"))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(9)
	void commentWriteTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/feed/comment/write")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(10)
	void commentListGetTest() throws Exception {
		ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get(
			"/feed/comment/feedId="+input.get("feedId")+"&&userId="+input.get("userId"))
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
		
		JSONObject tmp = new JSONObject(result.andReturn().getResponse().getContentAsString());
		tmp = tmp.getJSONArray("commentList").getJSONObject(0);
		
		Integer commentId = tmp.getInt("commentId");
		
		input.put("commentId", commentId);
	}
	
	@Test
	@Order(11)
	void commentLikeTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/like")
				.header("accessToken", accessToken)
				.contentType("application/json")
				.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
		.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
		.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(11)
	void commentLikeTrySecondTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/like")
				.header("accessToken", accessToken)
				.contentType("application/json")
				.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
		.andExpect(MockMvcResultMatchers.status().isForbidden())
		.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(12)
	void commentEditTest() throws Exception {
		input.replace("contents", "testEditComment");
		
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/edit")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(13)
	void commentHideTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/hide")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(""+input.get("commentId")))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(14)
	void commentHiddenAndLikeCheckTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/feed/comment/feedId="+input.get("feedId")+"&&userId="+input.get("userId"))
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}

	@Test
	@Order(15)
	void commentLikeCancelTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/likeCancel")
			.header("accessToken", accessToken)
			.contentType("application/json").content(accessToken)
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(16)
	void commentHideCancelTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/unhide")
				.header("accessToken", accessToken)
				.contentType("application/json")
				.content(""+input.get("commentId")))
		.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
		.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(18)
	void commentDeleteTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.delete("/feed/comment/delete/"+input.get("commentId"))
			.header("accessToken", accessToken)
			.contentType("application/json"))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(19)
	void feedDeleteTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.delete("/feed/delete/"+input.get("feedId"))
			.header("Accept", "application/json")
			.contentType("application/json"))
			.andExpect(MockMvcResultMatchers.status().isOk())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(20)
	void feedDetailLikeCheckFalseTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
				"/feed/detail/feedId=79&&userId="+input.get("userId")))
				.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
				.andDo(MockMvcResultHandlers.print());
	}
}