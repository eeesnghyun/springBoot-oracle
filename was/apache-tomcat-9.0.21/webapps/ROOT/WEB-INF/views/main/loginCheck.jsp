<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="today" value="<%=new java.util.Date()%>" />

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Auto Codi :: LOGIN</title>		
	<link rel="stylesheet" type="text/css" href="/resources/style/main/login.css">
	
	<%-- csrf token --%>
	<meta id="_csrf" name="_csrf" content="${_csrf.token}" />
	<meta id="_csrf_header" name="_csrf_header" content="${_csrf.headerName}" />
</head>
<body>	
	<input type="hidden" id="sysUserId" value='<c:out value="${sysUserId}"/>'/>
	
	<c:choose>
		<c:when test="${empty param.auth}">
			<%-- 로그인 2차 인증 페이지 --%>
			<form action="/authenticate" method="post">		
				<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />	
		        <div class="login-back">
		            <div class="login-wrap">                       
		                <h1>Auto Codi</h1>
		                <div class="info-text">ADMIN</div>
		                
		                <div class="login-box second-check">
		            		<h2>로그인 2차 인증</h2>
		            		<p>보안을 위해 2차인증이  설정되어 있습니다.<br/>휴대폰 번호에 전송된 인증번호를 입력해 주세요.</p>
		            		
		      		        <fieldset>
		                    	<label>
		                    		<span>휴대폰 번호</span>
		                    		<span>
		                    			<input type="text" class="mobile-input" id="sysMobile" name="sysMobile" value='<c:out value="${sysMobile}"/>' disabled>
		               		            <small class="access-btn send-access active" onclick="loginSmsSend()">인증요청</small>
		                    		</span>
		                    	</label>
		                    	
		             			<label>
		             			    <span>
		           						<input type="text" class="access-input" id="authNumber" name="authNumber" placeholder="인증번호 입력">
		               		            <small class="access-btn check-access" onclick="confirm()">인증확인</small>
		             		            <span id="timer"></span>	
		                    		</span>
		             			</label>      			          			             			
		                    </fieldset>
		            		
		        		    <button type="button" class="btn-login" onclick="confirm()">로그인</button>    
		            		                    
		       		        <div class="resend-txt">인증번호를 받지 못하셨나요? <span onclick="loginSmsSend()">재발송</span></div>     
		            	</div>
		              
						<div class="copy">
		                  	<span>© 2022 </span><span>WINWINLAB</span> 
		                </div>
		            </div>
		        </div>        
			</form>	    
		</c:when>
		<c:otherwise>
			<%-- 비밀번호 변경 페이지 --%>
			<form>
		        <div class="login-back">
		            <div class="login-wrap">                       
		                <h1>Auto Codi</h1>
		                <div class="info-text">ADMIN</div>
		            	
		            	<div class="login-box password-check">
		            		<h2>새로운 비밀번호를 입력해 주세요.</h2>
		            		
		   		        	<fieldset>
		                    	<label>
		                    		<span class="need">신규 비밀번호</span>	
		                    		<span>
		                    			<input type="password" class="pw-input" id="password" name="password" placeholder="신규 비밀번호 입력">
		                    		</span>
		                    	</label>
		                    	
		             			<label>
		             			    <span>
		           						<input type="password" class="pw-input" id="sysUserPw" name="sysUserPw" placeholder="신규 비밀번호 재입력">
		                    		</span>
		             			</label>      			          			             			
		                    </fieldset>
		            		
		        		    <button type="button" class="btn-login" onclick="checkPassword()">완료</button>    
		            	</div>
		              
						<div class="copy">
		                  	<span>© 2022 </span><span>WINWINLAB</span> 
		                </div>
		            </div>
		        </div>        
			</form>	  
		</c:otherwise>
	</c:choose>

	<script src="/resources/plugins/jquery-3.6.0.min.js"></script>
	<script src="/resources/script/common/common.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
	<script>	
	function drawTimer(target, time) {
	    clearInterval(timer);
	    
	    isStop = false;
	    count = time;
	    
	    timer = setInterval(function() {
	    	setTime(target);
	    }, 1000);
	}

	function setTime(target) {
	    count = count - 1;
	        
	    let minute = Math.floor(count / 60);
	    let second = count % 60; 
	    
	    if (minute < 10) minute = "0" + minute;    
	    if (second < 10) second = "0" + second;
	    
	    const divTimer = document.querySelector(target);
	    
	    if (isNullStr(divTimer)) {
	    	clearInterval(timer);
	    } else {
	    	divTimer.innerHTML = minute + ":" + second;
	        
	        if (count === 0 || isStop === true) {
	        	clearInterval(timer);

	        	if (count === 0) {
		        	window.history.back(); 
	        	}
	        }	
	    }
	}

	function stopTimer(stop) {
		isStop = stop;
	}
	
	function loginSmsSend(){
		const mobile = document.getElementById('sysMobile').value;
		
		commonAjax.call("/sys/sendSms", "POST", {"sysMobile" : mobile, "code": "login"}, function(data){
			if (data.message == "OK") {
			  	document.querySelector('.send-access').classList.remove('active');
    			
				drawTimer("#timer", 180);
			}
		});	
	}
	
	function confirm(){
		const mobile = document.getElementById('sysMobile').value;
		
		const params = {
			"mobile"     : document.getElementById('sysMobile').value,
			"authNumber" : document.getElementById('authNumber').value
		}
		
		commonAjax.call("/sys/confirm", "POST", params, function(data){
			if (data.message == "OK") {
				document.querySelector('form').submit();
				stopTimer(true);
			} else {
				alert('인증번호를 다시 확인해 주세요.');
				document.getElementById('authNumber').classList.add('active');
			}
		});	
	}
	
	function checkPassword () {
		const password  = document.getElementById('password');
		const sysUserPw = document.getElementById('sysUserPw');
		
		if (isNullStr(password.value) || isNullStr(sysUserPw.value)) {
			alert('비밀번호를 입력해 주세요.');
			
			if (isNullStr(password.value)) {
				password.focus();
				password.classList.add('active');
			} else {
				sysUserPw.focus();
				sysUserPw.classList.add('active');
			}
			
			return;
		}
		
		if (sysUserPw.value.length < 8) {
			alert('비밀번호는 최소 8자리 이상입니다.');	
			sysUserPw.focus();
			sysUserPw.classList.add('active');
			return;
		}
		
		if (password.value != sysUserPw.value) {
			alert('비밀번호를 확인해 주세요.');	
			sysUserPw.focus();
			
			sysUserPw.classList.add('active');
			return;
		}
		
		const param = {
			"sysUserPw" : sysUserPw.value,
			"sysUserId" : document.getElementById('sysUserId').value, 
			"resetPwYn" : 'N'
		}
		
		commonAjax.call("/usr/updateOfficeUser", "POST", param, function(data){
			if (data.message == 'OK') {
				location.replace('/');
			}
		});	
	}
	
	//비밀번호 변경 페이지일 경우 뒤로가기 막기
	if (!isNullStr('${param.auth}')) {			
		history.pushState(null, null, location.href);
		window.onpopstate = function(event) {
			history.go(1);
		};		
	}
	
	document.addEventListener("DOMContentLoaded", function() {
		var timer;
		var count = 0;
		var isStop = false;
	});
	</script>
</body>
</html>