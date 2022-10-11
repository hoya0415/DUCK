package com.web.curation.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.web.curation.model.chat.Chat;
import com.web.curation.model.chat.ChatCreateRequest;
import com.web.curation.model.chat.Log;
import com.web.curation.model.chat.Message;
import com.web.curation.model.chat.SendMessageRequest;
import com.web.curation.service.ChatService;
import com.web.curation.service.JwtServiceImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@RequestMapping("/chat")
@Api("채팅 컨트롤러  API V1")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

	public static final Logger logger = LoggerFactory.getLogger(UserController.class);
	private static final String SUCCESS = "success";
	private static final String FAIL = "fail";
	
	@Autowired
	private JwtServiceImpl jwtService;

	@Autowired
	private ChatService chatService;
	
	
	@ApiOperation(value = "채팅방 생성", notes = "생성 성공 여부를 반환", response = Map.class)
	@RequestMapping(path = "/create", method = RequestMethod.POST,
		consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, Object>> create(@RequestHeader String accessToken,
			@ModelAttribute @ApiParam(value = "userId, chatTitle, chatContents", required = true) ChatCreateRequest ccr,
			@RequestPart(value="file", required=false) MultipartFile file) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		
		try {
			if(jwtService.isUsable(accessToken)) {
				Chat chat = new Chat();
				chat.setChatTitle(ccr.getChatTitle());
				chat.setChatContents(ccr.getChatContents());
				chat.setUserId(ccr.getUserId());
				chat.setVideoUrl(ccr.getVideoUrl());
				chat.setCreateDate(LocalDateTime.now());
				if(chatService.create(chat, file)) {
					List<Chat> chatList = chatService.list();
					resultMap.put("chatList", chatList);
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
				} else 
					throw new Exception("채팅방 생성 실패");
			} else {
				resultMap.put("message", "Authentication Expired");
				status = HttpStatus.NO_CONTENT;
			}
		} catch (Exception e) {
			logger.error("채팅 생성 실패 : {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "채팅 리스트 조회", notes = "모든 채팅 리스트 조회", response = Map.class)
	@GetMapping("/list/all")
	public ResponseEntity<Map<String, Object>> list(@RequestHeader String accessToken,
			HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				expireChat();
				List<Chat> chatList = chatService.list();
				
				if(chatList.isEmpty())
					throw new Exception("채팅방이 없습니다.");
				
				resultMap.put("message", SUCCESS);
				resultMap.put("chatList", chatList);
				status = HttpStatus.ACCEPTED;
			} catch (Exception e) {
				logger.error("채팅 리스트 조회 실패: {}", e);
				resultMap.put("message", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			logger.error("사용 불가능 토큰!!!");
			resultMap.put("message", FAIL);
			status = HttpStatus.ACCEPTED;
		}
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}

	@ApiOperation(value = "채팅 제목 검색", notes = "키워드를 포함한 제목의 채팅 검색", response = Map.class)
	@GetMapping("/search/{keyword}")
	public ResponseEntity<Map<String, Object>> searchFeedList(@RequestHeader String accessToken,
			@PathVariable("keyword") @ApiParam(value = "검색할 키워드", required = true) String keyword) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				expireChat();
				List<Chat> chatList = chatService.searchChatList(keyword);
				
				if(chatList.isEmpty())
					throw new Exception("채팅방이 없습니다.");
				
				resultMap.put("message", SUCCESS);
				resultMap.put("chatList", chatList);
				status = HttpStatus.ACCEPTED;
			} catch (Exception e) {
				logger.error("피드 리스트 조회 실패: {}", e);
				resultMap.put("message", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			logger.error("사용 불가능 토큰!!!");
			resultMap.put("message", FAIL);
			status = HttpStatus.ACCEPTED;
		}
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "채팅 삭제", notes = "삭제 성공 여부를 반환", response = String.class)
	@DeleteMapping("/delete/{chatId}")
	public ResponseEntity<String> delete(@PathVariable("chatId") int chatId) {
		if (chatService.delete(chatId)) {
			return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
		}
		return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
	}
	
	public void expireChat() {
		List<Integer> expiredChatId = chatService.getExpiredChatId();
		for(Integer chatId : expiredChatId) {
			chatService.delete(chatId);
		}
	}
	
	@ApiOperation(value = "메세지 리스트 조회", notes = "모든 메세지 리스트 조회", response = Map.class)
	@GetMapping("/message/list/{chatId}")
	public ResponseEntity<Map<String, Object>> messageList(@RequestHeader String accessToken,
			@PathVariable("chatId") @ApiParam(value = "chatId", required = true) int chatId,
			HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				
				String email = jwtService.getEmail(accessToken);
				Log log = new Log();
				log.setChatId(chatId);
				log.setEmail(email);
				chatService.log(log);
				
				List<Message> messageList = chatService.messageList(chatId);
				resultMap.put("message", SUCCESS);
				resultMap.put("messageList", messageList);
				status = HttpStatus.ACCEPTED;
			} catch (Exception e) {
				logger.error("메세지 리스트 조회 실패: {}", e);
				resultMap.put("message", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			logger.error("사용 불가능 토큰!!!");
			resultMap.put("message", FAIL);
			status = HttpStatus.ACCEPTED;
		}
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "메세지 작성", notes = "해당 채팅에 메세지를 작성한다.", response = Map.class)
	@PostMapping("/message/send")
	public ResponseEntity<Map<String, Object>> sendMessage(@RequestHeader String accessToken,
			@RequestBody @ApiParam(value = "chatId, userId, contents", required = true) SendMessageRequest smr) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		Message msg = new Message();
		msg.setChatId(smr.getChatId());
		msg.setUserId(smr.getUserId());
		msg.setContents(smr.getContents());
		msg.setSendTime(LocalDateTime.now());
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				if(chatService.sendMessage(msg)) {
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
				} else {
					
				}
			} catch (Exception e) {
				logger.error("메세지 작성 실패 : {}", e);
				resultMap.put("message", FAIL);
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	
}
