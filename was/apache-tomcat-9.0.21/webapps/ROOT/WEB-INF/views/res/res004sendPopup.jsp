<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<link rel="stylesheet" href="/resources/style/res/res004.css" type="text/css"/>
<style>
	.popup-inner {
		padding:0;
	}
	.del-btn {
		display:none;
	}
	.send-popup {
		width:370px;
	}
	.send-popup .send-wrap {
		padding:40px;
	}
	.send-popup .send-popup-btn {
		display:flex;
		flex-wrap:nowrap;
		align-items:center;
		width:290px;
		height:50px;
		border-radius:4px;
		color:#444;
		font-size:14px;
		border: 1px solid #ccc;
		margin-bottom:14px;
		padding: 0 15px 0 20px;
		cursor:pointer;
	}
	.send-popup .send-popup-btn:last-of-type {
		margin-bottom:0;
	}
	.send-popup .send-popup-btn:hover{
		background-color:#4a4d9f;
		color:#fff;
	}
	.send-popup .send-popup-btn:before {
		display:block;
		content:'';
		width: 20px;
		height:22px;
	    background-repeat: no-repeat;
	    background-position: center;
	    background-size: contain;
	    margin-right:11px;
	}
	.send-popup .send-popup-btn:first-of-type:before{
		background-image: url(/resources/images/mbr/Icon_sendPopup1.svg);
	}
	.send-popup .send-popup-btn:nth-of-type(2):before {
		background-image: url(/resources/images/mbr/Icon_sendPopup2.svg);
	}
	.send-popup .send-popup-btn:nth-of-type(3):before {
		background-image: url(/resources/images/mbr/Icon_sendPopup3.svg);
	}
	
	.send-popup .send-popup-btn:first-of-type:hover:before{
		background-image: url(/resources/images/mbr/Icon_sendPopup1Hover.svg);
	}
	.send-popup .send-popup-btn:nth-of-type(2):hover:before {
		background-image: url(/resources/images/mbr/Icon_sendPopup2Hover.svg);
	}
	.send-popup .send-popup-btn:nth-of-type(3):hover:before {
		background-image: url(/resources/images/mbr/Icon_sendPopup3Hover.svg);
	}
	.send-popup .send-popup-btn:after {
		display:block;
		content:'';
		width:11px;
		height:11px;
	    background-image: url(/resources/images/mbr/Icon_sendPopup.svg);
	    background-repeat: no-repeat;
	    background-position: center;
	    background-size: contain;
	    margin-left:auto;
	}
	.send-popup .send-popup-btn:hover:after{
		 background-image: url(/resources/images/mbr/Icon_sendPopupHover.svg);
	}
	.send-popup button {
		width:100%;
		height:52px;
		color:#111;
		font-size:16px;
		border-top: 1px solid #e6e6e6; 
	}
	.send-popup button:hover{
		color:#4a4d9f;
	}
</style> 

<input type='hidden' id="userId" value="<c:out value='${userId}'/>"/>
<input type='hidden' id="mobile" value="<c:out value='${mobile}'/>"/>
<input type='hidden' id="userName" value="<c:out value='${userName}'/>"/>
<input type='hidden' id="resNo" value="<c:out value='${resNo}'/>"/>

<div class="send-popup">
 	<div class="send-wrap">
		<div class="send-popup-btn" onclick="goProductReply()">남은 시술권 전송<span style="opacity: ${send1 == '0' || send1 == null ? '0' : '1'}">(<c:out value='${send1}'/>)</span></div>
		<div class="send-popup-btn" onclick="goCaution()">주의사항 전송<span style="opacity: ${send2 == '0' || send2 == null ? '0' : '1'}">(<c:out value='${send2}'/>)</span></div>
		<div class="send-popup-btn" onclick="sendHospitalCode()">뷰티올 다운로드 링크 전송</div>
	</div>
	<button type="button" onclick="popupClose();">닫기</button>
</div>

<script>
//남은 시술권 전송
 function goProductReply() {
	const params = {
		"userId"     : document.getElementById("userId").value,
		"mobile"     : document.getElementById("mobile").value,
		"userName"   : document.getElementById("userName").value,
		"resNo"      : document.getElementById("resNo").value
	}
	
	commonDrawPopup("load", "/res/res004productReply", params);
}
 
//주의 사항 전송
function goCaution(){
	const params = {
		"userId"     : document.getElementById("userId").value,
		"userMobile" : document.getElementById("mobile").value,
		"userName"   : document.getElementById("userName").value,
		"resNo"      : document.getElementById("resNo").value
	};	
	
	commonDrawPopup("load", "/res/res002Caution", params)
}

//병원코드 전송
function sendHospitalCode() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,	
		"userId"       : document.getElementById("userId").value,	
		"mobile"       : document.getElementById("mobile").value
	};

	commonAjax.call("/res/sendAccessKey", "POST", params, function(data) {
		if (data.message == "OK") {
		 alert('뷰티올 다운로드 링크가 전송되었습니다.');
		} else {
			alert(data.message);
		}
	});
}
</script>