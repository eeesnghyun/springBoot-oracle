<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<%-- csrf token --%>
	<meta id="_csrf" name="_csrf" content="${_csrf.token}" />
	<meta id="_csrf_header" name="_csrf_header" content="${_csrf.headerName}" />
	<meta name="robots" content=”noindex, nofollow">
	
	<title>Auto Codi :: ADMIN</title>
	
	<%-- jquery 3.6 --%>
	<script src="/resources/plugins/jquery-3.6.0.min.js"></script>
	
	<%-- 공통 함수 --%>
	<script src="${sessionScope.path}/script/common/common.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
	
	<%-- 그리드 컴포넌트 : Tabulator 5.1 --%>
	<script src="/resources/plugins/grid/tabulator/tabulator.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"/></script>
	
	<%-- Datepicker --%>
	<link rel="stylesheet" type="text/css" href="/resources/plugins/airdatepicker/datepicker.min.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"/>
	<script src="/resources/plugins/airdatepicker/datepicker.min.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
	<script src="/resources/plugins/airdatepicker/datepicker.en.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
	
	<%-- 공통 CSS --%>
	<link rel="stylesheet" type="text/css" href="${sessionScope.path}/style/main/menu.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">	
	<link rel="stylesheet" type="text/css" href="${sessionScope.path}/style/common/common.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
	
</head>
<body>	
	<header>
		<tiles:insertAttribute name="header"/>
	</header>

	<div>
		<tiles:insertAttribute name="left"/>
	</div>
	
	<div class="main">
		<%-- 로딩창 --%>		
		<div id="loadingWrap">
			<div class="loading">
				<div class="bounceball"></div>
				<div class="text eng">NOW LOADING</div>
			</div>
		</div>
		
		<div class="container scroll" id="main">	
			<tiles:insertAttribute name="body"/>	
		</div>	
		
		<p class="copy">
			© 2022 <span>WINWINLAB</span> CO.LTD. ALL RIGHTS RESERVED.		
			<span style="display: none"><%=session.getId() %></span>	
		</p>		
	</div>     
	
	<div class="popup">
	    <div class="popup-overlay" onclick="popupClose()"></div>
	    <div class="popup-inner">
        	<div class="del-btn" onclick="popupClose()"></div>
        	
        	<div id="popupInner"></div>
	    </div>
	</div>
	
	<div class="sub-pop">
	    <div class="popup-overlay" onclick="subPopupClose()"></div>
	    <div class="popup-inner">
        	<div class="del-btn" onclick="subPopupClose()"></div>
        	
        	<div id="popupInner"></div>
	    </div>
	</div>
			
	<%-- fcm 관련 함수 --%>
	<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
	<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"></script>		
	<script src="${sessionScope.path}/script/common/fcm.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>	
	<script>		
		//팝업닫기(공통)
		function popupClose() {
			const parent = document.querySelector('.popup');		
			const inner = document.querySelector('.popup-inner');
		    parent.classList.remove('active');
		    
		    parent.querySelector('#popupInner').innerHTML = "";
		    parent.querySelector('#popupInner').setAttribute("class", "");
		   	isPop = false;
		   	isClick = true;
		   	
			document.querySelector('body').classList.remove('no-scroll');
			
			//예약리스트 관리(희망예약일 변경)
			if (inner.classList.contains('all')) {
				inner.classList.remove('all');
				document.querySelector('.popup-con.all-sub').remove();	
			}
		}
		
		//팝업닫기(서브)
		function subPopupClose() {
			const parent = document.querySelector('.sub-pop');		    	
		    parent.classList.remove('active');
		    parent.querySelector('#popupInner').setAttribute("class", "");
		    parent.querySelector('#popupInner').innerHTML = "";

		   	subPop = false;
		   	isClick = true;
		}
		
		initWebPush(); //웹 푸시 관련 초기 함수
	</script>
</body>
</html>