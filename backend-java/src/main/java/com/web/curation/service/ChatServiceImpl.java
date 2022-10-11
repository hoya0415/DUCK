package com.web.curation.service;

import java.io.IOException;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.web.curation.model.chat.Chat;
import com.web.curation.model.chat.Log;
import com.web.curation.model.chat.Message;
import com.web.curation.model.mapper.ChatMapper;
import com.web.curation.model.user.FileInfo;

@Service
public class ChatServiceImpl implements ChatService {

	@Autowired
	private S3FileUploadService s3FileUploadService;
	
	@Autowired
	private SqlSession sqlSession;
	
	@Value("${cloud.aws.s3.bucket.url}")
    private String defaultUrl;
	
	public boolean create(Chat chat, MultipartFile file) throws IOException {
		ChatMapper chatMapper = sqlSession.getMapper(ChatMapper.class);
		boolean writed = chatMapper.create(chat);
		if(file.getOriginalFilename()!=null) {
			String filename = s3FileUploadService.upload(file);
			System.out.println("AWS S3 uploaded : "+defaultUrl+filename);
			FileInfo fileInfo = new FileInfo();
			fileInfo.setFileName(filename);
			fileInfo.setUrl(defaultUrl+filename);
			
			chat.setFileInfo(fileInfo);
			return chatMapper.writeFile(chat);
		} else
			return writed;
	}

	@Override
	public List<Chat> list() {
		return sqlSession.getMapper(ChatMapper.class).list();
	}

	@Override
	public List<Chat> searchChatList(String keyword) {
		return sqlSession.getMapper(ChatMapper.class).searchChatList(keyword);
	}

	@Override
	public boolean delete(int chatId) {
		String filename = sqlSession.getMapper(ChatMapper.class).getFileName(chatId);
		if(filename != null) {
			s3FileUploadService.deleteFile(filename);
			System.out.println("AWS S3 delete : " + filename);
		}
		sqlSession.getMapper(ChatMapper.class).deleteChatFile(chatId);
		return sqlSession.getMapper(ChatMapper.class).delete(chatId);
	}

	@Override
	public List<Integer> getExpiredChatId() {
		return sqlSession.getMapper(ChatMapper.class).getExpiredChatId();
	}

	@Override
	public List<Message> messageList(int chatId) {
		return sqlSession.getMapper(ChatMapper.class).messageList(chatId);
	}

	@Override
	public boolean sendMessage(Message msg) {
		return sqlSession.getMapper(ChatMapper.class).sendMessage(msg);
	}

	@Override
	public void log(Log log) {
		sqlSession.getMapper(ChatMapper.class).log(log);
	}

}
