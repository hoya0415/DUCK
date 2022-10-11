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
import com.web.curation.model.chat.SendMessageRequest;
import com.web.curation.model.user.SignupRequest;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(value = MethodOrderer.OrderAnnotation.class)
public class ChatControllerPositiveCases {
	
	@Autowired
	private MockMvc mockMvc;
	
	private static ObjectMapper oMapper = new ObjectMapper();

	Logger logger = LoggerFactory.getLogger(ChatControllerPositiveCases.class);
	
	private static String accessToken;
	
	private static JSONObject sRequests;
	
	private static HashMap<String, Object> input;
	
	private static MockMultipartFile mFile;
	
	private static SendMessageRequest smr;
	
	@BeforeAll
	public static void setup() throws Exception {
		String name = "file";
		String originalFileName = "test.jpg";
		String fileFullPath = "D:\\SSAFY\\work_SSAFY\\공통PJT\\S06P12D202\\backend-java\\test.jpg";
		
		mFile = new MockMultipartFile(name, originalFileName, "image/jpg", new FileInputStream(fileFullPath));
		
		SignupRequest sr = new SignupRequest();
		sr.setEmail("string");
		sr.setPassword("string");
		
		sRequests = new JSONObject(oMapper.writeValueAsString(sr));
		
		input = new HashMap<>();
		input.put("videoUrl", "https://youtu.be/2TAcpx3MIGA");
		input.put("chatTitle", "testTitle");
		input.put("chatContents", "testContents");
		input.put("keyword", "Title");
		
		smr = new SendMessageRequest();
		
		smr.setContents("testMessage");
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

		input.put("userId", userId);
		smr.setUserId(userId);
	}
	
	@Test
	@Order(2)
	void chatCreateTest() throws Exception {
		ResultActions result = mockMvc.perform(MockMvcRequestBuilders.multipart("/chat/create")
			.file(mFile)
			.header("accessToken", accessToken)
			.param("chatTitle", (String)input.get("chatTitle"))
			.param("chatContents", (String)input.get("chatContents"))
			.param("videoUrl", (String)input.get("videoUrl"))
			.param("userId", ""+input.get("userId"))
			.contentType("multipart/form-data"))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
		
		JSONObject tmp = new JSONObject(result.andReturn().getResponse().getContentAsString());
		tmp = tmp.getJSONArray("chatList").getJSONObject(0);
		
		int chatId = tmp.getInt("chatId");
		
		input.put("chatId", chatId);
		smr.setChatId(chatId);
	}
	
	@Test
	@Order(3)
	void chatSearchTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/chat/search/"+input.get("keyword"))
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(4)
	void chatListGetTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/chat/list/all")
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(5)
	void MessageWriteTest() throws Exception {
		mockMvc.perform(
			MockMvcRequestBuilders.post("/chat/message/send")
			.header("accessToken", accessToken)
			.contentType("application/json")
			.content(new JSONObject(oMapper.writeValueAsString(smr)).toString()))
			.andExpect(MockMvcResultMatchers.status().isAccepted())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(6)
	void MessageListGetTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/chat/message/list/"+input.get("chatId"))
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().isAccepted())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(7)
	void chatDeleteTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.delete(
				"/chat/delete/"+input.get("chatId"))
				.header("accessToken", accessToken)
				.contentType("application/json"))
		.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
		.andDo(MockMvcResultHandlers.print());
	}
}
