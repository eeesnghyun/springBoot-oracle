<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/res/res001Popup.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="left">
    <div class="popup-tit">
        <p>특정일 설정</p>
    </div>

    <div class="popup-con">
        <label class="need">특정일 추가</label>	
		<div class="date-area">
           	<div class="area">
		        <div class="con date">
	       			<input type="text" class="start-date" id="specDate" name="specDate" placeholder="특정일 입력" autocomplete="off" required>
		        </div>
           	</div>
		</div>

        <label class="need">등록된 특정일</label>
        <ul class="scroll list-style"></ul>
    </div>
</div>

<div class="center" oncontextmenu="return false">
    <div class="popup-tit">
        <p>예약 시간 및 인원 설정</p>

        <div class="btn-area">
	   		<div class="select-box">						
	   			<select id="dateDayPop" name="dateDayPop">
	                <option value="1">월요일</option>
	                <option value="2">화요일</option>
	                <option value="3">수요일</option>
	                <option value="4">목요일</option>
	                <option value="5">금요일</option>
	                <option value="6">토요일</option>
	                <option value="0">일요일</option>
	   			</select>
	   			<div class="icon-arrow"></div>
	   		</div>
	   		
            <button type="button" class="copy-btn border-btn" onclick="getReserveDaySelect()">설정 불러오기</button>
        </div>
    </div>

    <div class="popup-con">
        <div class="table-pop">             
            <div class="tit-bg"></div>
            <div class="table scroll"></div>
        </div>
    </div>
</div>

<div class="right">
    <div class="popup-tit">
        <p>소분류 인원 설정</p>

        <div class="btn-area">
            <button type="button" class="basic blue-btn" onclick="popSpecSubList()">추가</button>
        </div>
    </div>

    <div class="popup-con">
        <div class="label-area">
            <label>[대메뉴]소분류</label>
            <label>인원</label>
            <label>시간</label>
        </div>

        <ul class="list scroll border-style"></ul>
        
        <div class="popup-btn">
            <button type="button" class="save-btn blue-btn" onclick="updateReservePop()">저장하기</button>
        </div>
    </div>
</div>

<script src="${sessionScope.path}/script/res/res001.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script src="${sessionScope.path}/script/res/res001Popup.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	getResDateList();
</script>