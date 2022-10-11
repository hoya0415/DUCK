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

import com.web.curation.model.feed.Comment;
import com.web.curation.model.feed.Feed;
import com.web.curation.model.feed.FeedEditRequest;
import com.web.curation.model.feed.FeedWriteRequest;
import com.web.curation.model.user.Alert;
import com.web.curation.service.AlertService;
import com.web.curation.service.CommentService;
import com.web.curation.service.FeedService;
import com.web.curation.service.JwtServiceImpl;
import com.web.curation.service.ProfileService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@RestController
@RequestMapping("/feed")
@Api("피드 컨트롤러  API V1")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FeedController {

	public static final Logger logger = LoggerFactory.getLogger(UserController.class);
	private static final String SUCCESS = "success";
	private static final String FAIL = "fail";
	
	@Autowired
	private JwtServiceImpl jwtService;

	@Autowired
	private FeedService feedService;
	
	@Autowired
	private ProfileService profileService;
	
	@Autowired
	private AlertService alertService;
	
	@Autowired
	private CommentService commentService;
	
	@ApiOperation(value = "피드 작성", notes = "작성 성공 여부를 반환", response = Map.class)
	@RequestMapping(path = "/write", method = RequestMethod.POST,
		consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, Object>> write(@RequestHeader String accessToken,
			@ModelAttribute @ApiParam(value = "유저아이디, 제목, 카테고리, 내용", required = true) FeedWriteRequest fwr,
			@RequestPart(value="file", required=false) MultipartFile[] files) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		Feed feed = new Feed();
		
		try {
			if(jwtService.isUsable(accessToken)) {
//				feed 저장
				feed.setTitle(fwr.getTitle());
				feed.setCategory(fwr.getCategory());
				feed.setContents(fwr.getContents());
				feed.setUserId(fwr.getUserId());
				feed.setUploadDate(LocalDateTime.now());
				if(feedService.write(feed, files)) {
					List<Feed> feedList = feedService.list(fwr.getUserId());
					for(Feed f : feedList) {
						if(feedService.isLikeCheck(f.getFeedId(), fwr.getUserId()) > 0)
							f.setLiked(true);
					}
					resultMap.put("feedList", feedList);
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
				}
			} else {
				resultMap.put("message", "Authentication Expired");
				status = HttpStatus.NO_CONTENT;
			}
		} catch (Exception e) {
			logger.error("피드 작성 실패 : {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "피드 수정", notes = "수정 성공 여부를 반환", response = Map.class)
	@PutMapping("/edit")
	public ResponseEntity<Map<String, Object>> edit(@RequestHeader String accessToken, 
			@RequestBody @ApiParam(value = "feedId, title, category, contents", required= true) FeedEditRequest fer) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		if(jwtService.isUsable(accessToken)) {
			String email = jwtService.getEmail(accessToken);
			int userId = profileService.getUserId(email);
			
			Feed feed = new Feed();
			feed.setFeedId(fer.getFeedId());
			feed.setTitle(fer.getTitle());
			feed.setCategory(fer.getCategory());
			feed.setContents(fer.getContents());
			feed.setEditDate(LocalDateTime.now());
			if(feedService.edit(feed)) {
				List<Feed> feedList = feedService.list(userId);
				for(Feed f : feedList) {
					if(feedService.isLikeCheck(f.getFeedId(), userId) > 0)
						f.setLiked(true);
				}
				resultMap.put("feedList", feedList);
				resultMap.put("message", SUCCESS);
				status = HttpStatus.ACCEPTED;
			} else {
				resultMap.put("message", FAIL);
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "피드 삭제", notes = "삭제 성공 여부를 반환", response = String.class)
	@DeleteMapping("/delete/{feedId}")
	public ResponseEntity<String> delete(@PathVariable("feedId") int feedId) {
		logger.debug("deleteUser - 호출");
		if (feedService.delete(feedId)) {
			return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
		}
		return new ResponseEntity<String>(FAIL, HttpStatus.NO_CONTENT);
	}
	
	@ApiOperation(value = "피드 좋아요", notes = "해당 피드에 좋아요를 찍는다.", response = Map.class)
	@PutMapping("/feedLike")
	public ResponseEntity<Map<String, Object>> like(@RequestHeader String accessToken, 
			@RequestBody @ApiParam(value = "피드 좋아요 시 필요한 정보 : feedId, userId, userNickname", required= true) HashMap<String, Object> input) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		int feedId = (int)input.get("feedId");
		int userId = (int)input.get("userId");
		String userNickname = (String)input.get("userNickname");
		
		if(jwtService.isUsable(accessToken)) {
			int result = feedService.isLikeCheck(feedId, userId);
			
			if(result == 0 && feedService.like(feedId)) {
				alertService.alertInput(new Alert("feedLike", userId, userNickname,
						feedService.getUserId(feedId), LocalDateTime.now(), feedId));
				feedService.feedLikeInput(feedId, userId, LocalDateTime.now());
				List<Feed> feedList = feedService.list(userId);
				
				for(Feed f : feedList) {
					if(feedService.isLikeCheck(f.getFeedId(), userId) > 0)
						f.setLiked(true);
				}
				
				resultMap.put("feedList", feedList);
				resultMap.put("message", SUCCESS);
				status = HttpStatus.ACCEPTED;
			} else {
				resultMap.put("message", FAIL);
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "피드 좋아요 취소", notes = "해당 피드의 좋아요를 취소한다.", response = Map.class)
	@PutMapping("/feedLikeCancel")
	public ResponseEntity<Map<String, Object>> cancelFeedLike(@RequestHeader String accessToken, 
			@RequestBody @ApiParam(value = "피드 좋아요 해제 시 필요한 정보 : feedId, userId", required= true) HashMap<String, Object> input) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		int feedId = (int)input.get("feedId");
		int userId = (int)input.get("userId");
		
		if(jwtService.isUsable(accessToken)) {
			int result = feedService.isLikeCheck(feedId, userId);
			
			if(result > 0) {
				alertService.alertDelete(new Alert("feedLike", userId, "",
						feedService.getUserId(feedId), LocalDateTime.now(), feedId));
				feedService.cancelFeedLike(feedId, userId);
				feedService.likeCntDecrease(feedId);
				List<Feed> feedList = feedService.list(userId);
				
				for(Feed f : feedList) {
					if(feedService.isLikeCheck(f.getFeedId(), userId) > 0)
						f.setLiked(true);
				}
				
				resultMap.put("feedList", feedList);
				resultMap.put("message", SUCCESS);
				status = HttpStatus.ACCEPTED;
			} else {
				resultMap.put("message", "좋아요 정보가 없습니다.");
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "피드 리스트 조회", notes = "유저아이디로 피드리스트 조회", response = Map.class)
	@GetMapping("/{userId}")
	public ResponseEntity<Map<String, Object>> list(@RequestHeader String accessToken,
			@PathVariable("userId") @ApiParam(value = "userId", required = true) int userId,
			HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				List<Feed> feedList = feedService.list(userId);
				
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
	
	@ApiOperation(value = "피드 상세 조회", notes = "피드아이디로 피드 상세 조회", response = Map.class)
	@GetMapping("/detail/feedId={feedId}&&userId={userId}")
	public ResponseEntity<Map<String, Object>> detail(
			@PathVariable("feedId") @ApiParam(value = "feedId", required = true) int feedId,
			@PathVariable("userId") @ApiParam(value = "userId", required = true) int userId) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		
		try {
			Feed feed = feedService.detail(feedId);
			
			resultMap.put("feedId", feed.getFeedId());
			resultMap.put("userId", feed.getUserId());
			resultMap.put("title", feed.getTitle());
			resultMap.put("contents", feed.getContents());
			resultMap.put("nickname", feed.getNickname());
			resultMap.put("likeCnt", feed.getLikeCnt());
			resultMap.put("uploadDate", feed.getUploadDate());
			resultMap.put("editDate", feed.getEditDate());
			resultMap.put("category", feed.getCategory());
			resultMap.put("profileUrl", feed.getProfileUrl());
			resultMap.put("urls", feedService.detailUrl(feedId));
			
			if(feedService.isLikeCheck(feedId, userId) > 0)
				resultMap.put("isLiked", true);
			else
				resultMap.put("isLiked", false);

			resultMap.put("message", SUCCESS);
			status = HttpStatus.ACCEPTED;
		} catch (Exception e) {
			logger.error("피드 리스트 조회 실패: {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "댓글 목록 조회", notes = "해당 피드의 댓글 목록을 불러온다.", response = Map.class)
	@GetMapping("/comment/feedId={feedId}&&userId={userId}")
	public ResponseEntity<Map<String, Object>> getCommentList(
			@PathVariable("feedId") @ApiParam(value = "feedId", required = true) int feedId,
			@PathVariable("userId") @ApiParam(value = "userId", required = true) int userId){
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		
		try {
			List<Comment> commentList = commentService.getCommentList(feedId);
			
			for(Comment c : commentList) {
				if(c.getIsHidden() == 1) 
					c.setHiddenResult(true);
				if(commentService.isLikeCheck(c.getCommentId(), userId) > 0) {
					c.setLiked(true);
				}
			}
			
			resultMap.put("commentList", commentList);
			resultMap.put("message", SUCCESS);
			status = HttpStatus.ACCEPTED;
		} catch (Exception e) {
			logger.error("댓글 로드 실패 : {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "댓글 작성", notes = "해당 피드에 댓글을 작성한다.", response = Map.class)
	@PostMapping("/comment/write")
	public ResponseEntity<Map<String, Object>> commentWrite(@RequestHeader String accessToken,
			@RequestBody @ApiParam(value = "feedId, userId, nickname, contents", required = true) HashMap<String, Object> map) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		LocalDateTime createDate = LocalDateTime.now();
		int feedId = (int)map.get("feedId");
		int userId = (int)map.get("userId");
		String nickname = (String)map.get("nickname");
		String contents = (String)map.get("contents");
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				commentService.commentWrite(feedId, userId, nickname, contents, createDate);
				alertService.alertInput(new Alert("comment", userId, nickname,
						feedService.getUserId(feedId), LocalDateTime.now(), feedId));
				
				resultMap.put("message", SUCCESS);
				status = HttpStatus.ACCEPTED;
			} catch (Exception e) {
				logger.error("댓글 작성 실패 : {}", e);
				resultMap.put("message", FAIL);
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "댓글 수정", notes = "해당 댓글을 수정한다.", response = Map.class)
	@PutMapping("/comment/edit")
	public ResponseEntity<Map<String, Object>> commentEdit(@RequestHeader String accessToken,
			@RequestBody @ApiParam(value = "commentId, contents", required = true) HashMap<String, Object> map) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		LocalDateTime editDate = LocalDateTime.now();
		int commentId = (int)map.get("commentId");
		String contents = (String)map.get("contents");
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				int result = commentService.commentEdit(commentId, contents, editDate);
				
				if(result == 0)
					throw new Exception("작업된 데이터가 없습니다.");
				else {
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
				}
			} catch (Exception e) {
				logger.error("댓글 수정 실패 : {}", e);
				resultMap.put("message", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "댓글 삭제", notes = "선택된 댓글을 삭제한다.", response = Map.class)
	@DeleteMapping("/comment/delete/{commentId}")
	public ResponseEntity<Map<String, Object>> commentDelete(@RequestHeader String accessToken,
			@PathVariable("commentId") @ApiParam(value = "commentId", required = true) int commentId){
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				if(commentService.commentDelete(commentId) > 0) {
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
				}
				else
					throw new Exception("작업된 데이터가 없습니다.");
			} catch (Exception e) {
				logger.error("댓글 삭제 실패 : {}", e);
				resultMap.put("message", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "댓글 숨김", notes = "해당 댓글을 숨김 처리한다.", response = Map.class)
	@PutMapping("/comment/hide")
	public ResponseEntity<Map<String, Object>> commentHide(@RequestHeader String accessToken,
			@RequestBody @ApiParam(value = "commentId", required = true) int commentId) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				int result = commentService.commentHide(commentId);
				
				if(result == 0)
					throw new Exception("작업된 데이터가 없습니다.");
				else {
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
				}
			} catch (Exception e) {
				logger.error("댓글 숨김 실패 : {}", e);
				resultMap.put("message", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "댓글 숨김 해제", notes = "해당 댓글을 숨김해제 처리한다.", response = Map.class)
	@PutMapping("/comment/unhide")
	public ResponseEntity<Map<String, Object>> commentUnhide(@RequestHeader String accessToken,
			@RequestBody @ApiParam(value = "commentId", required = true) int commentId) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				int result = commentService.commentUnhide(commentId);
				
				if(result == 0) 
					throw new Exception("작업된 데이터가 없습니다.");
				else {
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
				}
			} catch (Exception e) {
				logger.error("댓글 숨김해제 실패 : {}", e);
				resultMap.put("message", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "댓글 좋아요", notes = "해당 댓글에 좋아요를 찍는다.", response = Map.class)
	@PutMapping("/comment/like")
	public ResponseEntity<Map<String, Object>> commentLike(@RequestHeader String accessToken,
			@RequestBody @ApiParam(value = "commentId, userId, userNickname", required = true) HashMap<String, Object> map) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		int commentId = (int)map.get("commentId");
		int userId = (int)map.get("userId");
		String userNickname = (String)map.get("userNickname");
		
		if (jwtService.isUsable(accessToken)) {
			logger.info("사용 가능한 토큰!!!");
			try {
				int isLike = commentService.isLikeCheck(commentId, userId);
				
				if(isLike > 0) {
					resultMap.put("message", "이미 좋아요를 찍은 유저입니다.");
					status = HttpStatus.FORBIDDEN;
				}
				else {
					int result = commentService.commentLike(commentId);
					
					if(result < 1)
						throw new Exception("작업된 데이터가 없습니다.");
					
					alertService.alertInput(new Alert("commentLike", userId, userNickname,
							commentService.getUserId(commentId), LocalDateTime.now(), commentId));
					
					resultMap.put("message", SUCCESS);
					status = HttpStatus.ACCEPTED;
					commentService.commentLikeTableInsert(commentId, userId, LocalDateTime.now());
				}
			} catch (Exception e) {
				logger.error("댓글 좋아요 실패 : {}", e);
				resultMap.put("message", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "댓글 좋아요 취소", notes = "해당 댓글의 좋아요를 취소한다.", response = Map.class)
	@PutMapping("/comment/likeCancel")
	public ResponseEntity<Map<String, Object>> cancelCommentLike(@RequestHeader String accessToken, 
			@RequestBody @ApiParam(value = "댓글 좋아요 해제 시 필요한 정보 : commentId, userId", required= true) HashMap<String, Object> input) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = null;
		int commentId = (int)input.get("commentId");
		int userId = (int)input.get("userId");
		
		if(jwtService.isUsable(accessToken)) {
			int result = commentService.isLikeCheck(commentId, userId);
			
			if(result > 0) {
				alertService.alertDelete(new Alert("commentLike", userId, "",
						commentService.getUserId(commentId), LocalDateTime.now(), commentId));
				commentService.cancelCommentLike(commentId, userId);
				commentService.likeCntDecrease(commentId);
				
				resultMap.put("message", SUCCESS);
				status = HttpStatus.ACCEPTED;
			} else {
				resultMap.put("message", "좋아요 정보가 없습니다,");
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		} else {
			resultMap.put("message", "Authentication Expired");
			status = HttpStatus.NO_CONTENT;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}
	
	@ApiOperation(value = "카테고리 리스트 조회", notes = "말 그대로 카테고리 종류 리스트 조회", response = Map.class)
	@GetMapping("/categoryList")
	public ResponseEntity<Map<String, Object>> categoryList() {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.ACCEPTED;
		try {
			List<String> categoryList = profileService.getCategoryList();
			
			if(categoryList.isEmpty())
				throw new Exception("카테고리 리스트가 없습니다.");
			
			resultMap.put("message", SUCCESS);
			resultMap.put("categoryList", categoryList);
			status = HttpStatus.ACCEPTED;
		} catch (Exception e) {
			logger.error("카테 고리 리스트 조회 실패: {}", e);
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}

}
