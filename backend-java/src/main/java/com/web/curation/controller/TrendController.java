package com.web.curation.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.curation.model.feed.Feed;
import com.web.curation.model.user.Profile;
import com.web.curation.service.FeedService;
import com.web.curation.service.FollowService;
import com.web.curation.service.JwtServiceImpl;
import com.web.curation.service.MemberService;
import com.web.curation.service.TrendService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@RequestMapping("/trend")
@Api("검색 컨트롤러  API V1")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TrendController {

	public static final Logger logger = LoggerFactory.getLogger(UserController.class);
	private static final String SUCCESS = "success";
	private static final String FAIL = "fail";
	
	@Autowired
	private JwtServiceImpl jwtService;
	
	@Autowired
	private TrendService trendService;
	
	@Autowired
	private FeedService feedService;
	
	@Autowired
	private FollowService followService;
	
	@Autowired
	private MemberService userService;
	
	@ApiOperation(value = "피드 제목,내용 검색", notes = "키워드를 포함한 제목과 내용의 피드 리스트 검색", response = Map.class)
	@GetMapping("/feed/title/keyword={keyword}&&loginId={loginId}")
	public ResponseEntity<Map<String, Object>> searchFeedList(@RequestHeader String accessToken,
			@PathVariable("keyword") @ApiParam(value = "검색할 키워드", required = true) String keyword,
			@PathVariable("loginId") @ApiParam(value = "현재 로그인한 아이디", required = true) int loginId) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				List<Feed> feedList = trendService.searchFeedList(keyword);
				
				if(feedList.isEmpty())
					throw new Exception("검색된 피드가 없습니다.");
				
				for(Feed f : feedList) {
					if(feedService.isLikeCheck(f.getFeedId(), loginId) > 0)
						f.setLiked(true);
				}
				
				resultMap.put("message", SUCCESS);
				resultMap.put("feedList", feedList);
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
	
	@ApiOperation(value = "피드 카테고리 검색", notes = "키워드를 포함한 카테고리의 피드 리스트 검색", response = Map.class)
	@GetMapping("/feed/category/keyword={keyword}&&loginId={loginId}")
	public ResponseEntity<Map<String, Object>> searchFeedListByCategory(@RequestHeader String accessToken,
			@PathVariable("keyword") @ApiParam(value = "검색할 키워드", required = true) String keyword,
			@PathVariable("loginId") @ApiParam(value = "현재 로그인한 아이디", required = true) int loginId) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				List<Feed> feedList = trendService.searchFeedListByCategory(keyword);
				
				if(feedList.isEmpty())
					throw new Exception("검색된 피드가 없습니다.");
				
				for(Feed f : feedList) {
					if(feedService.isLikeCheck(f.getFeedId(), loginId) > 0)
						f.setLiked(true);
				}
				
				resultMap.put("message", SUCCESS);
				resultMap.put("feedList", feedList);
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
	
	@ApiOperation(value = "유저 프로필 검색", notes = "키워드로 유저 검색", response = Map.class)
	@GetMapping("/profile/keyword={keyword}&&loginId={loginId}")
	public ResponseEntity<Map<String, Object>> searchUserProfileList(@RequestHeader String accessToken,
			@PathVariable("keyword") @ApiParam(value = "검색할 키워드", required = true) String keyword,
			@PathVariable("loginId") @ApiParam(value = "현재 로그인한 아이디", required = true) int loginId) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				List<Profile> profileList = trendService.searchProfileList(keyword);
				
				if(profileList.isEmpty())
					throw new Exception("검색된 프로필이 없습니다.");
				
				for(Profile p : profileList) {
					if(followService.getIsFollowed(loginId, p.getUserId()) > 0)
						p.setFollowed(true);
				}
				
				resultMap.put("message", SUCCESS);
				resultMap.put("profileList", profileList);
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
	
	@ApiOperation(value = "실시간 좋아요 순위 조회", notes = "최근 일정 시간 내의 좋아요 랭킹 조회", response = Map.class)
	@GetMapping("/like/{userId}")
	public ResponseEntity<Map<String, Object>> searchLikeRanking(@RequestHeader String accessToken,
			@PathVariable("userId") @ApiParam(value = "현재 로그인한 유저의 아이디", required = true) int userId) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				if(userService.userInfo(userId)==null)
					throw new Exception("유효한 유저 ID가 아닙니다.");
				
				List<Feed> feedList = trendService.searchLikeRanking();
				
				if(feedList.isEmpty())
					throw new Exception("최근 24시간 이내에 좋아요가 집계된 피드가 없습니다.");
				
				for(Feed f : feedList) {
					if(feedService.isLikeCheck(f.getFeedId(), userId) > 0)
						f.setLiked(true);
				}
				
				resultMap.put("message", SUCCESS);
				resultMap.put("feedList", feedList);
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
}
