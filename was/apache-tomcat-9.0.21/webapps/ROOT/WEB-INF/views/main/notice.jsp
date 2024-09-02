<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="/resources/plugins/editor/spectrum.min.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="${sessionScope.path}/style/main/notice.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="notice-page">
    <div class="top-area">
        <div class="tit"> 편하게 문의해 주세요:)</div>
        <span class="cs-time">평일 09:00 ~ 18:00</span>
        <div class="cs-wrap">
            <div class="cs-con">
                <div class="cs-icon"></div>
                <div>전화상담</div>
                <div>02-6735-7775</div>
            </div>

            <div class="cs-con">
                <div class="cs-icon"></div>
                <div>원격지원</div>
                <div>cs@winwinlab.co.kr</div>
            </div>

            <div class="cs-con">
                <div class="cs-icon"></div>
                <div>카카오톡 상담</div>
                <div>오토코디 담당 마케터</div>
            </div>
        </div>    
    </div>

    <div class="bottom-area">
        <div class="title">전체</div>
        
        <div class="tabs">
            <div class="tab active" data-index="1" data-type="" 	  onclick="goPage(this)">전체보기</div>
            <div class="tab" 		data-index="1" data-type="notice" onclick="goPage(this)">공지사항</div>
            <div class="tab"		data-index="1" data-type="update" onclick="goPage(this)">업데이트</div>
            <div class="tab" 		data-index="1" data-type="qa" 	  onclick="goPage(this)">자주 묻는 질문</div>
        </div>

        <div class="search-area">
            <div class="select-box">
            	<select id="view">
            		<option value="">전체</option>
            		<option value="title">제목</option>
            		<option value="content">내용</option>
            	</select>
            	
            	<div class="icon-arrow"></div>
            </div>
            
            <div>
            	<input type="text" id="field" autocomplete='off' placeholder="검색어를 입력해 주세요." onkeyup="enterKey()">
            	<button></button>
            </div>
        </div>

        <div class="acc-wrap" id="accWrap"></div>
        
        <div class="bottom-btn-area">
	        <div class="pagination">
	         	<button type="button" class="btn-prev-page"  onclick="pageBtnClick('prev');">Prev</button>
	         	<div class="page-wrap"></div> 
	        	<button type="button" class="btn-next-page" onclick="pageBtnClick('next');">Next</button>
	   		</div>
	   		
	   		<button class="save-btn blue-btn" type="button" onclick="location.href='/noticeSave'">작성하기</button>
   		</div>
    </div>
</div>
<script src="${sessionScope.path}/script/main/notice.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	getNoticeList();
</script>