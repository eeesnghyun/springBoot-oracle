<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/psh/psh002.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<style>
.col0 {
    padding: 10px 40px 10px;
}
.col0 .area {
	margin-left: 0px;
}
</style>
<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>전체 시술 검색</h2>	     
	    </div>
	</div>
	
	<div class="col0">
		 <div class="con">
	   		<div class="select-box">
	   			<label for="hospitalCode">병원</label>	   							
	   			<select id="hospitalCode" name="hospitalCode" onchange="commonGetOffice(this.value, '')"></select>
	   			<div class="icon-arrow"></div>
	   		</div>
	   		
	   		<div class="select-box">
	   			<select class="small" id="officeCode" name="officeCode"></select>
	   			<div class="icon-arrow"></div>
	   		</div>
	   	</div>
	</div>
	
	<div class="col0">
		 <div class="con">		    
			<div class="area">
				<div class="search-box">
                	<input type="text" class="search" id="field" placeholder="코드 또는 상품명 검색">
                	<div class="icon-search"></div>
                </div>
				
				<label for="startDate">날짜</label>	
				<div class="con date">
					<input type="text" class="start-date" id="startDate" placeholder="시작일" autocomplete="off">
				</div>
				
				<span class="wave">~</span>
			
				<div class="con date">
					<input type="text" class="end-date" id="endDate" placeholder="종료일" autocomplete="off">
				</div>
			</div>
	    </div>
	</div>
	
	<div class="col0">		
	  	<div id="divGrid"></div>	  	
	</div>
	
	<div class="col0">
		 <div class="con">	   				    
			<div class="area">
				<div class="search-box">
                	<input type="text" class="search" id="field2" placeholder="코드 또는 상품명 검색">
                	<div class="icon-search"></div>
                </div>
				
				<label for="startDate">날짜</label>	
				<div class="con date">
					<input type="text" class="start-date" id="startDate2" placeholder="시작일" autocomplete="off">
				</div>
				
				<span class="wave">~</span>
			
				<div class="con date">
					<input type="text" class="end-date" id="endDate2" placeholder="종료일" autocomplete="off">
				</div>
			</div>
	    </div>
	</div>
	
	<div class="col0">		
	  	<div id="divGridE"></div>	  	
	</div>
</div>

<script src="${sessionScope.path}/script/sys/sys005.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	initSelect('<c:out value="${sessionScope.hospitalCode}"/>', '<c:out value="${sessionScope.officeCode}"/>');	
</script>	