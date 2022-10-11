package com.web.curation.model.mapper;

import java.sql.SQLException;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.curation.model.user.User;
import com.web.curation.model.user.Alert;

@Mapper
public interface UserMapper {

	public User login(User user) throws SQLException;
	public User userInfo(int userId) throws SQLException;
	public boolean signup(User user);
	public int countEmail(String email);
	public int countNickname(String nickname) throws SQLException;
	public int countEmailAndPass(User user);
	public boolean updatePass(User user);
	public List<Alert> getAlertList(int targetId) throws SQLException;
	public boolean updateAlertChecked(int targetId, int beTrue);
	public List<String> getFileNames(int userId);
	public void deleteFeedFile(int userId);
	public void deleteFeed(int userId);
	public void deleteProfileFile(int userId);
	public boolean deleteUser(int userId);
	
}
