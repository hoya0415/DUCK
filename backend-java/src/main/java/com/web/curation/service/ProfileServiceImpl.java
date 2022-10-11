package com.web.curation.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.web.curation.model.feed.FeedList;
import com.web.curation.model.mapper.ProfileDataMapper;
import com.web.curation.model.user.ProfileChangeRequest;

@Service
public class ProfileServiceImpl implements ProfileService {
	
	@Autowired
	private SqlSession sqlSession;
	
	@Autowired
	private ProfileDataMapper pMapper;
	
	@Autowired
	private S3FileUploadService s3FileUploadService;
	
	@Value("${cloud.aws.s3.bucket.url}")
    private String defaultUrl;

	@Override
	public String updateProfile(ProfileChangeRequest profileChange, MultipartFile file) throws Exception {
		String filename = pMapper.getFileName(profileChange.getEmail());
		if(filename != null) {
			s3FileUploadService.deleteFile(pMapper.getFileName(profileChange.getEmail()));
		}
		pMapper.deleteProfile(profileChange.getEmail());
		pMapper = sqlSession.getMapper(ProfileDataMapper.class);
		pMapper.updateProfile(profileChange);
		if(file != null) {
			filename = s3FileUploadService.upload(file);
			String url = defaultUrl+filename;
			System.out.println("AWS S3 uploaded : "+filename);
			profileChange.setFileName(filename);
			profileChange.setUrl(url);
			pMapper.profileFile(profileChange);
			return url;
		} else {
			filename = null;
			String url = null;
			profileChange.setFileName(filename);
			profileChange.setUrl(url);
			pMapper.profileFile(profileChange);
			return url;
		}
	}
	
	@Override
	public int getFeedCnt(int userId) throws Exception {
		return pMapper.getFeedCnt(userId);
	}

	@Override
	public int getFollowerCnt(int toUserId) throws Exception {
		return pMapper.getFollowerCnt(toUserId);
	}

	@Override
	public int getFollowingCnt(int fromUserId) throws Exception {
		return pMapper.getFollowingCnt(fromUserId);
	}

	@Override
	public int getLikeSum(int userId) throws Exception {
		return pMapper.getLikeSum(userId);
	}

	@Override
	public List<FeedList> getFeedList(int userId) throws Exception {
		return pMapper.getFeedList(userId);
	}

	@Override
	public List<FeedList> getLikeFeedList(int userId) throws Exception {
		return pMapper.getLikeFeedList(userId);
	}

	@Override
	public int getUserId(String email) {
		return pMapper.getUserId(email);
	}

	@Override
	public List<String> getCategoryList() throws Exception {
		return pMapper.getCategoryList();
	}
	
}
