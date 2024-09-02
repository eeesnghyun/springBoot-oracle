<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/usr/usr001.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<style>
	.popup-con .inputs:first-child {
		min-width: 650px;   
	}
	.popup-con .inputs:last-child {
	    min-width: 300px;
	}
	.popup-con .inputs:first-child input {
		width: 15px;
	}
	#divAuthGrid .tabulator-header {
		padding: 0px!important;
	}
	#divAuthGrid .tabulator-row {		
		padding-left: 0px!important;
	}	
	#divAuthGrid .tabulator-cell {
		height: 40px;
	}	
</style>
<div class="popup-tit">
	<p>메뉴 권한 부여</p>
</div>

<div class="popup-con">
	<div class="inputs">
       	<label class="need">사용자</label>
       	<div>
       		<div id="divAuthGrid" class="scroll" style="overflow: auto; height: 300px;"></div>
       	</div>
    </div>

	<div class="inputs">
		<label class="need">메뉴 권한</label>
        <div class="auto-area"></div>
	</div>
</div>

<div class="popup-btn">
	<button class="save-btn blue-btn" id="callBtn" onclick="updateAuthMenu()">저장하기</button>
</div>

<script>
	var gridSysAuth004 = null;

	function authInit() {		
		//메뉴코드 그리기
		drawMenuCode();		
		setMenuClickEvent();
		
		getSysAuthList();
	}
	
	authInit();
</script>	