<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<link rel="stylesheet" href="${sessionScope.path}/style/res/res002Caution.css" type="text/css"/>

<input type='hidden' id="userId" value="<c:out value='${userId}'/>"/>
<input type='hidden' id="userMobile" value="<c:out value='${userMobile}'/>"/>
<input type='hidden' id="userName" value="<c:out value='${userName}'/>"/>
<input type='hidden' id="resNo" value="<c:out value='${resNo}'/>"/>

<div class="caution-reserve-div"></div>

<div class="caution-wrap">
	<div class="caution-write">
	    <div class="popup-tit">
	        <p>주의사항 전송</p>
	        
	        <div class="caution-tem-btn">
   				<button type="button" class="white-btn caution-reserve" onclick="checkReserveList()">예약 내용</button>
				<button type="button" class="dark-btn caution-tem" onclick="goTemplate()">템플릿 관리</button>
	        </div>
	    </div>
	
	    <div class="caution-write-area">			
	    	<div class="caution-write-section">
	   			<label class="need">주의사항</label>
				
		   		<div class="caution-tem-box">
			   		<div class="select-box">						
			   			<select id="cautionTemp" name="cautionTemp" onchange="getTemplateContent(this)">
			   				<option>주의사항 템플릿 선택</option>
			   			</select>
			   			<div class="icon-arrow"></div>
			   		</div>
		   		
			   		<div class="select-box">						
			   			<select id="cautionDetail" name="cautionDetail" onchange="getTemplateDetailContent(this)">
			   				<option>상세 주의사항 선택</option>
			   			</select>
			   			<div class="icon-arrow"></div>
			   		</div>
				</div>
   							
				<textarea id="replyContent" class="scroll" placeholder="주의사항 내용을 입력해 주세요. 또는 주의사항 템플릿을 선택해 주세요."></textarea>
	    	</div>
	    	
	    	<div class="sms-exp">
	    		내용에 <span>#&#123;이름&#125;</span>으로 입력할 경우<br/>
				주의사항 전송 시에 자동으로 고객 이름으로 변경됩니다.
			</div>
	    	
	    	<div class="caution-send-section">
	    		<button type="button" class="save-btn blue-btn" onclick="sendSms()">전송하기</button>
	    	</div>
	    </div>
	</div>
	
	<div class="caution-history">
	    <div class="popup-tit">
	        <p>주의사항 전송 기록</p>
	    </div>
	
	    <div class="caution-history-area scroll">
			<div class="caution-send-list"></div>
	    </div>
	</div>
</div>

<script src="${sessionScope.path}/script/res/res002Caution.js"></script>	
<script>
	init();
</script>