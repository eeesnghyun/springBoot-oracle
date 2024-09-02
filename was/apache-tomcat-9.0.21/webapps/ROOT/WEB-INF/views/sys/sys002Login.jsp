<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div>	   	  	
   	<div id="divLogGrid"></div>
</div>

<script>
	var gridSys002L = null;

	function getUserLog() {
		const titBar = document.querySelector('.tit-bar');
		titBar.innerHTML = `<span>${sysUser}</span>님의 전체 로그인 기록입니다. (날짜+시간/브라우저/IP)`;
		titBar.classList.add('id');		
		
	    commonAjax.call("/sys/getLogSysUserLogin", "POST", {"sysUserId" : '<c:out value="${sysUserId}"/>'}, function(data) {
	    	const result = data.resultList;
	        
	        if (data.message == "OK") {
	        	const today = commonGetToday("y년m월d일");
	        	const printIcon = function(cell, formatterParams){ //plain text value
	        	    return "/";
	        	};
	        	
	        	if (isNullStr(gridSys002L)) {
	        		//Grid draw
					gridSys002L = new Tabulator("#divLogGrid", {
						layout: "fitDataStretch",
						headerVisible: false, //hide header
						pagination: "local",
		    			paginationSize: 15,
						placeholder: "해당 데이터가 없습니다.",
	    				maxHeight:"100%",			
					    columns: [
					    	{title: "로그인일시" , field: "loginDate",resizable:false , formatter: function(cell, formatterParams) {
					    		const value = cell.getValue();
								
				    	        if (value.indexOf(today) > -1) {
				    	            return "<span style='color: #ff5454;'>" + value + "</span>";
				    	        } else {
				    	            return value;
				    	        }
				    	    }},
				    	    {formatter: printIcon, maxWidth: 10, hozAlign: "center"},
					    	{title: "브라우저"	 , field: "browser"  ,resizable:false},
					    	{formatter: printIcon, maxWidth: 10, hozAlign: "center"},
					    	{title: "접속IP"	 , field: "accessIp" ,resizable:false}
					    ]			  
					});
		
					//Data set
					gridSys002L.on("tableBuilt", function(){				
						gridSys002L.setData(result);			    				
					});
	        	} else {
	        		gridSys002L.replaceData(result);
	        	}
	        	
	        }
	    });		    
	}
	
	history.pushState(null, null, '/sys/sys002');
	
	getUserLog();
</script>	