<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
   
<section id="sideMenu">
    <div class="side-menu">
        <div class="logo" onclick="location.href='/'">
        	<h2>Auto Codi</h2>
            <p class="shop-name">ADMIN</p>
        </div>

        <div class="menu"></div>
    </div>
</section>
	            
<div id="pushMenu">
	<div class="push-area alert hide">
		<div class="push-tit">
			<p>예약 알림 설정</p>
			
			<div class="toggle toggle-knob">
	            <input type="checkbox" id="webPush" class="toggle-checkbox web-push" onclick="updateWebPushYn(this)">
	            <label class="toggle-btn" for="webPush">
	                <span class="toggle-feature"></span>
	            </label>
	        </div>
		</div>
		<p>예약 신청/변경이 접수되었을 경우 <br/>알림을 받을 수 있도록 설정합니다.</p>
	</div>
	
	<div class="push-icon">
		<a class="push-alarm hide"><i></i></a>
		<a class="go-direct" target="_blank"><i></i></a>
	</div>
</div>
<script src="/resources/script/main/menu.js"></script>
<script>	
	window.addEventListener('DOMContentLoaded', function(){		
		<%-- 메뉴조회 --%>
		menuList();		
		
		const page = location.pathname;
		
		if (!isNullStr(page)) {
			document.querySelectorAll(".menu > div").forEach(function(el){ 		    		    
				const div = el.lastChild.childNodes;
			    
			    for (let i = 0; i < div.length; i++) {		        
			        const a = div[i].getElementsByTagName("a")[0];
			        
			        if (!isNullStr(a)) {
			        	if (a.dataset.url === page.substring(0, 11)) {
			        		const menu = a.parentNode.parentNode.previousSibling;
			        		menu.getElementsByTagName("button")[0].click();
			        		a.parentElement.classList.add('active');
			        		
			        		break;
			        	}
			        }		        
			    }		    
			});	
		}	
		
		<%-- 홈페이지 바로가기 경로 --%>
		const params = {
			"hospitalCode" : '<c:out value="${sessionScope.hospitalCode}"/>',
			"officeCode"   : '<c:out value="${sessionScope.officeCode}"/>'
		};
		
		commonAjax.call("/menu/getOfficeSite", "POST", params, function(data){
			if (data.message == "OK") {
				document.querySelector('a.go-direct').setAttribute('href' , data.result);
			}
		});
		
		<%-- 예약 알림 설정 팝업 --%>
		if ('<c:out value="${sessionScope.webPushYn}"/>' == 'N') {
			document.querySelector(".web-push").checked = true;
			document.querySelector("a.push-alarm").classList.remove('active');
		} else {
			document.querySelector("a.push-alarm").classList.add('active');
		}
		
		const area = document.querySelector(".push-area");
		document.querySelector("a.push-alarm").addEventListener('click' , function() {
			if (area.classList.contains('active')) {
				area.classList.remove('active');	
			} else {
				area.classList.add('active');
			}
		});
	});
	
	<%--
		2022.05.27 LSH
	    뒤로가기시 commonGoPage 함수를 통해 히스토리에 쌓인 페이지로 이동한다. 
	--%>
	window.onpopstate = function(event) {		
		window.location = document.location.href;
	}
</script>