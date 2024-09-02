<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="popup-tit">
	<div class="text">
	    <p>이벤트 시술 불러오기</p>
	    <span>불러온 데이터는 자동 저장됩니다.</span>
	</div>
</div>

<div class="popup-con">
	<div class="select-box">
    	<select id="popHospitalCode" onchange="commonGetOffice(this.value)"></select>
		<div class="icon-arrow"></div>	
	</div>

	<div class="select-box">
    	<select id="popOfficeCode"></select>
		<div class="icon-arrow"></div>	
	</div>

    <span>에서 데이터를 불러옵니다.</span>
</div>

<div class="popup-btn">
	<button class="save-btn blue-btn" id="callBtn" type="button">불러오기</button>
</div>
<script>	
	commonGetHospital();
	
	document.querySelector("#callBtn").addEventListener("click", event => {
		if (confirm("해당 데이터로 불러오시겠습니까?\n이전 데이터는 복구할 수 없습니다.")) {
			const params = {
				"fHospitalCode" : document.getElementById("popHospitalCode").value,
				"fOfficeCode"   : document.getElementById("popOfficeCode").value,
				"tHospitalCode" : document.getElementById("hospitalCode").value,
				"tOfficeCode"   : document.getElementById("officeCode").value
			};
			
			commonAjax.call("/prd/updateCoverEventData", "POST", params , function(data) {				
				if (data.message == "OK") {
					getEventGroupList();
					
					popupClose();							
				} else {
					alert(data.message);
				}
			});					
		}						
	});
</script>