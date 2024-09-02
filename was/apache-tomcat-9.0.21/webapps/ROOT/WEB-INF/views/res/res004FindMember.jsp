<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<style>
#popupInner{
	display:block;
}
.popup-inner{
	width:718px;
	padding: 20px 30px;
}
.popup-con{
    flex-direction: column;
}
.reservation-popup p {
	font-size:var(--font-size-regular);
	line-height:1;
	margin-left: 3px;
	margin-top: 5px;
	margin-bottom: 40px;
	color:#676767;
}
.reservation-popup p > button{
	font-size:var(--font-size-regular);
	text-decoration: underline;
	color:#111;
	font-weight:500;
	background-color: transparent;
}
.user-search{
	width: 324px;
	position:relative;
}
.user-search:after {
	position:absolute;
    display: block;
    content: '';
    top: 50%;
    right: 10px;
    transform:translateY(-50%); 
    width: 20px;
    height: 20px;
    background-image: url(/resources/images/mbr/IconSearch.svg);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;	
}
.search-wrap {
	display:flex;
	flex-wrap:wrap;
	gap:10px;
	max-height: 500px;
    overflow-y: auto;
    min-width: 674px;
}
.member-li{
    width: 324px;
    height: 140px;  
    padding: 8px 8px 8px 10px;
    background-color: #fff;
    color:#333;
    border:1px solid #e3e3e3;
    margin-bottom:10px;
    cursor: pointer;
}
.member-li:hover{
	border:1px solid #111;
}
.member-li:hover .user-info-sch::after{
    opacity: 1;
}
.member-li .top-wrap{
    width: 100%;
    height: 20px;
    margin-bottom: 6px;
}

/* 상단 정보 영역 */
.member-li .rank {
	font-family: 'Poppins', sans-serif;
    display: inline-block;
    width: 30px;
    height: 20px;
    border-radius: 2px;
    background-color: #63c3f5;
    text-align: center;
    padding: 2px 0 3px;
    font-size:var(--font-size-small);
    color:#fff;
    margin-right:4px;
}
.member-li .button-div .visit-type {
    width: auto;
    height: 20px;
    text-align: center;
    padding: 3px 6px 5px;
    letter-spacing:0.7px;
    border-radius: 2px;
    font-size:var(--font-size-regular);
    font-weight:var(--font-weight-bold);
	color: #333;
    border: solid 1px #9fa2af;
    background-image: linear-gradient(to bottom, #fff, #e8e9eb);
}
.member-li .button-div > div:first-child,
.member-li .button-div > .visit-type {
    margin-right: 2px;
}
/* 상단 버튼영역 */
.member-li .button-div{
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: 23px;
}
.member-li .button-div button{
    background-color: transparent;
}
.member-li .button-div .btn-send {
	width: 20px;
	height: 20px;
    background-image: url(/resources/images/mbr/Icon_sendBtnActive.svg);
    background-size: contain;
    background-position: center;
    margin-right: 8px;
    background-position: inherit;
    background-repeat: no-repeat;
    margin-left:auto;
    opacity:0.5;
}
.member-li .button-div .btn-send:hover {
	 opacity:1;
} 
.member-li .button-div button:nth-of-type(2){
    width: 22px;
    background-image: url(/resources/images/mbr/Icon_UserEdit.svg);
    background-size: contain;
    background-position: center;
    opacity: 0.5;
    background-position: inherit;
    background-repeat: no-repeat;
}
.member-li .button-div button:nth-of-type(2):hover{
    opacity: 1;
}

/* 회원정보 */
.member-li .top-wrap{
    display: flex;
    margin-top: 8px;
    align-items: center;
}
.member-li .label-doc{
	color:#666;
}
.member-li .name {
    font-size:var(--font-size-regular2);
    font-weight:700;
    text-align: left;
    color: #333;
    cursor:pointer;
    padding-top:2px;
    display: flex;
    align-items: center;
}
.member-li .user-gen-age {
	font-size:var(--font-size-regular1);
}
.member-li .mobile{
    font-size:var(--font-size-regular1);
    font-weight:var(--font-weight-regular);
    padding-top: 5px;
    float:right;
}
.member-li .fixed-doctor{
    font-size:var(--font-size-regular);
}
.bottom-wrap {
    width: 100%;
    height: 32px;
    margin-top: 19px;
    display: flex;
    flex-wrap: nowrap;
}
.bottom-wrap .btn-res{
    float: right;
    width: 78px;
    height: 27px;
    border-radius: 2px;
    border: solid 1px #3c3e88;
    font-size:var(--font-size-regular);
    font-weight:var(--font-weight-regular);
    color:#fff;
    background-image: linear-gradient(to bottom, #6a6ece, #383b82);
    margin-left: auto;
    padding:5px 0 15px;
    text-align: center;
    margin-top:auto; 
}
div#noSearch {
	width:100%;
}
.doc-show {
	display:inline-block; 
}
.doc-hide {
	display:none; 
}
</style>
<div class="popup-tit">
   	<p class="chg-tit">예약 접수</p>
</div>

<div class="reservation-popup">
	<div class="popup-con">
		<label class="need">회원 검색</label>
		<div class="user-search" style="margin-bottom:0px">	
			<input type="text" id="userName" placeholder="회원명을 입력해 주세요.">
		</div>
		<p>새로운 회원을 추가하시겠어요? <button type="button" onclick='openAddPopup()'>회원추가</button></p>
		
		<div class="search-wrap scroll"></div>	
	</div>
</div>

<script src="${sessionScope.path}/script/res/res004Member.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>
	function openAddPopup() {
		commonDrawPopup("load","/res/res004AddMember");
	}
	
	document.querySelector('#userName').addEventListener('keypress', function (e) {
	    if (e.key === 'Enter') {		   
	    	getSearchUserList();
	    }
	});
</script>