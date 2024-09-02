function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;
	
	getGradeList();
	document.querySelector('.list-wrap').firstChild.click();
}

function colorPicker(pick) {
	var color = pick.value;
	if (isPop) {
	    const min  = document.querySelector('.popup-con .grade-name').value;
	    
	    pick.previousElementSibling.value = color;
	    document.querySelector('.popup-con .icon-preview').innerText = min;
	    document.querySelector('.popup-con .icon-preview').style.backgroundColor = color;
	    document.querySelector('.popup-con .icon-preview').style.display = 'block';
	} else {
	    const grade = document.querySelector('.user-grade').value;
	    const min  = document.querySelector('.grade-name').value;
	    
	    pick.previousElementSibling.value = color;
	    document.querySelector('.icon-preview').style.diplay = 'block';
	    document.querySelector('.icon-preview').innerText = min;
	    document.querySelector('.icon-preview').style.backgroundColor = color;
	}
}

function gradePreview() {
    if (isNullStr(document.querySelector('.icon-preview'))) {
    	return;
    } else {
    	if (isPop){
    		document.querySelector('.popup-con .icon-preview').innerText = document.querySelector('.popup-con .grade-name').value;
    	} else {
    		document.querySelector('.icon-preview').innerText = document.querySelector('.grade-name').value;
    	}
    }
}

function listClick() {
    const li = document.querySelectorAll('.grade');

    for (let i=0; i < li.length; i++) {
        li[i].addEventListener('click', function(){
            for (let j=0; j < li.length; j++) {
                li[j].classList.remove('active');
            }
            li[i].classList.add('active');
        });
    }
}

function drawPopup(type) {
	if (type == "add") {
		commonDrawPopup("load", "/mbr/mbr002AddPopup");	
	} else {
		if (commonCheckRequired('.grade-set-form') == false) {
			return;
		}
		
		commonDrawPopup("load", "/mbr/mbr002SavePopup");
	}
}

function getGradeList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/mbr/getGradeList", "POST", params, function(data) {
		const result = data.resultList;
		
		if (data.message == "OK") {
			const ul = document.querySelector('.list-wrap');
			
			ul.innerHTML = '';
			document.querySelector('.user-grade').value = '';
			document.querySelector('.grade-code').value = '';
			document.querySelector('.grade-name').value = '';
			document.querySelector('.grade-color').value = '';
			document.querySelector('.total-price').value = '';
			document.querySelector('.medical-fixed').checked = '';
			document.querySelector('.icon-preview').style.display = 'none';
			
			if (result.length > 0 ) {
				for (let i = 0;i < result.length; i++) {
					ul.innerHTML +=
						`<div class="grade" onclick="setGradeInfo(this);">
							<span id="grade">${result[i].gradeName}</span>
							<button type="button" onclick="deleteGrade(this.parentNode)"></button>
							<input type="hidden" id="code" value="${result[i].gradeCode}">
							<input type="hidden" id="display" value="${result[i].gradeDisplay}">
							<input type="hidden" id="color" value="${result[i].gradeColor}">
							<input type="hidden" id="totalPay" value="${result[i].totalPay}">
							<input type="hidden" id="doctorFixed" value="${result[i].doctorFixed}">
							<input type="hidden" id="userCnt" value="${result[i].userCnt}">
						</div>`;
				}
				
				document.querySelector('.grade-set-box').style.opacity = '1';
				document.querySelector('.total').style.opacity = '1';
				document.querySelector('.grade-set-box').style.pointerEvents = 'all';
				document.querySelector('.icon-preview').style.display = 'block';
				document.querySelector('.list-wrap').firstChild.click();
				document.querySelector('.list-wrap').firstChild.classList.add('active');
				
				const input = document.querySelectorAll('.grade-set-box input[type=text]');
				
				for (let i=0;i < input.length; i++) {
					input[i].disabled = false;
				}				
			} else {
				document.querySelector('.grade-set-box').style.opacity = '0.5';
				document.querySelector('.total').style.opacity = '0';
				document.getElementById('gradeName').innerHTML = '';
				document.getElementById('gradeCnt').innerHTML = '';
				document.querySelector('.grade-set-box').style.pointerEvents = 'none';
				document.querySelector('.medical-fixed').checked = '';
				document.querySelector('.icon-preview').style.display = 'none';
				
				const input = document.querySelectorAll('.grade-set-box input[type=text]');
				
				for (let i=0;i < input.length; i++) {
					input[i].value = '';
				}
			}
				
		} else {
			alert(data.message);
		}
	});
	listClick();
}

function setGradeInfo(ele) {
	document.querySelector('.user-grade').value = ele.querySelector('#grade').innerText;
	document.querySelector('.grade-code').value = ele.querySelector('#code').value;
	document.querySelector('.grade-name').value = ele.querySelector('#display').value;
	document.querySelector('.grade-color').value = ele.querySelector('#color').value;
	document.querySelector('.total-price').value = ele.querySelector('#totalPay').value;
	document.querySelector('.medical-fixed').checked = ele.querySelector('#doctorFixed').value == "Y" ? true : false;
	document.querySelector('.icon-preview').innerText = document.querySelector('.grade-name').value;
    document.querySelector('.icon-preview').style.backgroundColor = document.querySelector('.grade-color').value;
	document.getElementById('gradeName').innerText =  ele.querySelector('#grade').innerText;
	document.getElementById('gradeCnt').innerText = ele.querySelector('#userCnt').value == "undefined" ? "0" : ele.querySelector('#userCnt').value;
}

function insertGrade() {
	if (commonCheckRequired('.grade-form') == false) {
		return;
	}
	
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"gradeName"     : document.querySelector(".popup-con .user-grade").value,
		"gradeDisplay"  : document.querySelector(".popup-con .grade-name").value,
		"gradeColor"    : document.querySelector(".popup-con .grade-color").value,
		"totalPay"      : document.querySelector(".popup-con .total-price").value,
		"doctorFixed"   : document.querySelector(".popup-con .medical-fixed").checked == true ? "Y" : "N"
	};

	commonAjax.call("/mbr/insertGrade", "POST", params, function(data) {
		const result = data.resultList;
		
		if (data.message == "OK") {
			alert('저장되었습니다.');
			
			getGradeList();
			popupClose();
		} else {
			alert(data.message);
		}
	});
}

function updateGrade(type) {
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"gradeCode"     : document.querySelector(".grade-set-box .grade-code").value,
		"gradeName"     : document.querySelector(".grade-set-box .user-grade").value,
		"gradeDisplay"  : document.querySelector(".grade-name").value,
		"gradeColor"    : document.querySelector(".grade-color").value,
		"totalPay"      : document.querySelector(".total-price").value,
		"doctorFixed"   : document.querySelector(".medical-fixed").checked == true ? "Y" : "N",
		"isAllApply"    : type
	};
	
	commonAjax.call("/mbr/updateGrade", "POST", params, function(data) {		
		if (data.message == "OK") {
			alert('저장되었습니다.');
			
			getGradeList();
			popupClose();
		} else {
			alert(data.message);
		}
	});
}

function deleteGrade(ele) {
	if (confirm('삭제하시겠습니까?') == false) {
		return;
	}
	event.stopPropagation();
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"gradeCode"     : ele.querySelector('#code').value
	};
	
	commonAjax.call("/mbr/deleteGrade", "POST", params, function(data) {
		const result = data.resultList;
		
		if (data.message == "OK") {
			ele.remove();
			getGradeList();
		} else {
			alert(data.message);
		}
	});
}

function getGradeChangeInfo() {
	document.querySelector('.popup-tit span').innerText = document.querySelector('.user-grade').value;
	
	const gradeCnt = document.getElementById('gradeCnt').innerText; 	//기존 회원 수
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"totalPay"	   : document.querySelector('.total-price').value,
		"doctorFixed"  : document.querySelector(".medical-fixed").checked == true ? "Y" : "N"
				
	};
	
	commonAjax.call("/mbr/getGradeChangeInfo", "POST", params, function(data) {
		const result = data.result;
		
		if (data.message == "OK") {
			//기존 회원 수 - 변경 등급 회원 수 
			const deduct = result - gradeCnt;
			const area = document.querySelector(".grade-changes");			
			area.innerHTML = "";						
			area.innerHTML = 
				`<div>
					변경할 등급 설정으로 <b>${gradeCnt}</b>명에서 <b>${result}</b>명으로 
				 	<span class="red">${Math.abs(deduct)}</span>명이 <b>${deduct < 0 ? '감소':'증가'}</b>합니다.<br>
				 	저장하시겠습니까?
				 </div>`;			
		}
	});	
}
