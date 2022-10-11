package com.web.curation.service;

import java.util.List;

import com.web.curation.model.user.Alert;
import com.web.curation.model.user.User;

public interface MemberService {

	public User login(User user) throws Exception;
	public User userInfo(int userId) throws Exception;
	public boolean signup(User user);
	public boolean deleteMember(int userId);
	public int countEmail(String email);
	public int countNickname(String nickname) throws Exception;
	public int countEmailAndPass(User user);
	public boolean updatePass(User user);
	public List<Alert> getAlertList(int targetId) throws Exception;
	public boolean updateAlertChecked(int targetId);
}