package com.app.demo.common.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Slf4j
@Controller
public class MenuController {

    @GetMapping(value = "/")
    public String index() {
        return "index.tiles";
    }


}
