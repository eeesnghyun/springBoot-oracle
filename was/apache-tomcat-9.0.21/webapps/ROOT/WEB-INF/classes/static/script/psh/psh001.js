var gridPsh001 = null;

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
		
	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;		
}

//푸시 발송 리스트 조회
function getPushList() {	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"start" 	   : document.getElementById("startDate").value.replace(/[^0-9]/gi,""), 	
		"end"	       : document.getElementById("endDate").value.replace(/[^0-9]/gi,"")
	};
	
    commonAjax.call("/psh/getPushList", "POST", params, function(data) {
    	const result = data.resultList;
    	
    	commonSetOfficeSite(".page-url", params);
    
    	if (data.message == "OK") {
    		if (isNullStr(gridPsh001)) {
        		gridPsh001 = new Tabulator("#divGrid", {    				    				
    			    layout: "fitColumns",
    			    pagination: "local",
    				paginationSize: 15,
    				paginationButtonCount : 9,    	
    				placeholder: "해당 데이터가 없습니다.",
    				maxHeight: "100%",
    			    columns: [    			    	
    			    	{title: "순번"        , field: "pushSeq"       , width: 30, headerHozAlign: "center", hozAlign: "center", resizable: false},
    			    	{title: "대상"	      , field: "pushTarget"    , width: 220, headerSort: false, resizable: false, hozAlign: "center",
    			    		formatter:function(cell){    			    	
	    			    		const pushTargetAdr = cell._cell.row.data.pushTargetAdr;
	    			    		const pushTargetIos = cell._cell.row.data.pushTargetIos;
	    			    		const pushTargetEtc = cell._cell.row.data.pushTargetEtc;
	    			    		let text = "";
	    			    		
	    			    		if (pushTargetAdr === "Y") text += "<span class='grid-badge'>Android</span>";    			    			    			    		    			    		
	    			    		if (pushTargetIos === "Y") text += "<span class='grid-badge'>iOS</span>";     			    		
	    			    		if (pushTargetEtc === "Y") text += "<span class='grid-badge'>특정 조건</span>"; 
	    			    			
	    			    		return text;
    			    		}
    			    	},
    			    	{title: "Android"     , field: "pushTargetAdr" , visible: false},
    			    	{title: "IOS"	      , field: "pushTargetIos" , visible: false},
    			    	{title: "특정대상"	  , field: "pushTargetEtc" , visible: false},
    			    	{title: "발송 타입"   , field: "pushType"      ,  width: 100, hozAlign: "center", headerSort: false, resizable: false,
    			    		formatter:function(cell){
    			    			if (cell.getValue() === "0") {
    			    				return "즉시발송";
    			    			} else {
    			    				return "예약발송";
    			    			}
    			    		}
    			    	},
    			    	{title: "메시지 제목" , field: "messageTitle"  , width: 220, hozAlign: "center"  , headerSort: false, resizable: false},
    			    	{title: "메시지 내용" , field: "messageContent", width: 300, hozAlign: "center"  , headerSort: false, resizable: false},
    				    {title: "발송"   	  , field: "expectCount"   , width: 120, hozAlign: "center", headerSort: false, resizable: false,
    			    		formatter:function(cell){
    			    			return "<span class='push-success-cnt'>" + cell._cell.row.data.successCnt + "</span><span class='push-total-cnt'>/" + cell.getValue() + "</span>";
    			    		}
    				    },
    				    {title: "상태"   	  , field: "pushStatus"    , width: 250, hozAlign: "center", headerSort: false, resizable: false,
    				    	formatter:function(cell){
    				    		const pushTime = cell._cell.row.data.pushTime;
    			        		
    				    		if (cell.getValue() === "S") {
    				    			return "<p style='line-height: 1.5'><span class='push-list-status'>발송 완료</span><br><span class='push-time'>(" + pushTime + ")</span></p>";    				    			
    				    		} else if (cell.getValue() === "C") {
    				    			return "<p style='line-height: 1.5'><span class='push-list-status'>발송 취소</span><br><span class='push-time'>(" + pushTime + ")</span></p>";
    				    		} else if (cell.getValue() === "W" &&  cell._cell.row.data.pushType == '1') {
    				    			cell._cell.row.getElement().style.backgroundColor = "#f3f3f3";
    				    			return "<p style='line-height: 1.5'><span class='push-list-status destined'  style='color:#4a4d9f'>발송 예정</span><br><span class='push-time'>(" + pushTime + ")</span></p>";
    				    		} else if (cell._cell.row.data.testYn == "Y") {
    				    			return "<p style='line-height: 1.5'><span class='push-list-status'>테스트 발송</span><br><span class='push-time'>(" + pushTime + ")</span></p>";
    				    		} else {
    				    			return "<p style='line-height: 1.5'><span class='push-list-status'>테스트 발송전</span><br><span class='push-time'>(" + pushTime + ")</span></p>";
    				    		}     				    		
    			    		}
    				    },
    				    {title: "발송날짜" 	  , field: "pushTime"  , visible: false},    				    
    				    {cellClick: function(e, cell){
    				    	if (cell._cell.row.data.testYn == "Y" && cell._cell.row.data.pushType == '1' && cell._cell.row.data.pushStatus == 'W') {
    				    		setReserveStatus(cell);
    				    	} else if (cell._cell.row.data.pushStatus == 'W') {
				    			const title   = cell._cell.row.data.messageTitle;
				    			const content = cell._cell.row.data.messageContent;
				    			const seq     = cell._cell.row.data.pushSeq;
				    			const type    = cell._cell.row.data.pushType;
				    			
    				    		testPushSend(title, content, seq, type);
    				    	}}, width: 150, headerSort: false, resizable:false,
    				    	formatter:function(e, cell) {
    				    		if (e._cell.row.data.testYn == "Y" && e._cell.row.data.pushType == '1' && e._cell.row.data.pushStatus == 'W') {
				    				return "<button type='button' class='btn-push-test'>발송 취소</button>";
    				    		} else if (e._cell.row.data.pushStatus == 'W') {
    				    			return "<button type='button' class='btn-push-test'>테스트 발송</button>";
    				    		}
    				    	}
    				    }
    			    ]			  
    			});

        		gridPsh001.on('rowClick', (e, row) => {
            		if (e.srcElement.localName != 'button') {                    			
            			location.href = "/psh/psh001Info?seq=" + row.getData().pushSeq;
            		}
		    	});

        		//Data set
        		gridPsh001.on("tableBuilt", function(){				
        			gridPsh001.setData(result);			

                	const searchParams = commonGetQueryString();
                	
                	if (!isNullStr(searchParams)) {
                		gridPsh001.setPage(searchParams.get("index"));	
                	}        
        		});        	
        	} else {        		
        		gridPsh001.clearData();
        		gridPsh001.setData(result);
	    	}  
    		
    		//그리드 페이징 이벤트 추가
    		gridPsh001.on("renderComplete", function(data){
        		const currentPage = document.querySelector(".tabulator-page.active").dataset.page;
        		
        		document.querySelectorAll(".tabulator-page").forEach(function(el) {        	    
            	    el.addEventListener("click", function(e) {            	    	        	    	
            	    	const start = document.getElementById("startDate").value.replace(/[^0-9]/gi,"");
            	    	const end   = document.getElementById("endDate").value.replace(/[^0-9]/gi,"");            	 		
            	    	let page = el.dataset.page;
            	    	 
            	    	if (el.dataset.page == "next") {            	    		
            	    		page = Number(currentPage) + 1;
            	    	} else if (el.dataset.page == "prev") {
            	    		page = Number(currentPage) - 1 > 0 ? Number(currentPage) - 1 : 1;            	    		
            	    	}
            	    	
                		history.pushState(null, null, "/psh/psh001?index=" + page + "&start=" + start + "&end=" + end);
            	    });        	    
            	});
	        });        	
    	}
    });		    
}

function setParams() {
	const start = document.getElementById("startDate").value.replace(/[^0-9]/gi,"");
	const end   = document.getElementById("endDate").value.replace(/[^0-9]/gi,"");          
	
	if (!isNullStr(start) && !isNullStr(end)) {
		history.pushState(null, null, "/psh/psh001?index=1&start=" + start + "&end=" + end);
		
		getPushList();
	} 			
}

//푸시등록 페이지 
function goAddPage() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value 
	};
	
	commonGoPage("/psh/psh001Add", params);
}

//발송 취소
function setReserveStatus(cell) {	
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"pushSeq"       : cell._cell.row.data.pushSeq
	};
	
	commonAjax.call("/psh/updatePushCancel", "POST", params, function(data) {
		if (data.message == "OK") {
			alert('발송 취소되었습니다.');
		}
	});		
}

//grid list 테스트 발송 버튼 
function testPushSend(tit, con, seq, type) {	
	const preOffice = document.getElementById('hospitalCode').options[document.getElementById('hospitalCode').selectedIndex].text 
				    + ' ' + document.getElementById('officeCode').options[document.getElementById('officeCode').selectedIndex].text;
	
	const content =
		   `<input type="hidden" id="testType" value="${type}">
			<div class="popup-tit">
		        <p>푸시 발송하기</p>
		        <p class="tit-text">테스트 발송 후 푸시 발송이 가능합니다</br>테스트 발송 시에는 해당 병원 직원에게 발송됩니다.</br>푸시 발송 팝업을 닫을 경우 다시 테스트 발송을 진행합니다.</p>
		    </div>
			    
		    <div class="popup-con">
				<div class="pre-div">
					<div class="pre-office">
						<span>${preOffice}</span>
						<span class="push-time">2분전</span>
					</div>
					<div class="pre-content">
						<span class="pre-tit">${tit}</span>
						<pre>${con}</pre>
					</div>
				</div>
			</div>
			
		    <div class="popup-btn" id="btnArea">
				<div class="select-box push">
					<select id="testUser"></select>
					<div class="icon-arrow"></div>
				</div>
				<div id="spinner" style="display:none;">
					<div class="spinner-border" role="status">
					  <span class="visually-hidden">Loading...</span>
					</div>
				</div>
				
		        <button class="save-btn blue-btn" type="button" onclick="updateTestUser('${seq}')">테스트 발송</button>
		   </div>`;
	
	commonDrawPopup("draw", content);
	getTestUser();
}

//테스트 유저 수정
function updateTestUser(seq) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"pushSeq"	   : seq,
		"testTarget"   : isNullStr(document.getElementById("testUser").value) ? "0" : document.getElementById("testUser").value
	};
	
	commonAjax.call("/psh/updateTestUser", "POST", params, function(data) {
		if (data.message == "OK") {			
			sendTestPush(seq);
		}
	});
}

//테스트 발송하기
function sendTestPush(seq) {
	document.querySelector(".select-box.push").style.display = 'none';
	document.getElementById("spinner").style.display = "flex";
	document.querySelector("#btnArea .save-btn").disabled = true;
	document.querySelector("#btnArea .save-btn").style.display = 'none';
		
	const url   = window.location.href;
	const hCode = document.getElementById("hospitalCode").value;
	const oCode = document.getElementById("officeCode").value;
	let urlVal  = '';
	
	if (url.indexOf('localhost') == -1) {
		urlVal = `https://api.beautyon.co.kr/api/push/test/${oCode}/${seq}`;
	} else {
		urlVal = `http://localhost:18080/api/push/test/${oCode}/${seq}`;
	}
	
	fetch(urlVal)
		.then((response) => {
			return response.json();			
		})
		.then((data) => {			
			if (data.status == "OK") {
				const result = data.message;
				const year   = result.substr(0,4).substr(2);
				const month  = result.substr(4,4).substr(0,2);
				const day    = result.substr(4,4).substr(2);
				const hour   = result.substr(8,4).substr(0,2);
				const minute = result.substr(8,4).substr(2);  
				let time = "";
			
				if (hour > 12) {
					time = (Number(hour) - 12) < 10 ? "오후 0" + (Number(hour) - 12) + ":" + minute : "오후" (Number(hour) - 12) + ":" + minute; 
				} else {
					if (hour == 12) {
						time = "오후 " + hour + ":" + minute;	
					} else {
						time = "오전 " + hour + ":" + minute;
					}					
				}
				
				const dayOfWeek = commonGetDayOfWeek(result.substr(0,4) + "-" + month + "-" + day);
				const sendTime  = `${year}. ${month}. ${day}(${dayOfWeek}) ${time}`;
				document.querySelector("#btnArea .save-btn").style.display = 'block';
				document.getElementById('btnArea').innerHTML = 
					`<span class="test-time need">${sendTime} 테스트 발송 되었습니다.</span>
					 <button class="save-btn blue-btn" type="button" onclick="sendClientSend('${seq}')">발송하기</button>`;	
			} else {
				alert('발송실패(code : ' + data.message + ')');
				
				document.getElementById("spinner").style.display = "none";
				document.querySelector(".select-box.push").style.display = 'block';
				document.querySelector("#btnArea .save-btn").disabled = false;	
				
				popupClose(); // 테스트 발송시 팝업닫기
			}
		});
}

//푸시 실제 발송
function sendClientSend(seq) {	
	const url   = window.location.href;
	const hCode = document.getElementById("hospitalCode").value;
	const oCode = document.getElementById("officeCode").value;
	const pushType = document.getElementById("testType").value;
	let urlVal  = '';	
		
	if (pushType == "0") {	//즉시 발송
		if (url.indexOf('localhost') == -1) {
			urlVal = `https://api.beautyon.co.kr/api/push/${oCode}/${seq}`;
		} else {
			urlVal = `http://localhost:18080/api/push/${oCode}/${seq}`;
		}
		
		fetch(urlVal)
			.then((response) => {
				return response.json();			
			})
			.then((data) => {
				if (data.status == "OK") {
					alert('푸시가 발송되었습니다.');
					
					location.href = "/psh/psh001";
				} else {
					alert('발송실패(code : ' + data.message + ')');
				}
			});		
	} else {				//예약 발송
		alert('예약 푸시가 저장되었습니다.');
		location.reload();
	}
}

//테스트 명단 조회(병원직원)
function getTestUser() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/psh/getTestUserList", "POST", params, function(data) {
		const result = data.resultList;
		
		if (data.message == "OK") {
			let dataList = new Array();
			let comboObj;
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].sysUserId;
		        data.name = result[idx].sysName;

				dataList.push(data);
			}
			comboObj = {"target" : "testUser", "data" : dataList , "defaultOpt" : "직원 전체"};
			commonInitCombo(comboObj);				
		}
	});
}

//푸시 상세 정보 불러오기
function getPushInfo(){
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"pushSeq"      : location.search.replace(/[^0-9]/g, '')
	};
	
	commonAjax.call("/psh/getPushInfo", "POST", params, function(data) {		
		if (data.message == "OK") {
			const result = data.result;
			
			const userType   = document.getElementById('userType');
			const userGender = document.getElementById('userGender');
			const pushTarget = document.getElementById('pushTarget');
			const userAge    = document.getElementById('userAge');
			const pushType   = document.querySelector('.psh-info-type');
			document.getElementById("pushType").value = pushType;
			
			if (result.pushType == "0") {
				pushType.innerHTML = '즉시 발송';
			} else if (result.pushType == "1") {
				pushType.innerHTML = '예약 발송';
			} else {
				pushType.innerHTML = '발송 취소';
			}
			
			document.querySelector('.psh-info-time').innerHTML = '( ' + result.pushTime + ' )';
			pushTarget.innerHTML += result.pushTargetAdr == "Y" ? "Android, "   : ""; 
			pushTarget.innerHTML += result.pushTargetIos == "Y" ? "iOS, "       : ""; 
			pushTarget.innerHTML += result.pushTargetEtc == "Y" ? "특정 조건, " : "";
			pushTarget.innerHTML = pushTarget.innerHTML.slice(0, -2);
			
			if (result.pushTargetEtc == "Y") {
				// 초진/재진
				if (result.pushCond1 == "0") {
					userType.innerHTML = '전체'; 
				} else if (result.pushCond1 == "1") {
					userType.innerHTML = '초진';
				} else {
					userType.innerHTML = '재진';
				}
				
				// 성별
				if (result.pushCond2 == "0") {
					userGender.innerHTML = '전체'; 
				} else if (result.pushCond2 == "1") {
					userGender.innerHTML = '남성';
				} else {
					userGender.innerHTML = '여성';
				}
				
				// 나이
				if (result.pushCond3 == "0") {
					userAge.innerHTML = '전체';
				} else {
					
					const ageArr = result.pushCond3.replace(/\"/gi, "").split(',');

					userAge.innerHTML = '';
					
					for (let i=0; i < ageArr.length; i++) {
						const num = Number(ageArr[i]) + 5; 
						if (ageArr[i] == '65') {
							userAge.innerHTML += '65세 이상, ';
						} else { 
							userAge.innerHTML += ageArr[i] + '세 ~' + num + '세, ';
						}
					}
					userAge.innerHTML = userAge.innerHTML.slice(0, -2);
				}
				
				//의료진 지정
				if (result.pushCond5 == "0") {
					document.getElementById('fixedStaff').innerHTML = '선택 안함';
				} else {
					document.getElementById('fixedStaff').innerHTML = result.fixedDoctor + ", " + result.fixedStaff;
				}
									
				document.getElementById('pushPay').innerHTML = result.pushCond4 == "0" ? "선택 안함"    : result.pushCond4.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
				
				//등급
				if (result.pushCond6 == '0') {
					document.getElementById('userGrade').innerHTML = '전체';
				} else if (result.pushCond6 == '') {
					document.getElementById('userGrade').innerHTML = '일반';
				} else {
					document.getElementById('userGrade').innerHTML = result.pushCond6;
				}
			} 
			document.getElementById('expectCnt').innerHTML    = result.expectCount;
			document.getElementById('successCnt').innerHTML   = result.successCnt;
			document.getElementById('clickCnt').innerHTML     = result.clickCnt;
			document.getElementById('pushTitle').innerHTML    = result.messageTitle;
			document.getElementById('pushContent').innerHTML  = result.messageContent;
			document.getElementById('preOffice').innerHTML    = result.hospitalName;
			const status = document.getElementById('pushStatus');  
					
			if (result.pushStatus == "W") {
				if (result.pushType == "0") {
					status.innerHTML = '테스트 발송';
					document.querySelector('.info-push-test').style.display = 'block';
				} else {
					status.innerHTML = '발송 예정';
					document.querySelector('.info-push-cancel').style.display = 'block';
				}
			} else if (result.pushStatus == "S") {
				status.innerHTML = '발송 완료';
			} else {
				status.innerHTML = '발송 취소';
			}
			
			percentCalculation();
		}
	});
}

//상세정보 발송수 퍼센트 계산
function percentCalculation() {
	const total   = Number(document.getElementById('expectCnt').innerText); 
	let success   = Number(document.getElementById('successCnt').innerText) / total * 100; 
	let click     = Number(document.getElementById('clickCnt').innerText) / total * 100; 
	
	if (isNaN(success)) {
		success = 0;
	}
	if (isNaN(click)) {
		click = 0;
	}
	document.getElementById('successPercent').innerText = '(' + success.toFixed(1) + '%)'; 
	document.getElementById('clickPercent').innerText = '(' + click.toFixed(1) + '%)'; 
}

//통계 상세 페이지 이동
function goStatistics() {
	const seq = commonGetQueryString().get('seq');
	
	location.href = `/psh/psh002?seq=${seq}`;	
}

//상세 페이지 발송 취소
function pushCancel() {
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"pushSeq"       : commonGetQueryString().get('seq') 
	};
	
	commonAjax.call("/psh/updatePushCancel", "POST", params, function(data) {
		if (data.message == "OK") {
			location.reload();
			alert('발송 취소되었습니다.');
		}
	});		
}

//상세 페이지 테스트 발송 버튼
function infoPageTestPush() {
	const pushType  = document.getElementById("pushType").value; 
	const preOffice = document.getElementById('preOffice').innerText;
	const content =		
		   `<input type="hidden" id="testType" value="${pushType}">
			<div class="popup-tit">
				<p>푸시 발송하기</p>
				<p class="tit-text">테스트 발송 후 푸시 발송이 가능합니다</br>테스트 발송 시에는 해당 병원 직원에게 발송됩니다.</br>푸시 발송 팝업을 닫을 경우 다시 테스트 발송을 진햅합니다.</p>
			</div>
			
			<div class="popup-con">
				<div class="pre-div">
					<div class="pre-office">
						<span>${preOffice}</span>
						<span class="push-time">2분전</span>
					</div>
					<div class="pre-content">
						<span class="pre-tit">${document.getElementById('pushTitle').innerText}</span>
						<pre>${document.getElementById('pushContent').innerText}</pre>
					</div>
				</div>
			</div>
			
			<div class="popup-btn" id="btnArea">
				<div class="select-box push">
					<select id="testUser"></select>
					<div class="icon-arrow"></div>
				</div>
				<div id="spinner" style="display:none;">
					<div class="spinner-border" role="status">
					  <span class="visually-hidden">Loading...</span>
					</div>
				</div>
				
				<button class="save-btn blue-btn" type="button" onclick="updateTestUser('${commonGetQueryString().get('seq')}')">테스트 발송</button>
			</div>`;
	
	commonDrawPopup("draw", content);	
	getTestUser();
}