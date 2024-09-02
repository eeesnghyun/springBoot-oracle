<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<link rel="stylesheet" href="${sessionScope.path}/style/sys/sys006.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>가맹문의</h2>
	        <p>가맹문의로 접수된 문의 리스트입니다.</p>
	    </div>
	</div>
	
   	<div class="sys006">
	    <div class="tab-tit">
	        <ul>
	            <li class="btn-tab active">신규개원<p class="inquire-count new-cnt"></p></li>
	            <li class="btn-tab">이전문의<p class="inquire-count move-cnt"></p></li>
	        </ul>
	    </div>

        <div class="tab-con">
        	<div class="grid-area active" id="grid1"></div>
        	<div class="grid-area" id="grid2"></div>
        </div>
	</div>
</div>
    
<script src="${sessionScope.path}/script/sys/sys006.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script src="https://apis.google.com/js/api.js" onreadystatechange="if (this.readyState === 'complete') this.onload()"></script>
<script>
	init();
</script>