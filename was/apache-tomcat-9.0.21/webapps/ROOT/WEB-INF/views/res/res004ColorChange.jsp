<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<link rel="stylesheet" href="/resources/style/res/res004.css" type="text/css"/>
<style>
.popup-inner{
	width:680px;
	padding: 20px 30px;
}
.color-con{
	width: 140px;
	margin-right:20px;
	margin-bottom:0;
	float: left;
}
.color-con.last{
	margin-right:0; 
}
.popup-btn{
	padding-top:30px;
}
</style> 

<div class="popup-tit">
   	<p>배경 변경</p>
</div>

<form class="color-form">
	<div class="popup-con">
	 	<div class="color-wrap">
		     <div class="color-con">
			   	 <label class="need">도착한 회원</label>
			   	 <div class="color-picker">	
				     <input type="text" class="status-color1" required>
				     <input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
			     </div>
		     </div>
		     
		     <div class="color-con">
			   	 <label class="need">상담대기</label>
			   	 <div class="color-picker">	
				     <input type="text" class="status-color2" required>
				     <input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
			     </div>
		     </div>
		     
	   	     <div class="color-con">
			   	 <label class="need">CRM 전송</label>
			   	 <div class="color-picker">	
				     <input type="text" class="status-color3" required>
				     <input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
			     </div>
		     </div>
		     
		     <div class="color-con last">
			   	 <label class="need">예약확인 완료</label>
			   	 <div class="color-picker">	
				     <input type="text" class="status-color4" onchange="changeValueColor5();" required>
				     <input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
				     <input type="hidden" class="status-color5">
			     </div>
		     </div>
	     </div>
	     <div class="popup-btn">
			 <button class="save-btn blue-btn" onclick="updateReserveStatus();">저장하기</button>
		 </div>
	</div>
</form>	
	
<script>
	getReserveStatusList();
</script>