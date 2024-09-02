<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/mbr/mbr003.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>칭찬 불만 관리</h2>
	        <p>홈페이지에 접수된 칭찬/불만을 확인할 수 있습니다.</p>
        </div>
    </div>
    
	<div class="col0">
	    <div class="con qna">
	  		<%-- 본사 관리자만 조회 --%>
   			<sec:authorize access="hasRole('ROLE_WWL')">
		   		<div class="select-box">
		   			<label for="hospital">병원</label>	   							
		   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, 'setParams')"></select>
		   			<div class="icon-arrow"></div>
		   		</div>
		   		
		   		<div class="select-box">
		   			<select id="officeCode" name="officeCode" onchange="setParams();"></select> 
		   			<div class="icon-arrow"></div>
		   		</div>
		    </sec:authorize>
		    
		    <%-- 병원 관계자인 경우 조회 --%>
		    <sec:authorize access="hasRole('ROLE_ADMIN')">
		   		<div class="select-box">
		   			<label for="hospital">병원</label>	   							
		   			<input type="text" value='<c:out value="${sessionScope.hospitalName}"/>' disabled="disabled">
		   			<input type="hidden" id="hospitalCode" name="hospitalCode">
		   		</div>
		   		
		   		<div class="select-box">		   			
		   			<input type="text" value='<c:out value="${sessionScope.officeLocation}"/>' disabled="disabled">
		   			<input type="hidden" id="officeCode" name="officeCode">
		   		</div>
		    </sec:authorize>
		    
		    <%-- 병원 사이트 주소 --%>		    
		    <div style="display: none"><a class="page-url"></a></div>
		    
		    <div class="date-area">		    
            	<label for="startDate">날짜</label>
            	<div class="area">
			        <div class="con date">
		       			<input type="text" class="start-date" id="startDate" name="startDate" placeholder="시작일" required autocomplete="off" maxlength="10">
			        </div>
			      
		       		<span class="wave">~</span>
		       		
		        	<div class="con date">
		       			<input type="text" class="end-date" id="endDate" name="endDate" placeholder="종료일" required autocomplete="off"  maxlength="10">
			        </div>
            	</div>
			</div>
	    </div>
	</div>
	
    <div class="voc-area">
        <div class="voc-table">
            <div class="voc-tit">
                <div>번호</div>
                <div>상태</div>
                <div>칭찬/불만 내역</div>
            </div>

			<div id="opinion"></div>
        	
        	<div class="pagination">
	         	<button type="button" class="btn-prev-page"  onclick="pageBtnClick('prev');">Prev</button>
	         	<div class="page-wrap"></div> 
	        	<button type="button" class="btn-next-page" onclick="pageBtnClick('next');">Next</button>
    		</div>
        </div>		
    	
    	<div class="right-box scroll" style="display: none;"></div>
	</div>
</div>

<script src="${sessionScope.path}/script/mbr/mbr003.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');
</script>