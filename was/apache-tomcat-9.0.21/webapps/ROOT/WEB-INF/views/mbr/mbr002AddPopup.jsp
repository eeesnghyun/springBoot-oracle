<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<style>
.popup-inner{
	width:360px;
}
.need::before{
 	margin-right: 0;
}
</style>
<div class="popup-tit">
	<p>회원 등급 추가</p>
</div>

<form class="grade-form">
	<div class="popup-con">
	  	<div>
          	<label for="" class="need">등급 이름</label>
          	<input type="text" class="user-grade" placeholder="회원 등급을 입력해 주세요." onkeyup="gradePreview();" required>
      	</div>
      
      	<div>
         	<label for="" class="need">등급 표시</label>
          	<div class="con-wrap">
	          	<input type="text" class="grade-name" placeholder="최대 2글자" maxlength="2" onkeyup="gradePreview();" required>
	          	<div class="color-picker">	
		         	<input type="text" class="grade-color" placeholder="배경색" required>
		          	<input type="color" class="color-input" placeholder="색상" onchange="colorPicker(this)">
	          	</div>
	          	
	          	<div class="icon-preview">
	          		<div class="preview-wrap">
		       			<div class="icon"></div>
		       			<span></span>
		       		</div>
		   	  	</div>
	   	 	</div>
      	</div>
      
      	<label class="need" style="margin-bottom:5px">결제 금액</label>
      	<div class="total-con">
          	<input type="text" class="total-price" placeholder="0" onkeyup="commonMoneyFormat(this.value , this)" required>
          	<span><b>원</b>&nbsp;이상인 회원</span>
      	</div>
      
        <label class="need" style="margin-bottom:5px">의료진</label>
      	<span class="medical-chk">
      	  	<input type="checkbox" class="medical-fixed chk" id="medicalFixed2">
          	<label for="medicalFixed2"></label>
          	<label for="medicalFixed2" class="check">의료진 지정이 있을 경우</label>
      	</span>
	</div>      
</form>

<div class="popup-btn">
	<button class="save-btn blue-btn" onclick="insertGrade();">저장하기</button>
</div>