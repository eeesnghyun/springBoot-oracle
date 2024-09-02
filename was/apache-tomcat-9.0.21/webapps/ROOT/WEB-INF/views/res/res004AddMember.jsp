<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<style>
.popup-inner {
    width: 650px;
    min-height: 367px;
}
</style> 

<div class="popup-tit">
   	<p>회원 정보</p>
</div>

<div class="mbr001member">
    <div class="popup-con">
        <input type="hidden" id="pageType">

        <div class="left">
            <label class="need">회원 정보</label>
            <div class="info-box">
                <!-- 회원정보 -->
                <div class="item">
                    <div class="label">회원 등급</div>
                    <div class="select-box">
                        <select id="grade"></select>
                        <div class="icon-arrow"></div>
                    </div>
                </div>
                
                <div class="item">
                    <div class="label">초진/재진</div>
                    <div class="text">초진</div>
                </div>

                <div class="item">
                    <div class="label">회원 성별</div>
                    <div class="select-box">
                        <select id="gender">
                        	<option value="female">여자</option>
                            <option value="male">남자</option>
                        </select>
                        <div class="icon-arrow"></div>
                    </div>
                </div>

                <div class="item">
                    <div class="label">회원 이름</div>
                    <input type="text" class="req" id="userName" placeholder="이름을 입력해 주세요." onKeyup="this.value=this.value.replace(/[^ㄱ-힣]/g,'');">
                </div>

                <div class="item">
                    <div class="label">휴대폰 번호</div>
                    <input type="text" class="req" id="userPhone" placeholder="번호를 입력해 주세요." maxlength="11" onKeyup="this.value=this.value.replace(/[^0-9]/g,'');">
                </div>

                <div class="item">
                    <div class="label">생년월일</div>
                    <input type="text" class="req" id="birthDate" placeholder="ex)20200101"  maxlength="8" onKeyup="this.value=this.value.replace(/[^0-9]/g,'');">
                </div>
            </div>
            
            <label style="margin-left:7px;">특이사항</label>
            <div class="info-box">
            	<textarea class="user-memo scroll" id="userMemo" placeholder="회원의 특이사항을 입력해 주세요."></textarea>
            </div>
            
         </div>
     
         <div class="right">
         	 <div>
	             <label class="need">의료진 지정</label>
	             <div class="info-box">
	                 <div class="item">
	                     <div class="label">의사 지정</div>
	                     <div class="select-box">
							<select id="doctor"></select>
							<div class="icon-arrow"></div>
						</div>
	                 </div>
	
	                 <div class="item">
	                     <div class="label">의료진 지정</div>
	                     <div class="select-box">
							<select id="staff"></select>
							<div class="icon-arrow"></div>
						</div>
	                 </div>
	             </div>
	
	             <label class="need">수신 동의</label>
	             <div class="info-box">
	                 <div class="item push">
	                     <div class="label">이벤트 등 마케팅 알림</div>
	                     <input type="checkbox" id="marketing" class="cm-toggle"></input>
	                 </div>
	             </div>
			 </div>
			
             <div class="popup-btn">
                 <button class="save-btn blue-btn" onclick="insertUser();">추가하기</button>
            </div>
        </div>
    </div>
</div>

<script src="${sessionScope.path}/script/common/calendar.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script src="${sessionScope.path}/script/res/res004Member.js?ver=<fmt:formatDate value="${today}" pattern="yyyyMMddhhmmss"/>"></script>
<script>	
	initDateCombo();
	getGradeList();
	getMedicalTeam();
</script>