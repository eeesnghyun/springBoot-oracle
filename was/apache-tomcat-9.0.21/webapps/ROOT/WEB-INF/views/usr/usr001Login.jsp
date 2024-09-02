<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<link rel="stylesheet" href="${sessionScope.path}/style/usr/usr001.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="/resources/plugins/grid/tabulator/tabulator_semanticui.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<div class="body-container">
	<div class="top">
	    <div class="tit">
	        <h2>계정 관리</h2>
	        <p>병원에서 사용하는 계정을 관리할 수 있습니다.</p>
	    </div>  
	</div>
	
	<div class="col0">	   	   	   	
	   	<div class="tit-bar id"><span><c:out value="${name}"/><c:out value="(${id})"/></span>님의 전체 로그인 기록입니다. (날짜+시간/브라우저/IP)</div>
	   	<div id="divLogGrid"></div>
	</div>
</div>

<script>
	function getUserLog() {
	    commonAjax.call("/sys/getLogSysUserLogin", "POST", {"sysUserId" : '<c:out value="${id}"/>'}, function(data) {
	    	const result = data.resultList;	        	
	        
	    	if (data.message == "OK") {
				const today = commonGetToday("y년m월d일");
				const printIcon = function(cell, formatterParams){ //plain text value
	        	    return "/";
	        	};
	        	
	        	//Grid draw
				var grid = new Tabulator("#divLogGrid", {
					layout: "fitDataStretch",
					headerVisible: false, //hide header
					placeholder: "해당 데이터가 없습니다.",
					pagination: "local",
	    			paginationSize: 15,
    				maxHeight:"100%",			
				    columns: [
				    	{title: "로그인일시" , field: "loginDate", formatter: function(cell, formatterParams) {
							const value = cell.getValue();
							
			    	        if (value.indexOf(today) > -1) {
			    	            return "<span style='color: red;'>" + value + "</span>";
			    	        } else {
			    	            return value;
			    	        }
			    	    }},
			    	    {formatter: printIcon, maxWidth: 10, hozAlign: "center"},
				    	{title: "브라우저"	 , field: "browser"},
				    	{formatter: printIcon, maxWidth: 10, hozAlign: "center"},
				    	{title: "접속IP"	 , field: "accessIp"}
				    ]			  
				});
	
				//Data set
				grid.on("tableBuilt", function(){				
					grid.setData(result);			    				
				});	
	    	}	    		
	    });
	}

	getUserLog();
</script>	