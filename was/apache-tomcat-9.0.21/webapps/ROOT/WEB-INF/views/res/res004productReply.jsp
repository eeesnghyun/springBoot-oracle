<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<link rel="stylesheet" href="/resources/style/res/res004productReply.css" type="text/css"/>

<div class="pop-center last-pro-reply">
    <div class="popup-tit">
        <p>남은 시술권 전송</p>
    </div>

    <div class="popup-con">
    	<label class="need">남은 시술권 (남은 금액 : <span id="lastPrice"></span>원)</label>
		<textarea id="replyContent"></textarea>
    	
    	<div class="sms-exp">내용에 <span style="color:#111; font-weight:400;">#&#123;이름&#125;</span>으로 입력할 경우<br>남은 시술권 전송 시에 자동으로 고객 이름으로 변경됩니다.</div>
    	
    	<div class="btn-area">
    		<button type="button" class="save-btn blue-btn" onclick="sendProduct()">전송하기</button>
    	</div>
    </div>
</div>

<div class="pop-right last-pro-reply">
	<input type="hidden" id="mobile" value="${mobile}">
	<input type="hidden" id="name"   value="${userName}">
	<input type="hidden" id="userId" value="${userId}">
	<input type="hidden" id="resNo"  value="${resNo}">
	
    <div class="popup-tit">
        <p>남은 시술권 전송 기록</p>
    </div>

    <div class="popup-con scroll">
		<div class="send-list"></div>
    </div>
</div>

<script src="${sessionScope.path}/script/res/res004productReply.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	getUserProductReplyList();
</script>