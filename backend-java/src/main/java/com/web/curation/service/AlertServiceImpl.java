package com.web.curation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.curation.model.mapper.AlertInputMapper;
import com.web.curation.model.user.Alert;

@Service
public class AlertServiceImpl implements AlertService {
	
	@Autowired
	private AlertInputMapper aMapper;

	@Override
	public int alertInput(Alert alert) throws Exception {
		// TODO Auto-generated method stub
		return aMapper.alertInput(alert);
	}

	@Override
	public int alertDelete(Alert alert) throws Exception {
		// TODO Auto-generated method stub
		return aMapper.alertDelete(alert);
	}
}
