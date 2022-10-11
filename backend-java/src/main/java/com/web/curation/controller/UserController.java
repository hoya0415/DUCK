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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.web.curation.model.user.Alert;
import com.web.curation.model.user.ChangePassRequest;
import com.web.curation.model.user.ProfileChangeRequest;
import com.web.curation.model.user.User;
import com.web.curation.service.EmailService;
import com.web.curation.service.FollowService;
import com.web.curation.service.JwtServiceImpl;
import com.web.curation.service.MemberService;
import com.web.curation.service.ProfileService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@RequestMapping("/user")
@Api("사용자 컨트롤러  API V1")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

	public static final Logger logger = LoggerFactory.getLogger(UserController.class);
	private static final String SUCCESS = "success";
	private static final String FAIL = "fail";
	
	@Autowired
	private JwtServiceImpl jwtService;

	@Autowired
	private MemberService userService;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private ProfileService profileServivce;
	
	@Autowired
	private FollowService followService;

	@ApiOperation(value = "로그인", notes = "Access-token과 로그인 결과 메세지를 반환한다.", response = Map.class)
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(
			@RequestBody @ApiParam(value = "로그인 시 필요한 회원정보 : email, password", required = true) User user) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		try {
			User loginUser = userService.login(user);
			if (loginUser != null) {
				String token = jwtService.create("email", loginUser.getEmail(), "access-token");// key, data, subject
				logger.debug("로그인 토큰정보 : {}", token);
				resultMap.put("accessToken", token);
				resultMap.put("userId", loginUser.getUserId());
				resultMap.put("nickname", loginUser.getNickname());
				resultMap.put("profileUrl", loginUser.getProfileUrl());
				
				resultMap.put("message", SUCCESS);
				status = HttpStatus.ACCEPTED;
			} else
				throw new Exception("가입되지 않았거나 아이디와 비밀번호가 일치하지 않습니다.");
		} catch (Exception e) {
			logger.error("로그인 실패 : {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}

	@ApiOperation(value = "회원가입", notes = "회원가입 성공 여부를 반환", response = Map.class)
	@PostMapping("/signup")
	public ResponseEntity<Map<String, Object>> join(
			@RequestBody @ApiParam(value = "회원가입 시 필요한 회원정보 : 이메일, 패스워드", required = true) User user) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		
		try {
			user.setNickname(Double.toString(Math.random()).substring(3,8));
			user.setSignUpDate(LocalDateTime.now());
			
			if (userService.signup(user)) {
				resultMap.put("message", SUCCESS);
				status = HttpStatus.ACCEPTED;
			} else
				throw new Exception("회원가입이 실패하였습니다.");
		} catch (Exception e) {
			logger.error("회원가입 실패 : {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "유저 프로필 조회", notes = "userId로 프로필 조회", response = Map.class)
	@GetMapping("/profile/targetId={targetId}&&loginId={loginId}")
	public ResponseEntity<Map<String, Object>> getInfo(
			@PathVariable("targetId") @ApiParam(value = "프로필 조회 타겟 id", required = true) int targetId,
			@PathVariable("loginId") @ApiParam(value = "현재 로그인한 유저 id", required = true) int loginId) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		
		try {
			User user = userService.userInfo(targetId);
			if(followService.getIsFollowed(loginId, targetId) > 0) {
				resultMap.put("isFollowed", true);
			}
			else {
				resultMap.put("isFollowed", false);
			}
			
			resultMap.put("profileUrl", user.getProfileUrl());
			resultMap.put("nickname", user.getNickname());
			resultMap.put("bio", user.getBio());
			resultMap.put("signUpDate", user.getSignUpDate());
			resultMap.put("userId", user.getUserId());
			
			resultMap.put("feedCnt", profileServivce.getFeedCnt(targetId));
			resultMap.put("followerCnt", profileServivce.getFollowerCnt(targetId));
			resultMap.put("followingCnt", profileServivce.getFollowingCnt(targetId));
			resultMap.put("likeSum", profileServivce.getLikeSum(targetId));
			
			resultMap.put("feedList", profileServivce.getFeedList(targetId));
			resultMap.put("likeFeedList", profileServivce.getLikeFeedList(targetId));
			
			resultMap.put("message", SUCCESS);
			status = HttpStatus.ACCEPTED;
		} catch (Exception e) {
			logger.error("정보조회 실패 : {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "유저 프로필 수정", notes = "nickname, bio, profile image 수정", response = Map.class)
	@RequestMapping(path = "/profile/edit", method = RequestMethod.POST,
	consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, Object>> update(@RequestHeader String accessToken,
			@ModelAttribute ProfileChangeRequest profileChange,
			@RequestPart(value="file", required = false) MultipartFile file,
			HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				String email = jwtService.getEmail(accessToken);
				profileChange.setEmail(email);
				
				String url = profileServivce.updateProfile(profileChange, file);
				String nickname = profileChange.getNickname();
				
				resultMap.put("nickname", nickname);
				resultMap.put("profileUrl", url);
				resultMap.put("message", SUCCESS);
				status = HttpStatus.ACCEPTED;
			} catch (Exception e) {
				logger.error("정보 수정 실패 : {}", e);
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
	
	@ApiOperation(value = "회원 탈퇴 ", notes = "유저정보를 삭제하고 성공여부 반환", response = String.class)
	@DeleteMapping("/delete/{userId}")
	public ResponseEntity<String> deleteUser(@PathVariable("userId") int userId) {
		logger.debug("deleteUser - 호출");
		if (userService.deleteMember(userId)) {
			return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
		}
		return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
	}
	
	@ApiOperation(value = "이메일 중복확인", notes = "이메일 중복을 확인하고 중복여부를 반환", response = Map.class)
	@GetMapping("/duple/email/{email}")
	public ResponseEntity<Map<String, Object>> checkEmailDuple(
			@PathVariable("email") @ApiParam(value = "중복확인 할 이메일.", required = true) String email,
			HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		
		try {
			if (userService.countEmail(email) == 0) {
				logger.info("사용 가능한 이메일!!!");
					resultMap.put("isDuple", false);
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
			} else {
				logger.error("사용 불가능 이메일!!!");
				resultMap.put("isDuple", true);
				resultMap.put("message", FAIL);
				status = HttpStatus.CONFLICT;
			}
		} catch (Exception e) {
			logger.error("중복확인 실패 : {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "닉네임 중복확인", notes = "닉네임 중복을 확인하고 중복여부를 반환", response = Map.class)
	@GetMapping("/duple/nickname/{nickname}")
	public ResponseEntity<Map<String, Object>> checkNicknameDuple(
			@PathVariable("nickname") @ApiParam(value = "중복확인 할 닉네임.", required = true) String nickname,
			HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		try {
			if (userService.countNickname(nickname) == 0) {
				logger.info("사용 가능한 닉네임!!!");
				resultMap.put("isDuple", false);
				resultMap.put("message", SUCCESS);
				status = HttpStatus.ACCEPTED;
			} else {
				logger.error("사용 불가능 닉네임!!!");
				resultMap.put("isDuple", true);
				resultMap.put("message", FAIL);
				status = HttpStatus.CONFLICT;
			}
		} catch (Exception e) {
			logger.error("중복확인 실패 : {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@PutMapping("/password/edit")
	public ResponseEntity<String> updatePass(@RequestBody ChangePassRequest cpr) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		// 1.로그인 상태에서 개인설정에서 비밀번호를 변경하는 경우
		if(cpr.getType().equals("edit")) {
			if (jwtService.isUsable(cpr.getAccessToken())) {
				User user = new User();
				user.setEmail(jwtService.getEmail(cpr.getAccessToken()));
				user.setPassword(cpr.getOldPassword());
				if(userService.countEmailAndPass(user) == 1) {
					user.setPassword(cpr.getNewPassword());
					try {
						if(userService.updatePass(user)) {
							resultMap.put("result", true);
							resultMap.put("message", SUCCESS);
							return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
						}
					} catch (Exception e) {
						resultMap.put("result", false);
						resultMap.put("message", FAIL);
						resultMap.put("error", "데이터베이스 접근 오류");
						return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
					}
					
				}
				resultMap.put("result", false);
				resultMap.put("message", FAIL);
				resultMap.put("error", "현재 비밀번호가 일치하지 않습니다.");
				return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
			}
			resultMap.put("result", false);
			resultMap.put("message", FAIL);
			resultMap.put("error", "유효하지 않은 토큰입니다.");
			return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
		} 
		// 2-1.이메일로 인증코드를 보내 비밀번호를 찾는 경우
		else if(cpr.getType().equals("auth")) {
			try {
				String authCode = emailService.sendSimpleMessage(cpr.getEmail());
				logger.info(cpr.getEmail()+" 주소로 이메일 전송 성공");
				resultMap.put("authCode", authCode);
				resultMap.put("result", true);
				resultMap.put("message", SUCCESS);
				return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
			} catch (Exception e) {
				logger.info("이메일 전송 실패");
				resultMap.put("result", false);
				resultMap.put("message", FAIL);
				return new ResponseEntity<String>(FAIL, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		// 2-2.이메일 인증 완료 후 비밀번호 변경을 받음
		else if(cpr.getType().equals("find")) {
			User user = new User();
			user.setEmail(cpr.getEmail());
			user.setPassword(cpr.getNewPassword());
			if(userService.updatePass(user)) {
				logger.info("비밀번호 변경 성공");
				resultMap.put("result", true);
				resultMap.put("message", SUCCESS);
				return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
			}
		}
		resultMap.put("result", false);
		resultMap.put("message", FAIL);
		resultMap.put("error", "비밀번호 변경에 실패했습니다.");
		return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
	}
	
	@ApiOperation(value = "알림 리스트 확인", notes = "로그인 유저의 알림 리스트를 반환한다.", response = Map.class)
	@GetMapping("/alert/{targetId}")
	public ResponseEntity<Map<String, Object>> getAlertList(@RequestHeader String accessToken,
			@PathVariable("targetId") @ApiParam(value = "알림을 조회할 유저 id", required = true) int targetId) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				List<Alert> alertList = userService.getAlertList(targetId);
				userService.updateAlertChecked(targetId);
				
				if(alertList.isEmpty())
					throw new Exception("알림이 없습니다.");
				
				for(Alert a : alertList) {
					if(a.getChecked() == 1)
						a.setCheckedResult(true);
				}
				
				resultMap.put("alertList", alertList);
				resultMap.put("message", SUCCESS);
				status = HttpStatus.ACCEPTED;
			} catch (Exception e) {
				logger.error("알림 조회 실패 : {}", e);
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
}
