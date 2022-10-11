package com.web.curation.negative;

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
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.curation.model.user.SignupRequest;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(value = MethodOrderer.OrderAnnotation.class)
public class FollowControllerNegativeCases {

	@Autowired
	private MockMvc mockMvc;
	
	private static ObjectMapper oMapper = new ObjectMapper();

	Logger logger = LoggerFactory.getLogger(FollowControllerNegativeCases.class);
	
	private static String accessToken;
	
	private static JSONObject sRequests;
	
	private static HashMap<String, Object> input;
	
	@BeforeAll
	public static void setup() throws Exception {
		SignupRequest sr = new SignupRequest();
		sr.setEmail("string");
		sr.setPassword("string");
		
		sRequests = new JSONObject(oMapper.writeValueAsString(sr));
		
		input = new HashMap<>();
		input.put("toUserId", -1);
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

		input.put("fromUserId", userId);
		input.put("userNickname", userNickname);
		input.put("nickname", userNickname);
	}
	
	@Test
	@Order(2)
	void followAddFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/follow")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(input)).toString()))
			.andExpect(MockMvcResultMatchers.status().isInternalServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(3)
	void followerListGetFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/follow/follower/targetId="+input.get("toUserId")+"&&loginId="+input.get("toUserId")))
			.andExpect(MockMvcResultMatchers.status().isInternalServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(4)
	void followingListGetFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/follow/following/targetId=-1&&loginId=-1"))
			.andExpect(MockMvcResultMatchers.status().isInternalServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(5)
	void followDeleteFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.delete(
			"/follow/follower/"+input.get("fromUserId")+"&&"+input.get("toUserId"))
			.header("accessToken", accessToken)
			.contentType("application/json"))
			.andExpect(MockMvcResultMatchers.status().isInternalServerError())
			.andDo(MockMvcResultHandlers.print());
	}
}
