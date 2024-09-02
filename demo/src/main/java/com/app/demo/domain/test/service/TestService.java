package com.app.demo.domain.express.service.impl;

import com.app.demo.domain.test.dao.ExpressDao;
import com.app.demo.domain.test.dto.ExpressDto;
import com.app.demo.domain.test.dto.Test001Dto;
import com.app.demo.domain.test.service.ExpressService;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestDao testDao;

    public List<Test001Dto> getTestDB() {
        return testDao.getTestDB();
    }

}
