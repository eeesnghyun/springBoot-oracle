function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;
	
	getClause();
	tabClick();
}

//이용약관 탭
function tabClick() {
	const btn = document.querySelectorAll('.btn-tab');
	const con = document.querySelectorAll('.term');
	
	for (let i = 0; i < btn.length; i ++) {
		btn[i].addEventListener('click', function (){
			
			for (let j = 0; j < btn.length; j ++ ) {
				
				con[j].style.display = "none";
				btn[j].classList.remove('active');
			}
			con[i].style.display ="block";
			btn[i].classList.add('active');
			
			changeUrl();
		});
	}
}

function termsSave() {
	const siteClause = document.getElementById("siteClause").value; 
	const personalInfo = document.getElementById("personalInfo").value; 	
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,	
		"officeCode"   : document.getElementById("officeCode").value,
		"siteClause"   : siteClause,
		"personalInfo" : personalInfo
	};
	
	commonAjax.call("/pge/updateClause", "POST", params, function(data){
		if (data.message == "OK") {
			alert("저장되었습니다.");
			
			getClause();
		} else {
			alert(data.message);
		}
	});
}

//이용약관 조회
function getClause() {	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode" : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/pge/getClause", "POST", params, function(data){
		if(data.message == "OK") {			
			const result = data.result;
			const siteClause = document.getElementById("siteClause");
			const personalInfo = document.getElementById("personalInfo");
			
			commonSetOfficeSite("#homePageUrl", params, "/about");
			
			if (isNullStr(result.siteClause)) {
				siteClause.value = '';
			} else {
				siteClause.value = result.siteClause;
			}
			
			if (isNullStr(result.personalInfo)) {
				personalInfo.value = '';
			} else {
				personalInfo.value = result.personalInfo;
			}
		}
	});	
}

function changeUrl() {
	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode" : document.getElementById("officeCode").value
	};
	const tab = document.querySelectorAll('.tabs > li');
	
	if (tab[0].classList.contains('active')) {
		commonSetOfficeSite("#homePageUrl", params, "/about");
	} else {		
		commonSetOfficeSite("#homePageUrl", params, "/privacy");
	}
}