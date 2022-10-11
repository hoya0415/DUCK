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
public class TrendControllerNegativeCases {

	@Autowired
	private MockMvc mockMvc;
	
	private static ObjectMapper oMapper = new ObjectMapper();

	Logger logger = LoggerFactory.getLogger(TrendControllerNegativeCases.class);
	
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
		input.put("nicknameKeyword", "dummyTestKeyword");
		input.put("feedKeyword", "dummyTestKeyword");
		input.put("categoryKeyword", "dummyTestKeyword");
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
		int userId = new JSONObject(result.andReturn().getResponse().getContentAsString()).getInt("userId");

		input.put("loginId", userId);
	}
	
	@Test
	@Order(2)
	void profileSearchFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/trend/profile/keyword="+input.get("nicknameKeyword")+"&&loginId="+input.get("loginId"))
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().isInternalServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(3)
	void feedSearchFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/trend/feed/title/keyword="+input.get("feedKeyword")+"&&loginId="+input.get("loginId"))
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().isInternalServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(4)
	void feedCategorySearchFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/trend/feed/category/keyword="+input.get("categoryKeyword")+"&&loginId="+input.get("loginId"))
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().isInternalServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(5)
	void likeTrendFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/trend/like/-1")
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().isInternalServerError())
			.andDo(MockMvcResultHandlers.print());
	}
}
