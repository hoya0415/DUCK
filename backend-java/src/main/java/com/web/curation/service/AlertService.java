package com.web.curation.service;

import com.web.curation.model.user.Alert;

public interface AlertService {
	
	public int alertInput(Alert alert) throws Exception;
	public int alertDelete(Alert alert) throws Exception;
	
}
