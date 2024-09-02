<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<div class="popup-tit">
	<p>문자 템플릿 관리</p>
</div>

<div>	
	<div class="popup-con">
		<div class="tem-box">
	        <label class="need">현재 추가된 템플릿</label>
	        <div class="tem-wrap popup-tem"></div>
	    </div>
	
		<div class="inputs tem">
			<div class="wrap tem">
				<label class="need">템플릿 이름</label>
				<button type="button" onclick="deleteTemplate();">템플릿 삭제</button>
	    	</div>
	        <input type="text" id="temTitle" placeholder="문자 템플릿 이름을 입력해 주세요.">
	        
	        <textarea id="temContent" placeholder="문자 템플릿 내용을 입력해 주세요."></textarea>	
		</div>
	</div>
	<div class="sms-exp">내용에 <span>#&#123;이름&#125;</span>으로 입력할 경우<br>문자 전송 시에 자동으로 고객 이름으로 변경됩니다.</div>
</div>

<div class="popup-btn">
	<button class="save-btn blue-btn" onclick="checkTemplateData();">저장하기</button>
</div>

<script>
	getTemplateList('popup');
</script>	