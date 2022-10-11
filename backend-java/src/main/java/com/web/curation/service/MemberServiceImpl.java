package com.web.curation.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.web.curation.model.mapper.UserMapper;
import com.web.curation.model.user.Alert;
import com.web.curation.model.user.User;


@Service
public class MemberServiceImpl implements MemberService {

	@Autowired
	private SqlSession sqlSession;
	
	@Autowired
	private S3FileUploadService s3FileUploadService;
	
	@Value("${cloud.aws.s3.bucket.url}")
    private String defaultUrl;
	
	@Override
	public User login(User user) throws Exception {
		if(user.getEmail() == null || user.getPassword() == null)
			return null;
		return sqlSession.getMapper(UserMapper.class).login(user);
	}

	@Override
	public User userInfo(int userId) throws Exception {
		return sqlSession.getMapper(UserMapper.class).userInfo(userId);
	}

	@Override
	public boolean signup(User user) {
		return sqlSession.getMapper(UserMapper.class).signup(user);
	}

	@Override
	public boolean deleteMember(int userId) {
		List<String> filenames = sqlSession.getMapper(UserMapper.class).getFileNames(userId);
		if(filenames!=null) {
			for(String filename : filenames) {
				s3FileUploadService.deleteFile(filename);
				System.out.println("AWS S3 deleted : "+filename);
			}
		}
		sqlSession.getMapper(UserMapper.class).deleteFeedFile(userId);
		sqlSession.getMapper(UserMapper.class).deleteFeed(userId);
		sqlSession.getMapper(UserMapper.class).deleteProfileFile(userId);
		return sqlSession.getMapper(UserMapper.class).deleteUser(userId);
	}

	@Override
	public int countEmail(String email) {
		return sqlSession.getMapper(UserMapper.class).countEmail(email);
	}

	@Override
	public int countNickname(String nickname) throws Exception {
		return sqlSession.getMapper(UserMapper.class).countNickname(nickname);
	}

	@Override
	public int countEmailAndPass(User user) {
		return sqlSession.getMapper(UserMapper.class).countEmailAndPass(user);
	}

	@Override
	public boolean updatePass(User user) {
		return sqlSession.getMapper(UserMapper.class).updatePass(user);
	}

	@Override
	public List<Alert> getAlertList(int targetId) throws Exception {
		return sqlSession.getMapper(UserMapper.class).getAlertList(targetId);
	}

	@Override
	public boolean updateAlertChecked(int targetId) {
		return sqlSession.getMapper(UserMapper.class).updateAlertChecked(targetId, 1);
	}

}
