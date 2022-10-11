package com.web.curation.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.web.curation.model.feed.Feed;
import com.web.curation.model.mapper.FeedMapper;
import com.web.curation.model.user.FileInfo;

@Service
public class FeedServiceImpl implements FeedService {

	@Autowired
	private SqlSession sqlSession;
	
	@Autowired
	private S3FileUploadService s3FileUploadService;
	
	@Value("${cloud.aws.s3.bucket.url}")
    private String defaultUrl;
	
	@Override
	public boolean write(Feed feed, MultipartFile[] files) throws IOException {
		FeedMapper feedMapper = sqlSession.getMapper(FeedMapper.class);
		boolean writed = feedMapper.write(feed);
		if(!files[0].getOriginalFilename().equals("")) {
			List<FileInfo> fileInfos = new ArrayList<FileInfo>();
			for(MultipartFile file : files) {
				if(!file.getOriginalFilename().equals("")) {
					String filename = s3FileUploadService.upload(file);
					System.out.println("AWS S3 uploaded : "+filename);
					FileInfo fileInfo = new FileInfo();
					fileInfo.setFileName(filename);
					fileInfo.setUrl(defaultUrl+filename);
					fileInfos.add(fileInfo);
				}
			}
			feed.setFileInfos(fileInfos);
			return feedMapper.writeFile(feed);
		} else
			return writed;
	}

	@Override
	public boolean edit(Feed feed) {
		return sqlSession.getMapper(FeedMapper.class).edit(feed);
	}

	@Override
	public boolean delete(int feedId) {
		List<String> filenames = sqlSession.getMapper(FeedMapper.class).getFileNames(feedId);
		if(filenames != null) {
			for(String filename : filenames) {
				s3FileUploadService.deleteFile(filename);
			}
		}
		sqlSession.getMapper(FeedMapper.class).deleteFeedFile(feedId);
		return sqlSession.getMapper(FeedMapper.class).delete(feedId);
	}

	@Override
	public boolean like(int feedId) {
		return sqlSession.getMapper(FeedMapper.class).like(feedId);
	}

	@Override
	public List<Feed> list(int userId) throws Exception {
		List<Feed> list = sqlSession.getMapper(FeedMapper.class).list(userId);
		
		if(list.isEmpty())
			throw new Exception();
		
		return list;
	}

	@Override
	public Feed detail(int feedId) {
		return sqlSession.getMapper(FeedMapper.class).detail(feedId);
	}

	@Override
	public int isLikeCheck(int feedId, int userId) {
		return sqlSession.getMapper(FeedMapper.class).isLikeCheck(feedId, userId);
	}

	@Override
	public int feedLikeInput(int feedId, int userId, LocalDateTime likeDate) {
		return sqlSession.getMapper(FeedMapper.class).feedLikeInput(feedId, userId, likeDate);
	}

	@Override
	public int cancelFeedLike(int feedId, int userId) {
		return sqlSession.getMapper(FeedMapper.class).cancelFeedLike(feedId, userId);
	}

	@Override
	public int likeCntDecrease(int feedId) {
		return sqlSession.getMapper(FeedMapper.class).likeCntDecrease(feedId);
	}
	
	@Override
	public List<String> detailUrl(int feedId) {
		return sqlSession.getMapper(FeedMapper.class).detailUrl(feedId);
	}

	@Override
	public int getUserId(int feedId) throws Exception {
		return sqlSession.getMapper(FeedMapper.class).getUserId(feedId);
	}

}
