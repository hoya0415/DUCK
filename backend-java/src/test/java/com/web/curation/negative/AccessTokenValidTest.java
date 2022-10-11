package com.web.curation.negative;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.curation.model.chat.SendMessageRequest;
import com.web.curation.model.feed.FeedEditRequest;
import com.web.curation.model.user.ChangePassRequest;
import com.web.curation.model.user.SignupRequest;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(value = MethodOrderer.OrderAnnotation.class)
public class AccessTokenValidTest {
	
	@Autowired
	private MockMvc mockMvc;
	
	private static ObjectMapper oMapper = new ObjectMapper();

	Logger logger = LoggerFactory.getLogger(AccessTokenValidTest.class);
	
	private static String accessToken;
	
	private static HashMap<String, Object> input;
	
	private static FeedEditRequest fer;
	
	@BeforeAll
	public static void setup() throws Exception {
		SignupRequest sr = new SignupRequest();
		sr.setEmail("string");
		sr.setPassword("string");
		
		accessToken = "dummyToken";
		
		input = new HashMap<>();
		
		input.put("userId", 0);
		input.put("feedId", 0);
		input.put("commentId", 0);
		input.put("userNickname", "dummy");
		input.put("nickname", "dummy");
		
		fer = new FeedEditRequest();
		fer.setCategory("test");
		fer.setContents("testContents");
		fer.setTitle("testTitle");
	}
	
	@Test
	@Order(1)
	void profileTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/user/profile/edit")
			.header("accessToken", accessToken)
			.contentType("multipart/form-data"))
			.andExpect(content().string("{\"message\":\"fail\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(2)
	void passwordEditTokenCheckedTest() throws Exception {
		ChangePassRequest cpr = new ChangePassRequest();
		cpr.setAccessToken(accessToken);
		cpr.setOldPassword("");
		cpr.setNewPassword("newPassword");
		cpr.setType("edit");
		
		mockMvc.perform(MockMvcRequestBuilders.put("/user/password/edit")
			.header("Accept", "application/json")
			.contentType("application/json")
			.content((new JSONObject(oMapper.writeValueAsString(cpr)).toString())))
			.andExpect(content().string("fail"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(3)
	void getAlertListTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/user/alert/1")
			.header("accessToken", accessToken))
			.andExpect(content().string("{\"message\":\"fail\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(4)
	void FeedWriteTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/feed/write")
			.header("accessToken", accessToken)
			.contentType("multipart/form-data"))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(5)
	void feedLikeTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/feedLike")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(6)
	void feedLikeCancelTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/feedLikeCancel")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(7)
	void feedEditTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/edit")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(fer)).toString()))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(8)
	void feedListGetTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/feed/1")
			.header("accessToken", accessToken))
			.andExpect(content().string("{\"message\":\"fail\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(9)
	void commentWriteTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/feed/comment/write")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(10)
	void commentLikeTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/like")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(11)
	void commentLikeCancelTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/likeCancel")
			.header("accessToken", accessToken)
			.contentType("application/json").content(accessToken)
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(12)
	void commentEditTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/edit")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(13)
	void commentHideTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/hide")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content("1"))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(14)
	void commentHideCancelTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.put("/feed/comment/unhide")
				.header("accessToken", accessToken)
				.contentType("application/json")
				.content("1"))
		.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
		.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(15)
	void commentDeleteTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.delete("/feed/comment/delete/1")
			.header("accessToken", accessToken)
			.contentType("application/json"))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(16)
	void followAddTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/follow")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(content().string("{\"message\":\"token expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(17)
	void followDeleteTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.delete(
			"/follow/follower/1&&1")
			.header("accessToken", accessToken)
			.contentType("application/json"))
			.andExpect(content().string("{\"message\":\"token expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(18)
	void profileSearchTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/trend/profile/keyword=dummy&&loginId=1")
			.header("accessToken", accessToken))
			.andExpect(content().string("{\"message\":\"fail\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(19)
	void feedSearchTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/trend/feed/title/keyword=dummy&&loginId=1")
			.header("accessToken", accessToken))
			.andExpect(content().string("{\"message\":\"fail\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(20)
	void feedCategorySearchTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/trend/feed/category/keyword=dummy&&loginId=1")
			.header("accessToken", accessToken))
			.andExpect(content().string("{\"message\":\"fail\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(21)
	void likeTrendTokenCheckedTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/trend/like/1")
			.header("accessToken", accessToken))
			.andExpect(content().string("{\"message\":\"fail\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(22)
	void chatCreateTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/chat/create")
			.header("accessToken", accessToken)
			.contentType("multipart/form-data"))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(23)
	void chatSearchTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/chat/search/"+input.get("keyword"))
			.header("accessToken", accessToken))
			.andExpect(content().string("{\"message\":\"fail\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(24)
	void chatListGetTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/chat/list/all")
			.header("accessToken", accessToken))
			.andExpect(content().string("{\"message\":\"fail\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(25)
	void MessageWriteTest() throws Exception {
		SendMessageRequest smr = new SendMessageRequest();
		
		mockMvc.perform(
			MockMvcRequestBuilders.post("/chat/message/send")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(smr)).toString()))
			.andExpect(content().string("{\"message\":\"Authentication Expired\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(26)
	void MessageListGetTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/chat/message/list/1")
			.header("accessToken", accessToken))
			.andExpect(content().string("{\"message\":\"fail\"}"))
			.andDo(MockMvcResultHandlers.print());
	}
}
