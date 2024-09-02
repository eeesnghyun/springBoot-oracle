<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<link rel="stylesheet" href="/resources/plugins/editor/spectrum.min.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">
<link rel="stylesheet" href="${sessionScope.path}/style/main/notice.css?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>">

<form id="frm" action="/menu/updateNotice" method="post" onsubmit="return checkData();">
	<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />	
	<input type="hidden" name="noticeSeq" value='<c:out value="${seq eq null ? 0 : seq}"/>' />
	
	<div class="notice-page">
	    <div class="top-area">
	        <div class="tit"> 편하게 문의해 주세요:)</div>
	        <span class="cs-time">평일 09:00 ~ 18:00</span>
	        <div class="cs-wrap">
	            <div class="cs-con">
	                <div class="cs-icon"></div>
	                <div>전화상담</div>
	                <div>02-6735-7775</div>
	            </div>
	
	            <div class="cs-con">
	                <div class="cs-icon"></div>
	                <div>원격지원</div>
	                <div>cs@winwinlab.co.kr</div>
	            </div>
	
	            <div class="cs-con">
	                <div class="cs-icon"></div>
	                <div>카카오톡 상담</div>
	                <div>오토코디 담당 마케터</div>
	            </div>
	        </div>    
	    </div>
	
	    <div class="bottom-area">
	        <div class="title">작성하기</div>
	        
	        <div class="tabs">
	            <div class="tab active" data-index="1" data-type="" 	  onclick="goPage(this)">전체보기</div>
	            <div class="tab" 		data-index="1" data-type="notice" onclick="goPage(this)">공지사항</div>
	            <div class="tab"		data-index="1" data-type="update" onclick="goPage(this)">업데이트</div>
	            <div class="tab" 		data-index="1" data-type="qa" 	  onclick="goPage(this)">자주 묻는 질문</div>
	        </div>
		        
			<div class="write-wrap">
				<div class="con">
					<label class="need">선택</label>
					<div class="select-box">
						<select id="noticeType" name="noticeType" required>
							<option value=''>선택</option>
							<option value="notice">공지사항</option>
							<option value="update">업데이트</option>
							<option value="qa">자주 묻는 질문</option>
						</select>
						<div class="icon-arrow"></div>
					</div>
				</div>
				
				<div class="con">
					<label class="need">제목</label>
					<input type="text" id="noticeTitle" name="noticeTitle" placeholder="제목을 입력하세요." required>
				</div>
				
				<div class="con">
					<label class="need" style="margin-bottom:auto; min-width:80px; margin-top:10px">내용</label>
					
					<div class="wrap">
				       	<div id="toolbar" class="row">
				        	<div class="tags buttons"></div>
				        </div>
				        
						<input type="file" id="editorImg" style="display:none;" onchange="insertImage();">
						 
						<div class="new-notice scroll" id="noticeContent" contentEditable="true" placeholder="내용을 입력해 주세요." required></div>
					</div>
				</div>
				
				<div class="btn-area">
					<button type="button" class="white-btn" onclick="history.back();">이전으로</button>
					<button type="submit" class="save-btn blue-btn">작성하기</button>
				</div>	
			</div>	       
	    </div>
	</div>
</form>

<script src="/resources/plugins/editor/editor.js"></script>
<script src="/resources/plugins/editor/spectrum.min.js"></script>
<script>
	editorInit();			

	if (!isNullStr(commonGetQueryString().get("seq"))) {
		//공지사항 내용 조회
		commonAjax.call("/menu/getNoticeInfo", "POST", {"noticeSeq" : commonGetQueryString().get("seq")}, function(data){
			if (data.message == "OK") {
				const result = data.result;
				
				document.getElementById("noticeType").value  = result.noticeType;		 
				document.getElementById("noticeTitle").value = result.noticeTitle;
				document.getElementById("noticeContent").innerHTML = result.noticeContent;
			}	
		});
	}
	
	function checkData() {
		const type = document.getElementById('noticeType');
		const tit = document.getElementById('noticeTitle');
		const con = document.querySelector('.new-notice');
		
		if (type.value == '') {
			type.style.border = '1px solid red';
			type.focus();
			alert('타입을 선택해 주세요.');
			return;
		} 
		
		if (tit.value == '') {
			alert('제목을 입력해 주세요.');
			tit.style.border = '1px solid red';
			tit.focus();
			return;
		}
		
		if (con.innerText == '') {
			alert('내용을 입력해 주세요.');
			con.style.border = '1px solid red';
			con.focus();
			return;
		}
		
		const input = document.createElement("input");
		input.type  = "hidden";
		input.name  = "noticeContent";
		input.value = document.querySelector('.new-notice').innerHTML;
		document.getElementById("frm").appendChild(input);		
		document.getElementById("frm").submit();	
	}
</script>