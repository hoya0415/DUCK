package com.web.curation.negative;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

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
import com.web.curation.model.user.ChangePassRequest;
import com.web.curation.model.user.ProfileChangeRequest;
import com.web.curation.model.user.SignupRequest;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(value = MethodOrderer.OrderAnnotation.class)
class UserControllerNegativeCases {
	@Autowired
	private MockMvc mockMvc;
	
	private static ObjectMapper oMapper = new ObjectMapper();

	Logger logger = LoggerFactory.getLogger(UserControllerNegativeCases.class);
	
	private static List<JSONObject> sRequests;
	
	private static String accessToken;
	
	private static MockMultipartFile mFile;
	
	private static ProfileChangeRequest profile;
	
	private static int userId;
	
	@BeforeAll
	public static void setup() throws Exception {
		String name = "file";
		String originalFileName = "test.jpg";
		String fileFullPath = "D:\\SSAFY\\work_SSAFY\\공통PJT\\S06P12D202\\backend-java\\test.jpg";
		
		mFile = new MockMultipartFile(name, originalFileName, "image/jpg", new FileInputStream(fileFullPath));
		
		profile = new ProfileChangeRequest();
		profile.setBio(null);
		profile.setNickname(null);
		profile.setFileName(originalFileName);
		
		sRequests = new ArrayList<>();
		
		SignupRequest sr = new SignupRequest();
		sr.setEmail("string2");
		sr.setPassword("string5");
		sRequests.add(new JSONObject(oMapper.writeValueAsString(sr)));
		
		sr.setEmail("string");
		sr.setPassword("string");
		sRequests.add(new JSONObject(oMapper.writeValueAsString(sr)));
	}
	
	@Test
	@Order(1)
	void getTokenForTest() throws Exception {
		ResultActions result = mockMvc.perform(MockMvcRequestBuilders.post("/user/login")
			.header("Accept", "application/json")
			.contentType("application/json")
			.content(sRequests.get(1).toString()))
			.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
			.andDo(MockMvcResultHandlers.print());
			
		accessToken = new JSONObject(result.andReturn().getResponse().getContentAsString()).getString("accessToken");
		userId = new JSONObject(result.andReturn().getResponse().getContentAsString()).getInt("userId");
	}
	
	@Test
	@Order(2)
	void emailCheckDupleFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/user/duple/email/"))
			.andExpect(MockMvcResultMatchers.status().is5xxServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(3)
	void signupFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/user/signup")
			.header("Accept", "application/json")
			.contentType("application/json")
			.content(sRequests.get(0).toString()))
			.andExpect(MockMvcResultMatchers.status().is5xxServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(4)
	void loginFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/user/login")
			.header("Accept", "application/json")
			.contentType("application/json")
			.content(sRequests.get(0).toString()))
			.andExpect(MockMvcResultMatchers.status().isInternalServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(5)
	void profileGetFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/user/profile/targetId=0&&loginId="+userId))
			.andExpect(MockMvcResultMatchers.status().is5xxServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(6)
	void nicknameCheckNotDupleFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get(
			"/user/duple/nickname/"+null))
			.andExpect(MockMvcResultMatchers.status().is5xxServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(7)
	void profileEditFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.multipart("/user/profile/edit")
			.file(mFile)
			.header("accessToken", accessToken)
			.param("nickname", profile.getNickname())
			.param("bio", profile.getBio())
			.contentType("multipart/form-data"))
			.andExpect(MockMvcResultMatchers.status().is5xxServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(8)
	void oldPasswordFailTest() throws Exception {
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
	@Order(9)
	void updatePasswordFailTest() throws Exception {
		ChangePassRequest cpr = new ChangePassRequest();
		cpr.setAccessToken(accessToken);
		cpr.setOldPassword("string");
		cpr.setNewPassword("longlonglonglonglonglonglonglong");
		cpr.setType("edit");
		
		mockMvc.perform(MockMvcRequestBuilders.put("/user/password/edit")
			.header("Accept", "application/json")
			.contentType("application/json")
			.content((new JSONObject(oMapper.writeValueAsString(cpr)).toString())))
			.andExpect(content().string("fail"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(10)
	void passwordEditEmailSendFailTest() throws Exception {
		ChangePassRequest cpr = new ChangePassRequest();
		cpr.setType("auth");
		cpr.setEmail("jkhb62012@gmail.com");
		
		mockMvc.perform(MockMvcRequestBuilders.put("/user/password/edit")
			.header("Accept", "application/json")
			.contentType("application/json")
			.content((new JSONObject(oMapper.writeValueAsString(cpr)).toString())))
			.andExpect(MockMvcResultMatchers.status().is5xxServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(11)
	void passwordEditEmailFailTest() throws Exception {
		ChangePassRequest cpr = new ChangePassRequest();
		cpr.setType("find");
		cpr.setEmail("email1");
		cpr.setNewPassword(null);
		
		mockMvc.perform(MockMvcRequestBuilders.put("/user/password/edit")
			.header("Accept", "application/json")
			.contentType("application/json")
			.content((new JSONObject(oMapper.writeValueAsString(cpr)).toString())))
			.andExpect(content().string("fail"))
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(12)
	void getAlertListFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/user/alert/-11")
			.header("accessToken", accessToken))
			.andExpect(MockMvcResultMatchers.status().is5xxServerError())
			.andDo(MockMvcResultHandlers.print());
	}
	
	@Test
	@Order(13)
	void signoutFailTest() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.delete("/user/delete/0")
			.header("Accept", "application/json")
			.contentType("application/json"))
			.andExpect(content().string("fail"))
			.andDo(MockMvcResultHandlers.print());
	}
}
