<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/sys/sys002.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<style>
	.tabulator-row {
		padding: 0px 10px 0px 30px!important;
	}
	.popup-inner .select-box {
	    margin-bottom: 20px;
	}
</style>
<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>관리자 메뉴 관리</h2>
	        <p>어드민 메뉴를 추가, 삭제할 수 있습니다.</p>
	    </div>
	    
	    <div class="btn-tit">
       	    <button class="load-btn dark-btn" type="button" onclick="commonDrawPopup('load','/sys/sys004Auth');">메뉴 권한 부여</button>
	    	<button class="add-mts-btn dark-btn" type="button" onclick="drawPopup()">메뉴 추가</button>
	    </div>
	</div>
	
	<div class="col">		
	  	<div id="divGrid"></div>	  	
	</div>
</div>

<script src="${sessionScope.path}/script/sys/sys004.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	getSysMenu();
</script>	