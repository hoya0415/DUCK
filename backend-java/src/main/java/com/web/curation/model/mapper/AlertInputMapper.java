package com.web.curation.model.mapper;

import java.sql.SQLException;

import org.apache.ibatis.annotations.Mapper;

import com.web.curation.model.user.Alert;

@Mapper
public interface AlertInputMapper {

	public int alertInput(Alert alert) throws SQLException;
	public int alertDelete(Alert alert) throws SQLException;
	
}
