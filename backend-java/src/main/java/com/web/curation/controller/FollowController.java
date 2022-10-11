package com.web.curation.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.curation.model.user.Alert;
import com.web.curation.model.user.Follow;
import com.web.curation.model.user.FollowReturn;
import com.web.curation.service.AlertService;
import com.web.curation.service.FollowService;
import com.web.curation.service.JwtService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@RequestMapping("/follow")
@Api("팔로우 컨트롤러 API V1")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FollowController {
	
	public static final Logger logger = LoggerFactory.getLogger(UserController.class);
	private static final String SUCCESS = "success";
	private static final String FAIL = "fail";
	
	@Autowired
	private FollowService fServ;
	
	@Autowired
	private AlertService aServ;
	
	@Autowired
	private JwtService jwtService;
	
	@ApiOperation(value = "팔로우 추가", notes = "팔로우 추가 후 결과를 반환한다.", response = Map.class)
	@PostMapping
	public ResponseEntity<Map<String, Object>> addFollow(@RequestHeader String accessToken,
			@RequestBody @ApiParam(value = "팔로우 요청 시 필요한 정보=from/to userId, 팔로우 요청자 닉네임", required = true) Follow f) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		
		if(jwtService.isUsable(accessToken)) {
			try {
				if(fServ.getIsFollowed(f.getFromUserId(), f.getToUserId()) < 1) {
					fServ.addFollow(f);
					aServ.alertInput(new Alert("follow",f.getFromUserId(),f.getUserNickname(),
							f.getToUserId(),LocalDateTime.now(),0));
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
				}
				else {
					resultMap.put("message", "이미 팔로우된 유저입니다.");
					status = HttpStatus.CONFLICT;
				}
			} catch (Exception e) {
				logger.error("팔로우 요청 실패 : {}", e);
				resultMap.put("message", FAIL);
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "token expired");
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "팔로잉 리스트 조회", notes = "팔로잉 리스트를 추출하여 반환한다.", response = Map.class)
	@GetMapping("/following/targetId={targetId}&&loginId={loginId}")
	public ResponseEntity<Map<String, Object>> getFollowingList(
			@PathVariable("targetId") @ApiParam(value = "팔로잉 리스트 조회 타겟 id", required = true) int targetId,
			@PathVariable("loginId") @ApiParam(value = "현재 로그인한 유저 id", required = true) int loginId){
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		Follow f = new Follow();
		f.setFromUserId(targetId);
		
		try {
			if(targetId < 1)
				throw new Exception("유효하지 않은 타겟 ID입니다.");
			
			List<FollowReturn> followingList = fServ.getFollowingList(f);
			
			for(FollowReturn fr : followingList) {
				if(fServ.getIsFollowed(loginId, fr.getUserId()) > 0) {
					fr.setFollowed(true);
				}
			}
			
			resultMap.put("followingList", followingList);
			resultMap.put("message", SUCCESS);
			status = HttpStatus.ACCEPTED;
		} catch (Exception e) {
			logger.error("팔로잉 로드 실패 : {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "팔로워 리스트 조회", notes = "팔로워 리스트를 추출하여 반환한다.", response = Map.class)
	@GetMapping("/follower/targetId={targetId}&&loginId={loginId}")
	public ResponseEntity<Map<String, Object>> getFollowerList(
			@PathVariable("targetId") @ApiParam(value = "팔로워 리스트 조회 타겟 id", required = true) int targetId,
			@PathVariable("loginId") @ApiParam(value = "현재 로그인한 유저 id", required = true) int loginId){
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		Follow f = new Follow();
		f.setToUserId(targetId);
		
		try {
			if(targetId < 1)
				throw new Exception("유효하지 않은 타겟 ID입니다.");
			
			List<FollowReturn> followerList = fServ.getFollowerList(f);
			for(FollowReturn fr : followerList) {
				if(fServ.getIsFollowed(loginId, fr.getUserId()) > 0) {
					fr.setFollowed(true);
				}
			}
			resultMap.put("followerList", followerList);
			resultMap.put("message", SUCCESS);
			status = HttpStatus.ACCEPTED;
		} catch (Exception e) {
			logger.error("팔로잉 로드 실패 : {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "팔로우 삭제", notes = "선택된 팔로우를 삭제한다.", response = Map.class)
	@DeleteMapping("/follower/{fromUserId}&&{toUserId}")
	public ResponseEntity<Map<String, Object>> deleteFollow(@RequestHeader String accessToken,
			@PathVariable("fromUserId") @ApiParam(value = "follow를 삭제할 현재 로그인 id", required = true) int fromUserId,
			@PathVariable("toUserId") @ApiParam(value = "follow를 삭제할 타겟 유저 id", required = true) int toUserId){
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		
		if(jwtService.isUsable(accessToken)) {
			try {
				if(fServ.deleteFollow(fromUserId, toUserId) > 0) {
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
				}
				else
					throw new Exception("팔로우 정보가 없습니다.");
			} catch (Exception e) {
				logger.error("팔로우 삭제 실패 : {}", e);
				resultMap.put("message", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "token expired");
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
}
