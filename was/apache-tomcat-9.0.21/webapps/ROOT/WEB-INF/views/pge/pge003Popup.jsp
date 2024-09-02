<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="popup-tit">
	<div class="text">
	    <p>메인 불러오기</p>
	    <small>기존에 작업하는 내용은 저장되지 않습니다.</small>
	    <small>영상이 있는 경우 자동으로 다운로드됩니다.</small>
	</div>
</div>

<div class="popup-con" style="width:480px">
	<div class="select-box">
    	<select id="popHospitalCode" onchange="commonGetOffice(this.value)"></select>
		<div class="icon-arrow"></div>	
	</div>

	<div class="select-box">
    	<select id="popOfficeCode" class="small"></select>
		<div class="icon-arrow"></div>	
	</div>

    <span>에서 데이터를 불러옵니다.</span>
</div>

<div class="popup-btn">
	<button class="save-btn blue-btn" id="callBtn" type="button">불러오기</button>
</div>
<script>
	commonGetHospital('<c:out value="${sessionScope.hospitalCode}"/>');
	
	document.querySelector("#callBtn").addEventListener("click", event => {
		getHomeMainCallPop();
		
		document.querySelector(".del-btn").click();
	});
</script>