
//홈페이지 컬러
function colorPicker(pick){
    var color = pick.value;
    pick.previousElementSibling.value = color;
}

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;	
	document.getElementById("officeCode").value = officeCode;	
	
	getHomepage();
}

function getHomepage() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/pge/getHomepage", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.result;
			
			commonSetOfficeSite(".page-url", params);
			
			if (isNullStr(result)) {
				commonFormReset("#frm");
			} else {
				document.querySelector('input[name="logoTop"]').value           = nvlStr(result.logoTop);
				document.querySelector('input[name="logoBottom"]').value        = nvlStr(result.logoBottom);
				document.querySelector('input[name="logoOpenGraph"]').value     = nvlStr(result.logoOpenGraph);
				document.querySelector('input[name="logoFavicon"]').value       = nvlStr(result.logoFavicon);
				document.querySelector('input[name="parkingImg"]').value        = nvlStr(result.parkingImg);
				document.querySelector('input[name="siteColor"]').value         = nvlStr(result.siteColor);
				document.querySelector('input[name="siteSubColor"]').value      = nvlStr(result.siteSubColor);
				document.querySelector('input[name="siteGrdColor"]').value      = nvlStr(result.siteGrdColor);
				document.querySelector('input[name="officeName"]').value        = nvlStr(result.officeName);
				document.querySelector('input[name="officeOwner"]').value       = nvlStr(result.officeOwner);
				document.querySelector('input[name="officePhone"]').value       = nvlStr(result.officePhone);
				document.querySelector('input[name="businessNum"]').value       = nvlStr(result.businessNum);
				document.querySelector('textarea[name="address"]').value        = nvlStr(result.address);
				document.querySelector('input[name="siteIntro"]').value         = nvlStr(result.siteIntro);
				document.querySelector('input[name="kakaoName"]').value         = nvlStr(result.kakaoName);
				document.querySelector('input[name="kakaoUrl"]').value          = nvlStr(result.kakaoUrl);
				document.querySelector('input[name="clinicDay01"]').value       = nvlStr(result.clinicDay01);
				document.querySelector('input[name="clinicTime01"]').value      = nvlStr(result.clinicTime01);
				document.querySelector('input[name="clinicTime02"]').value      = nvlStr(result.clinicTime02);
				document.querySelector('input[name="clinicDay02"]').value       = nvlStr(result.clinicDay02);
				document.querySelector('input[name="clinicDay03"]').value       = nvlStr(result.clinicDay03);
				document.querySelector('input[name="clinicTime03"]').value      = nvlStr(result.clinicTime03);
				document.querySelector('input[name="mapNaver"]').value          = nvlStr(result.mapNaver);
				document.querySelector('input[name="mapKakao"]').value          = nvlStr(result.mapKakao);
				document.querySelector('input[name="mapGoogle"]').value         = nvlStr(result.mapGoogle);
				document.querySelector('textarea[name="parkingComment"]').value = nvlStr(result.parkingComment);
				document.querySelector('input[name="snsInstagram"]').value      = nvlStr(result.snsInstagram);
				document.querySelector('input[name="snsYoutube"]').value        = nvlStr(result.snsYoutube);
				document.querySelector('input[name="snsFacebook"]').value       = nvlStr(result.snsFacebook);
				document.querySelector('input[name="snsBlog"]').value           = nvlStr(result.snsBlog);	
				
				if (result.parkingYn == 'Y') {
					document.querySelector('.toggle-checkbox').classList.add('active');
				} else {
					document.querySelector('.toggle-checkbox').classList.remove('active');
				}
				
				//이미지
				getImg(result.logoTop , 'logoTop');
				getImg(result.logoBottom , 'logoBottom');
				getImg(result.logoOpenGraph , 'logoOpenGraph');
				getImg(result.logoFavicon , 'logoFavicon');
				getImg(result.parkingImg , 'parkingImg');	
			}				
		} else {
			alert(data.message);
		}
	});			
}

function getImg(result , name){
	const div = document.querySelector(`input[name="${name}"]`).parentNode;
	
	if (isNullStr(result)) {
		div.querySelector('i').style.display = 'block';
		div.querySelector('img').src = "";
		div.querySelector('img').style.display = 'none';		
	} else {
		div.querySelector('i').style.display = 'none';
		div.querySelector('img').src = result;
		div.querySelector('img').style.display = 'block';
	}
}

function isParking() {
	const toggle = document.getElementById("toggle-knob").checked;
	
	if (toggle) {
		const parking = document.getElementById("parking");		
		const pakringImg = document.querySelector('input[name="parkingImg"]');
		
		if (isNullStr(parking.value)) {
			alert("주차 안내를 입력해 주세요.");
			
			parking.style.border = '1px solid red';
			parking.focus();
			return false;
		}
		
		if (isNullStr(pakringImg.value)) {
			alert("주차 안내 이미지를 등록해 주세요.");
			pakringImg.parentElement.style.border = '1px solid red';
			return false;
		}
	}
	
	return true;
}

function homeSave() {		
	if (commonCheckRequired("#frm")) {
		if (isParking()) {
			let form     = $("#frm").serializeArray();
			let formData = new FormData();
			
			form.forEach(function(data){
				//오픈 그래프 이미지일 경우 파일 저장
				if (data["name"] == 'logoOpenGraph') {
					formData.append("imageFile" , document.getElementById("logoOpenGraph").files[0]);
				} else {
					formData.append(data["name"], data["value"]);	
				}
			});
			
			commonAjax.fileUpload("/pge/updateHomepage", formData, function(data){
        		if (data.message == "OK") {				
        			alert('저장되었습니다.');        			
        		}
        	});
		}
	}	
}

function characterCheck(str , target) {	
	var num = str.toString()
				.replace(/[^0123456789-]/g, '');
	 
	!isNullStr(target) ? target.value = num : null;
	
	return num;
}