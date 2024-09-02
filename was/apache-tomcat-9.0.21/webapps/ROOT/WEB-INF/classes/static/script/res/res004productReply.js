//남은 시술권 전송 기록 조회
function getUserProductReplyList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"userId"       : document.getElementById("userId").value
	};
	
	commonAjax.call("/res/getUserProductReplyList", "POST", params, function(data){			
		if (data.message == "OK") {
			const result = data.resultList;
			const template = data.template;
			
			const div = document.querySelector('.send-list');
			div.innerHTML = '';
			
			document.getElementById('lastPrice').innerHTML = template.basic.totalPay
			
			if (data.template.product.length > 0) {
				let content = '';
				let html = '';
				let num = 1;
				
				for (let i = 0; i < template.product.length; i++) {
					if (template.product[i].itemType == 'P') {
						if (template.product[i].groupTitle == 'Y') {
							content += `\n${num}. ${template.product[i].productTitle}\n- ${template.product[i].itemTitle}\n`;
							num++;
						} else {
							content += `- ${template.product[i].itemTitle}\n`;	
						}
					} else {
						content += `\n${num}. ${template.product[i].itemTitle}\n`;
						num++;
					}
				}
				
				html += "안녕하세요. #{이름} 고객님\n";
				html += template.basic.officeName + "입니다.\n\n";
				html += "#{이름} 고객님의 남은 시술권 안내드립니다.\n" + content;
				html += "\n편한 날짜와 시간에 연락주시면 \n빠르게 예약 및 안내 도와드리겠습니다. ♥\n\n";
				html += "대표번호: " + template.basic.officePhone + "\n";
				html += "카카오톡: " + template.basic.kakaoName + "\n";
				html += "홈페이지: " + template.basic.officeSite;
		
				document.getElementById('replyContent').value = html;
			} else {
				document.getElementById('replyContent').value = 
					`안녕하세요. #{이름}님
뷰티온의원 강서점입니다.

#{이름} 고객님의 남은 시술권 조회 결과,
사용 가능한 잔여 시술권이 조회되고 있지 않습니다.

고객님이 알고 계신 시술권 내역과 상이할 경우,
불편하시더라도 본원으로 연락 주시면
안내 도와드리겠습니다. ♥
감사합니다.

대표번호: 02-2668-7785
카카오톡: 뷰티온의원 강서점
홈페이지: https://gangseo.beautyon.co.kr`;
			}
			
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					div.innerHTML += 
						`<div>
							<div class="send-user">${result[i].replyDate} - ${result[i].replyUser}</div>
							<div class="send-content">${result[i].replyContent}</div>
						</div>`;	
				}
			} else {
				div.innerHTML = '<div id="noSearch">전송된 남은 시술권이 없습니다.</div>';
			}
		}
	});	
	
	openHistory(); //클릭 애니메이션
}

//남은 시술권 전송
function sendProduct() {
	const replyContent = document.getElementById("replyContent");
	const id = document.getElementById("userId").value;
	
	if (isNullStr(replyContent.value)) {
		alert('내용을 입력해 주세요.');
		replyContent.focus();
		replyContent.style.border = '1px solid red';
		return;
	}
	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"userId"       : document.getElementById("userId").value,
		"mobile"       : document.getElementById('mobile').value,
		"replyContent" : replyContent.value,
		"name"         : document.getElementById('name').value,
		"resNo"        : document.getElementById('resNo').value
	};

	commonAjax.call("/res/sendProduct", "POST", params, function(data){			
		if (data.message == "OK") {
			alert("남은 시술권이 정상적으로 전송되었습니다.");
			 
			getUserProductReplyList(); //남은 시술권 전송 기록 조회
			
			//회원 현황 페이지 일경우 예약 회원 재조회
			if (window.location.href.indexOf('res004') != -1 ) {
				getReserveUserList();
			}
		}
	});	
}

//클릭 애니메이션
function openHistory() {
    var user = document.querySelectorAll('.send-user');
    var content = document.querySelectorAll('.send-content');

    for (let i = 0; i < user.length; i++) {
    	user[i].addEventListener("click", function() {

            var inner = this.nextElementSibling;
            
            if (this.classList.contains('active')) {		  		
                this.classList.remove('active');
                inner.style.maxHeight = null;
            } else {
                for (let j = 0; j < user.length; j++) {
                	user[j].classList.remove('active');
                    content[j].style.maxHeight = null;
                }
                
                this.classList.add("active");
                inner.style.maxHeight = inner.scrollHeight + "px";	
            }
        });
    }
}