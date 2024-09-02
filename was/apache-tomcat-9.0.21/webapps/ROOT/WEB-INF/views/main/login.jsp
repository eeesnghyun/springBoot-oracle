<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Auto Codi :: LOGIN</title>		
	<link rel="stylesheet" type="text/css" href="/resources/style/main/login.css">
</head>
<body>
	<form action="/authenticate" method="post" onsubmit="return checkLogin();">
 		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
		
        <div class="login-back">
            <div class="login-wrap">                       
                <h1>Auto Codi</h1>
                <div class="info-text">ADMIN</div>

                <div class="login-box first-check">                
                    <fieldset>
                    	<label>
                    		<span>로그인</span>
                    		<input type="text" class="id-input" id="username" name="username" placeholder="아이디를 입력해 주세요.">
                    	</label>
                    	
             			<label>
           					<input type="password" class="pw-input" id="password" name="password" placeholder="비밀번호를 입력해 주세요.">
             			</label>      			
                        
                        <div class ="chk-box">
                       		<input type="checkbox" class="id-save" id="loginChk" onclick="checkedSave();">	
                        	<label for="loginChk" class="chk-txt">아이디저장</label> 
             			</div>       
             			
   			            <c:if test="${param.error eq 'invalid'}">
						    <p class="wrong">아이디 또는 비밀번호를 다시 확인해 주세요.</p>
             			</c:if>
             			<c:if test="${param.error eq 'account'}">
             				<p class="wrong">아이디 또는 비밀번호를 다시 확인해 주세요.</p>
             			</c:if> 
             			<c:if test="${param.error eq 'lock'}">
             				<p class="wrong">계정이 차단되어 있는 상태입니다. <br>병원 관리자에게 문의해 주세요.</p>
             			</c:if>    
             			<c:if test="${param.error eq 'review'}">
             				<p class="wrong">승인이 진행 중입니다. <br>병원 관리자에게 문의해 주세요.</p>
             			</c:if>       	          			
                    </fieldset>
                    
                    <button type="submit" class="btn-login">로그인</button>           
                    
                    <div class="join-txt">계정이 없으신가요? <span onclick="location.href='/join'">회원가입</span></div>
                </div>
            </div>
        </div>
	</form>	    
	<script>	
	function checkLogin() {
		const id = document.getElementById('username');
		const pw = document.getElementById('password');
		
		if (id.value == "") {
			alert("아이디를 입력해 주세요.");
			id.focus();
			id.classList.add("active");
			
			return false;			
		}
		
		if (pw.value == "") {
			alert("비밀번호를 입력해 주세요.");
			pw.focus();
			pw.classList.add("active");
			
			return false;
		}

	    if (document.getElementById('loginChk').checked) {
	    	setCookie("userInputId", id.value, 7);
	    }
	}
	
	function checkedSave() {
		if (document.getElementById('loginChk').checked) {
	    	setCookie("saveID", "checked", 7);
	    } else {
	    	deleteCookie("saveID");
	    }
	}
	
	function setCookie(cookieName, value, exdays) {
	    const exdate = new Date();
	    exdate.setDate(exdate.getDate() + exdays);
	    
	    const cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());	    
	    document.cookie = cookieName + "=" + cookieValue;
	}
	 
	function deleteCookie(cookieName) {
		const expireDate = new Date();	    
	    expireDate.setDate(expireDate.getDate() - 1);
	    
	    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
	}
	 
	function getCookie(cookieName) {
	    cookieName = cookieName + '=';
	    
	    const cookieData = document.cookie;
	    let start = cookieData.indexOf(cookieName);
	    let cookieValue = '';
	    
	    if (start != -1) {
	        start += cookieName.length;
	        
	        let end = cookieData.indexOf(';', start);	        
	        if (end == -1) end = cookieData.length;
	        
	        cookieValue = cookieData.substring(start, end);
	    }
	    
	    return unescape(cookieValue);
	}

	document.addEventListener("DOMContentLoaded", function() {
        sessionStorage.clear();
		
		const id = getCookie("userInputId");
	    
		document.getElementById('username').value = id;       
		
		const checkBox = getCookie('saveID');
		
		if (checkBox == "checked") {
			document.getElementById('loginChk').checked = true;
		}
		
		checkedSave();
	});
	</script>
</body>
</html>