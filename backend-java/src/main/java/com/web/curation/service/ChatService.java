package com.web.curation.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.web.curation.model.chat.Chat;
import com.web.curation.model.chat.Log;
import com.web.curation.model.chat.Message;

public interface ChatService {

	boolean create(Chat chat, MultipartFile file) throws IOException;
	List<Chat> list();
	List<Chat> searchChatList(String keyword);
	boolean delete(int chatId);
	List<Integer> getExpiredChatId();
	List<Message> messageList(int chatId);
	boolean sendMessage(Message msg);
	void log(Log log);

}
