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
	<title>Auto Codi :: 회원가입</title>		
	<link rel="stylesheet" type="text/css" href="/resources/style/main/login.css">
	
	<%-- csrf token --%>
	<meta id="_csrf" name="_csrf" content="${_csrf.token}" />
	<meta id="_csrf_header" name="_csrf_header" content="${_csrf.headerName}" />
</head>
<body>
	<form>
		<div class="login-back">
	          <div class="login-wrap">                       
	              <h1>Auto Codi</h1>
	              <div class="info-text">ADMIN</div>
	
	              <div class="login-box join-area">                
	                  <fieldset>
	                 		<h2>회원가입 신청</h2>
	         				<p>회원가입을 신청 후 관리자의 승인이 있을 경우<br/>최종으로 회원가입이 완료됩니다.</p>
	          		
	                  	<div>
	                  		<label class="need">아이디</label>
	                  		<input type="text" class="name-input" id="sysUserId" name="sysUserId" placeholder="아이디를 입력해 주세요." autocomplete="off">
	                  	</div>
	                  	
	           			<div>
	       			        <label class="need">이름</label>	
	       					<input type="text" class="id-input" id="sysName" name="sysName" placeholder="이름을 입력해 주세요." autocomplete="off">
	           			</div>    
	           			
	      			     <div>
	       			        <label class="need">비밀번호</label>	
	       					<input type="password" class="pw-input" id="password" name="password" placeholder="비밀번호를 입력해 주세요." autocomplete="off">
	   					    <input type="password" class="pw-input" id="sysUserPw" name="sysUserPw" placeholder="비밀번호를 재입력해 주세요." autocomplete="off">
	           			</div>      
	            			
	            		<div>
	            			<label class="need">휴대폰 번호</label>	
		                   	<div>
	                			<input type="text" class="mobile-input alert_place" id="sysMobile" name="sysMobile" placeholder="휴대폰 번호 입력" maxlength="11" onkeyup="this.value = this.value.replace(/[^0-9]/g,'');" autocomplete="off">
	           		            <small class="access-btn send-access active" onclick="joinSmsSend()">인증요청</small>
		                   	</div>
	                   	
	            			<div>
	       						<input type="text" class="access-input alert_place" id="authNumber" name="authNumber" placeholder="인증번호 입력" autocomplete="off">
	           		            <small class="access-btn check-access" onclick="confirm()">인증확인</small>
	           		            <span id="timer"></span>	
	            			</div>     
	            			
	          			    <div class="resend-txt">인증번호를 받지 못하셨나요? <span onclick="joinSmsSend()">재발송</span> <span onclick="otherSmsSend()">다른번호 인증</span></div>   	 			          			             			
	                   </div>	
	           			
	           			<div class="location-area">
	       			        <label class="need">병원</label>	
							<div class="select-area">
								<div class="select-box">   							
						   			<select id="hospitalCode" onchange="getJoinOffice(this.value)"></select>
						   			<div class="icon-arrow"></div>
						   		</div>
								<div class="select-box">   							
						   			<select id="officeCode"></select>
						   			<div class="icon-arrow"></div>
						   		</div>
							</div>
	           			</div>     
	           			
	       			    <div class="position-area">
	   			    		<label class="need">직책</label>		
							<div class="select-area">
								<div class="select-box">   							
						   			<select id="position"></select>
						   			<div class="icon-arrow"></div>
						   		</div>
							</div>
	           			</div>     			         			             			
	                  </fieldset>
	                  
	                  <button type="button" class="btn-login" onclick="insertOfficeUser()">신청 완료</button>           
	              </div>
	            
			<div class="copy">
	                	<span>© 2022 </span><span>WINWINLAB</span> 
	              </div>
	          </div>
	      </div>        
	</form>
	
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
	        		otherSmsSend();
	        	}
	        }	
	    }
	}

	function stopTimer(stop) {
		isStop = stop;
	}
	
	function getJoinHospital(){
		commonAjax.call("/join/getHospital", "POST", "", function(data) {
			const result = data.resultList;		

			if (data.message == "OK") {
				if (result.length > 0) {				
					let dataList = new Array();
					let comboObj;
					
					for (idx in result) {				
				        let data = new Object();
				         
				        data.code = result[idx].hospitalCode;
				        data.name = result[idx].hospitalName;

						dataList.push(data);
					}
					
					comboObj = {"target" : "hospitalCode", "data" : dataList , "defaultOpt" : "병원명 전체"};				
					commonInitCombo(comboObj);	
					
					getJoinOffice(result[0].hospitalCode);
				}						
			}
		});
	}
	
	function getJoinOffice(value) {	
		commonAjax.call("/join/getOffice", "POST", {"hospitalCode" : value}, function(data) {
			const result = data.resultList;				
			
			if (data.message == "OK") {
				let dataList = new Array();
				let comboObj;
				
				for (idx in result) {				
			        let data = new Object();
			         
			        data.code = result[idx].officeCode;
			        data.name = result[idx].officeLocation;

					dataList.push(data);
				}			
		
				comboObj = {"target" : "officeCode", "data" : dataList , "defaultOpt" : "병원위치 전체"};	
				commonInitCombo(comboObj);
			}			
		});
	}

	function joinSmsSend(){
		const mobile = document.getElementById('sysMobile');
		
		if (isNullStr(mobile.value)) {
			alert('휴대폰 번호를 입력해 주세요.');
			return;
		}
		
		if (mobile.value.length < 11) {
			alert('휴대폰 번호를 확인해 주세요.');
			return;
		}
		
		commonAjax.call("/sys/sendSms", "POST", {"sysMobile" : mobile.value, "code": "join"}, function(data){
			if (data.message == "OK") {
				document.getElementById('sysMobile').disabled = true;
			  	document.querySelector('.send-access').classList.remove('active');
				document.querySelector('.check-access').classList.add('active');
				
				drawTimer("#timer", 180);
			}
		});	
	}
	
	function otherSmsSend() {
		stopTimer(true);
		
		setTimeout(function() {
			document.getElementById("timer").innerText = "";
			document.getElementById('sysMobile').disabled  = false;
			document.getElementById('authNumber').disabled = false;
			document.getElementById('authNumber').value = '';
		  	document.querySelector('.send-access').classList.add('active');
			document.querySelector('.check-access').classList.remove('active');
		}, 1000);	
	}
	
	function confirm(){
		const mobile = document.getElementById('sysMobile').value;
		
		const params = {
			"mobile"     : document.getElementById('sysMobile').value,
			"authNumber" : document.getElementById('authNumber').value
		}
		
		commonAjax.call("/sys/confirm", "POST", params, function(data){
			if (data.message == "OK") {
				stopTimer(true);
				
				setTimeout(function() {
					document.getElementById("timer").innerText = "";
					document.querySelector('.check-access').classList.remove('active');
					document.getElementById('authNumber').disabled = true;
				}, 1000);	
			} else {
				alert('인증번호를 다시 확인해 주세요.');
				document.getElementById('authNumber').classList.add('active');
			}
		});	
	}
	
	function checkJoin() {
		const sysUserId   = document.getElementById('sysUserId');
		const password    = document.getElementById('password');		
		const sysUserPw   = document.getElementById('sysUserPw');	
		const authNumber  = document.getElementById('authNumber');	
		const inputs    = document.querySelectorAll('input');
		const check     = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣~!@#$%^&*()_+|<>?:{}]/;
		
		//인풋 빈값 체크
		for (let i = 0; i < inputs.length; i++) {
			if (isNullStr(inputs[i].value)) {
				if (!inputs[i].classList.contains('alert_place')) {
					alert(inputs[i].placeholder);	
				} else {
					alert(inputs[i].placeholder.replace(' 입력' , '') + '를 입력해 주세요.');
				}
				
				inputs[i].focus();
				inputs[i].classList.add('active');
				return
			}
		}
		
		//비밀번호 체크
		if (password.value != sysUserPw.value) {
			alert('비밀번호를 확인해 주세요.');	
			sysUserPw.focus();
			sysUserPw.classList.add('active');
			return;
		}
		
		//비밀번호 최소 8자 체크
		if (sysUserPw.value.length < 8) {
			alert('비밀번호는 최소 8자리 이상입니다.');	
			sysUserPw.focus();
			sysUserPw.classList.add('active');
			return;
		}
		
		//아이디 최소 3글자 (한글 포함X)
		if (sysUserId.value.length < 4 || check.test(sysUserId.value)) {
			alert('아이디는 최소 4글자 이상입니다.\n영문, 숫자만 가능합니다.');
			sysUserId.focus();
			sysUserId.classList.add('active');
			return;
		}
		
		//인증번호 체크
		if (authNumber.disabled != true) {
			alert('인증번호를 확인해 주세요.');
			authNumber.focus();
			authNumber.classList.add('active');
			return;
		}
		
		//병원 체크
		if (isNullStr(hospitalCode.value)) {
			alert('병원명을 선택해 주세요.');
			hospitalCode.focus();
			hospitalCode.classList.add('active');
			return;
		}
		
		//병원위치 체크
		if (isNullStr(officeCode.value)) {
			alert('병원위치를 선택해 주세요.');
			officeCode.focus();
			officeCode.classList.add('active');
			return;
		}
		
		//직책 체크
		if (isNullStr(position.value)) {
			alert('직책을 선택해 주세요.');
			position.focus();
			position.classList.add('active');
			return;
		}
		
		return true;
	}
	
	function insertOfficeUser() {
		if (checkJoin()) {			
			const params = {
				"hospitalCode" : document.getElementById('hospitalCode').value,
				"officeCode"   : document.getElementById('officeCode').value,
				"sysPosition"  : document.getElementById('position').value,			
				"sysUserId"    : document.getElementById('sysUserId').value,
				"sysName"      : document.getElementById('sysName').value,
				"sysMobile"    : document.getElementById('sysMobile').value,
				"sysUserPw"    : document.getElementById('sysUserPw').value				
			};
			
 			commonAjax.call("/join", "POST", params, function(data){
				if (data.message == "OK") {
					alert('병원 관리자의 승인 후 최종으로 회원가입이 완료됩니다.\n회원가입이 완료되면 알림이 전송됩니다.');
					location.href = '/login';
				} else {
					alert(data.message);
				}
			});
		}
	}
	
	document.addEventListener("DOMContentLoaded", function() {
		var timer;
		var count = 0;
		var isStop = false;
		
		//직책 그리기
		const comboObj = {"target" : "position", "code" : "POS001", "defaultOpt" : "직책 선택"};			
		commonCodeList(comboObj);
		
		//병원코드 그리기
		getJoinHospital();
	});
	</script>
</body>
</html>