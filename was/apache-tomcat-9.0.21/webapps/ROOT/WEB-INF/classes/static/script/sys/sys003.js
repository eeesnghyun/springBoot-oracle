function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);

	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;	
	
	getHospitalLaw();
}

function getHospitalLaw() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};	
	
	commonAjax.call("/sys/getHospitalLaw", "POST", params , function(data) {
		const result = data.resultList;		
		
		if (data.message == "OK") {
			const div = document.querySelector('.add-list');	
			div.innerHTML = "";
						
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					div.innerHTML += 
						`<li data-seq=${result[i].seq} onclick="deleteHospitalLaw(this)">${result[i].content}</li>`;
				}
			} else {
				div.innerHTML = `<span>-</span>`
			}
		}			
	});
}

function insertHospitalLaw() {
	const text = document.querySelector('#text');
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"content"      : text.value
	};	
	
	commonAjax.call("/sys/insertHospitalLaw", "POST", params , function(data) {		
		if (data.message == "OK") {
			alert('추가가 완료되었습니다.');
			
			text.value = '';
			getHospitalLaw();			
		}			
	});
}

function deleteHospitalLaw(obj) {
	if (confirm("해당 문구를 삭제하시겠습니까?")) {
		const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value,
			"seq" 		   : obj.dataset.seq
		};	
		
		commonAjax.call("/sys/deleteHospitalLaw", "POST", params , function(data) {		
			if (data.message == "OK") {
				alert('삭제가 완료되었습니다.');
				
				getHospitalLaw();
			}			
		});	
	}
}