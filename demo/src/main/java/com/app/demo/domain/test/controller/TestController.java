package com.app.demo.domain.test.controller;

import com.app.demo.domain.test.dto.ExpressDto;
import com.app.demo.domain.test.dto.Test001Dto;
import com.app.demo.domain.test.service.ExpressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("express")
public class ExpressController {

    private final ExpressService expressService;

    @GetMapping(value = "/dbTest")
    public void dbTest() {
        List<Test001Dto> resultList = expressService.getTestDB();
        log.info(resultList.toString());
    }

}
