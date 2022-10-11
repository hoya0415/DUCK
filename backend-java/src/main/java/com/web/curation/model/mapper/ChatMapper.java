package com.web.curation.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.curation.model.chat.Chat;
import com.web.curation.model.chat.Log;
import com.web.curation.model.chat.Message;

@Mapper
public interface ChatMapper {

	public boolean create(Chat chat);
	public boolean writeFile(Chat chat);
	public List<Chat> list();
	public List<Chat> searchChatList(String keyword);
	public boolean delete(int chatId);
	public void deleteChatFile(int chatId);
	public String getFileName(int chatId);
	public List<Integer> getExpiredChatId();
	public List<Message> messageList(int chatId);
	public boolean sendMessage(Message msg);
	public void log(Log log);
}
