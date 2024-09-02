<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />
    
<link rel="stylesheet" href="/resources/plugins/swiper/swiper-bundle.min.css" type="text/css"/> 
<link rel="stylesheet" href="${sessionScope.path}/style/pge/pge004.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<form id="frm" action="/pge/updateIntro" method="post">
	<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
	
	<div class="main-btn">
	    <button class="save-btn blue-btn" type="button" onclick="checkSave()">저장하기</button>
	</div>
	    
	<div class="body-container">
		<div class="top">
		    <div class="tit">
		        <h2>소개 관리</h2>
		        <p>병원소개에서 보이는 소개 내용을 관리할 수 있습니다.</p>
		    </div>
			
			<%-- 본사 관리자만 조회 --%>
	   		<sec:authorize access="hasRole('ROLE_WWL')">
		    	<button class="load-btn dark-btn" type="button" onclick="drawPopup()">불러오기</button>
		    </sec:authorize>
		</div>
		
		<%-- 기본 정보 --%>
		<div class="col0">
		    <div class="con">
		        <%-- 본사 관리자만 조회 --%>
	   			<sec:authorize access="hasRole('ROLE_WWL')">
			   		<div class="select-box">
			   			<label for="hospitalCode">병원</label>	   							
			   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'getHomeIntro')"></select>
			   			<div class="icon-arrow"></div>
			   		</div>
			   		
			   		<div class="select-box">
			   			<select id="officeCode" class="small" name="officeCode" onchange="getHomeIntro()"></select>
			   			<div class="icon-arrow"></div>
			   		</div>
			    </sec:authorize>
			    
			    <%-- 지점 관리자, 직원인 경우 조회 --%>
			    <sec:authorize access="hasRole('ROLE_ADMIN')">
			   		<div class="select-box">
			   			<label for="hospitalCode">병원</label>	   							
			   			<input type="text" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
			   			<input type="hidden" id="hospitalCode" name="hospitalCode">
			   		</div>
			   		
			   		<div class="select-box">		   			
			   			<input type="text" class="small" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
			   			<input type="hidden" id="officeCode" name="officeCode">
			   		</div>
			    </sec:authorize>
		
		        <div class="page-address">
		            <p>홈페이지 주소</p>
		            <a class="page-url" id="homePageUrl"></a>
		        </div>
		    </div>
		</div>
		
		<%-- 병원소개 --%>
		<div class="col1 col">
		    <div class="tit-bar">병원소개</div>
		
		    <div class="contents">
		        <input type="text" class="eng h4" name="headerTitle1" placeholder="메인타이틀" data-object>
		        <input type="text" class="span" name="headerTitle2" placeholder="서브타이틀" data-object>
		        <hr>

		        <div class="file-upload">
		            <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
		            <input type="hidden" name="headerImage" data-object/>
		            <i class="icon"></i>
		            
		            <img src="" alt="소개이미지" style="display: none;" data-object>
		            
                    <div class="resolution">이미지해상도 (1200 x auto)</div>
		        </div>
		
		        <div class="txt">
		            <input type="text" class="p" name="headerContent1" placeholder="설명타이틀" data-object>
		            <textarea class="span" name="headerContent2" placeholder="설명내용" data-object></textarea>
		        </div>
		    </div>
		</div>
		
		<div class="col1 col">
		    <div class="contents">
		        <input type="text" class="eng h4" name="bottomTitle1" placeholder="메인타이틀" data-object>
		        <input type="text" class="span" name="bottomTitle2" placeholder="서브타이틀" data-object>
		        <hr>
		
		        <div class="file-upload">
		            <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" accept="image/*" data-object/>
		            <input type="hidden" name="bottomImage" data-object/>
		            <i class="icon"></i>
		            
		            <img src="" alt="소개이미지" style="display: none;" data-object>
		            
                    <div class="resolution">이미지해상도 (1200 x auto)</div>
		        </div>
		
		        <ul class="txt">
		            <li>
		                <input type="text" class="p-small" name="bottomContent1" placeholder="설명타이틀" data-object>
		                <textarea class="span-small" name="bottomContent2" placeholder="설명내용" data-object></textarea>
		            </li>
		
		            <li>
		                <input type="text" class="p-small" name="bottomContent3" placeholder="설명타이틀" data-object>
		                <textarea class="span-small" name="bottomContent4" placeholder="설명내용" data-object></textarea>
		            </li>
		
		            <li>
		                <input type="text" class="p-small" name="bottomContent5" placeholder="설명타이틀" data-object>
		                <textarea class="span-small" name="bottomContent6" placeholder="설명내용" data-object></textarea>
		            </li>
		        </ul>
		    </div>
		</div>
	</div> 
</form>

<script src="${sessionScope.path}/script/pge/pge004.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>

