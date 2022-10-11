package com.web.curation.service;

import java.util.Map;

public interface JwtService {

	<T> String create(String key, T data, String subject);
	Map<String, Object> get(String key);
	String getEmail(String key);
	boolean isUsable(String jwt);
	
}
