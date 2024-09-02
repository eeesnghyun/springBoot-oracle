var gridPrd004 = null;
var gridEvent004 = null;
var gridEventItem004 = null;
var gridPrdHis004 = null;
var gridEventItemHis004 = null;

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;
	
	getEventGroupList();
	getProductMtList();
	getProductList();
	getUpdateProductItemList();
	
	tabBtn();
	
	document.querySelector('#eventTitle').addEventListener('keyup', (e)=>{
		if (e.keyCode === 13) {
			getUpdateEventItemList();
		}  
	});

	document.querySelector('#prdItemName').addEventListener('keyup', (e)=>{
		if (e.keyCode === 13) {
			getUpdateProductItemList();
		}  
	});
}

//상단탭 이벤트 리스너
function tabBtn(seq) {
	const tit = document.querySelectorAll('.tab-tit li');
	const con = document.querySelectorAll('.tab-con');
	
	for (let i = 0; i < tit.length; i++) {
		tit[i].addEventListener('click' , function(){
			tit.forEach((ele) => ele.classList.remove('active'));
			con.forEach((ele) => ele.classList.remove('active'));
			
			tit[i].classList.add('active');
			document.querySelector(`.tab-con.${tit[i].dataset.type}`).classList.add('active');
			
			/*
			 * 2022.05.10 LSH
			 * 숨겨진 그리드 출력시 에디트 옵션이 적용되지 않는 현상 발생
			 * 그리드를 새로 그리기 위해 탭 클릭시 함수를 호출하도록 했다.
			 */ 
			if (tit[i].dataset.type == "event") {
				if (isNullStr(seq)) {
					getEventGroupList();	
				} else {
					getEventItemHistory(seq);
				}					
			} else {
				if (isNullStr(seq)) {
					getUpdateProductItemList();	
				} else {
					getProductItemHistory(seq);	
				}												
			}			
		});
	}
}

//지점 변경시 조회
function showGrid() {
	const tit = document.querySelectorAll('.tab-tit li');
	
	commonSetOfficeSite("#homePageUrl", {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	}, "");
	
	for (let i = 0; i < tit.length; i++) {
		if (tit[i].classList.contains("active")) {			
			if (tit[i].dataset.type == "event") {
				getEventGroupList();
			} else {
				getProductMtList();
				getProductList();
				getUpdateProductItemList();
			}						
			break;
		}	
	}		
}

//대분류 리스트 조회
function getProductMtList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};	
	
	commonAjax.call("/prd/getProductMtList", "POST", params, function(data) {
		const result = data.resultList;				
		
		if (data.message == "OK") {
			if (result.length > 0) {				
				let dataList = new Array();
				
				for (idx in result) {				
			        let data = new Object();
			         
			        data.code = result[idx].prdMstCode;
			        data.name = result[idx].prdMstName;

					dataList.push(data);
				}
				
				const comboObj = {"target" : "productMt", "data" : dataList};
				commonInitCombo(comboObj); 								
			}				
		}
	});		
}	

//일반 시술 중분류 리스트 조회
function getProductList(seq) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdMstCode"   : document.getElementById("productMt").value
	};	
	
	commonAjax.call("/prd/getProductList", "POST", params, function(data) {
		const result = data.resultList;				
		
		if (data.message == "OK") {		
			let dataList = new Array();
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].prdCode;
		        data.name = result[idx].prdName;

				dataList.push(data);
			}
			
			const comboObj = {"target" : "product", "data" : dataList, "defaultOpt" : "중분류 선택"};
			commonInitCombo(comboObj);

			if (isNullStr(seq)) {
				getUpdateProductItemList();
			} else {
				getProductItemHistory(seq);
			}
		}
	});		
}	

//일반 시술 소분류 리스트 조회
function getProductSubList(seq) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdCode"      : document.getElementById("product").value
	};	
	
	commonAjax.call("/prd/getProductSubList", "POST", params, function(data) {
		const result = data.resultList;				
		
		if (data.message == "OK") {		
			let dataList = new Array();
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].prdSubCode;
		        data.name = result[idx].prdSubName;

				dataList.push(data);
			}
			
			const comboObj = {"target" : "productSub", "data" : dataList, "defaultOpt" : "소분류 선택"};
			commonInitCombo(comboObj);			
		}				
	});		
	
	if (isNullStr(seq)) {
		getUpdateProductItemList();
	} else {
		getProductItemHistory(seq);
	}
}	

//일반 시술 그리드 조회
function getUpdateProductItemList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdMstCode"   : document.getElementById("productMt").value,
		"prdCode"      : document.getElementById("product").value,
		"prdSubCode"   : document.getElementById("productSub").value,
		"prdItemName"  : document.getElementById("prdItemName").value
	};					
	
	commonAjax.call("/prd/getUpdateProductItemList", "POST", params, function(data) {
    	const result = data.resultList;      
    	
    	if (data.message == "OK") {
        	if (isNullStr(gridPrd004)) {
        		//Grid draw
        		const cellMoneyClass = function(cell, formatterParams) {
    		    	cell.getElement().classList.add("cell-money");
    		    	
    		    	return cell.getValue().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        		}
        		
        		const cellEditClass = function(cell, formatterParams) {
    		    	cell.getElement().classList.add("cell-edit");
    		    	
    		    	return cell.getValue();	
        		}
        		
        		gridPrd004 = new Tabulator("#prdGrid", {    				    			
    			    layout: "fitColumns",
    			    rowFormatter: function(row) {
    			        if (row.getData().newYn == "Y") {
    			            row.getElement().style.backgroundColor = "#eceaf5";
    			        }
    			    },
    				pagination: "local",
    				paginationSize: 15,
    				paginationButtonCount: 9,
    				placeholder: "해당 데이터가 없습니다.",    				
    				maxHeight:"100%",
					autoColumnsDefinitions: {
						prdItemName: {editor: "input"},
						capacity   : {editor: "input"},
						price	   : {editor: "input"}
					},
        		    columns: [
        		    	{title: "번호" , formatter:"rownum" , resizable: false, headerSort: false, maxWidth: 50, hozAlign: "center"},	 
        		    	{title: "노출" , field: "displayYn" , resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false, formatter: function(cell, formatterParams, onRendered) {
			    	        if (cell._cell.row.data.displayYn == "노출") {
			    	            return "<span style='color: #4a4d9f;'>" + cell.getValue() + "</span>";
			    	        } else {
			    	            return "<span style='color: #999;'>" + cell.getValue() + "</span>";
			    	        }	       			    	
	       			 	}},
        		    	{title: "중분류"	      , field: "prdName"      , resizable: false , headerSort: false, maxWidth: 150, hozAlign: "center"},
        		    	{title: "중분류코드"     , field: "prdCode"      , visible: false},
        		    	{title: "소분류"	      , field: "prdSubName"   , resizable: false , headerSort: false, maxWidth: 250, hozAlign: "center"},
        		    	{title: "소분류코드"     , field: "prdSubCode"   , visible: false},        		    		        		    
        		    	{title: "일반 시술"	  , field: "prdItemName"  , editor: "input" , resizable: false, maxWidth: 500, hozAlign: "left", headerSort: false, formatter: cellEditClass},
        		    	{title: "일반시술코드"    , field: "prdItemCode"  , visible: false},
        		    	{title: "용량" 		  , field: "capacity"     , editor: "input" , resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false, formatter: cellEditClass},
        			    {title: "가격" 		  , field: "price"        , editor: "input" , resizable: false, maxWidth: 100, hozAlign: "left", headerSort: false, formatter: cellMoneyClass},        			    
        			    {title: "신규여부"		  , field: "newYn"		  , visible: false},
        			    {title: "소분류시술마지막유무", field: "lastIndex", visible: false}
        		    ]			  
        		});

        		//Data set
        		gridPrd004.on("tableBuilt", function(){				
        			gridPrd004.setData(result);		            					
        		});
        	} else {        		
        		gridPrd004.clearData();
        		gridPrd004.setData(result);
        	}        	        	
    	}    	
    });
}

//이벤트 그룹 그리드 조회
function getEventGroupList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};					
	
	commonAjax.call("/prd/getEventGroupList", "POST", params, function(data) {
		const result = data.resultList;      
	  	
	  	if (data.message == "OK") {
	  		drawEventList(result);
	  		
	      	if (isNullStr(gridEvent004)) {
	      		//Grid draw
	      		gridEvent004 = new Tabulator("#eventGrid", {    				    			
	  			    layout: "fitColumns",
	  				pagination: "local",
	  				paginationSize: 15,
	  				paginationButtonCount: 9,
	  				placeholder: "해당 데이터가 없습니다.",    				
	  				maxHeight:"100%",					
	      		    columns: [        		    			      		    	
	      		    	{title: "번호" , formatter: "rownum" , resizable: false, headerSort: false, maxWidth: 50, hozAlign: "center"},	
	      		    	{title: "노출" , field: "displayYn"  , resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false, formatter: function(cell, formatterParams, onRendered) {
			    	        if (cell._cell.row.data.displayYn == "Y") {
			    	            return "<span style='color: #4a4d9f;'>노출</span>";
			    	        } else {
			    	            return "<span style='color: #999;'>미노출</span>";
			    	        }	       			    	
	       			 	}},
		       			{title: "이벤트코드"      , field: "eventSeq" , visible: false},
		       			{title: "그룹"		   , field: "eventName", resizable: false, maxWidth: 200, hozAlign: "center", headerSort: false},
		       			{title: "특정 예약 가능 날짜" , field: "eventDate", resizable: false, maxWidth: 400, hozAlign: "center", headerSort: false},
		       			{title: "예약 가능 요일"	 , field: "eventDay" , resizable: false, maxWidth: 300, hozAlign: "center", headerSort: false},
		       			{title: "예약 가능 시간"	 , field: "eventTime", resizable: false, maxWidth: 200, hozAlign: "center", align:"center" , headerSort: false}	       			 	
	      		    ]			  
	      		});
	
	      		//Data set
	      		gridEvent004.on("tableBuilt", function(){				
	      			gridEvent004.setData(result);		            					
	      		});
	      	} else {        		
	      		gridEvent004.clearData();
	      		gridEvent004.setData(result);
	      	}        	        	
	  	}    	
	});
}

//이벤트 중그룹 리스트 조회
function drawEventList(result , seq) {
	let dataList = new Array();
	
	for (idx in result) {				
        let data = new Object();
         
        data.code = result[idx].eventSeq;
        data.name = result[idx].eventName;

		dataList.push(data);
	}
	
	const comboObj = {"target" : "event", "data" : dataList, "defaultOpt" : "그룹 선택"};
	commonInitCombo(comboObj); 				
	
	getEventSubList(seq);
}

//이벤트 소그룹 리스트 조회
function getEventSubList(seq) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"eventSeq"	   : document.getElementById("event").value
	};	
	
	commonAjax.call("/prd/getEventGroupSubList", "POST", params, function(data) {
		const result = data.resultList;				
		
		if (data.message == "OK") {						
			let dataList = new Array();
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].eventSubSeq;
		        data.name = result[idx].eventTitle;

				dataList.push(data);
			}
			
			const comboObj = {"target" : "eventSub", "data" : dataList, "defaultOpt" : "소그룹 선택"};
			commonInitCombo(comboObj); 				
			
			if (isNullStr(seq)) {
				getUpdateEventItemList();			
			} else {
				getEventItemHistory(seq);
			}
		}
	});		
}	

//이벤트 시술 그리드 조회
function getUpdateEventItemList() {
	const params = {
		"hospitalCode" 	    : document.getElementById("hospitalCode").value,
		"officeCode"  	    : document.getElementById("officeCode").value,
		"eventSeq"	  	    : document.getElementById("event").value,
		"eventSubSeq" 	    : document.getElementById("eventSub").value,
		"eventProductTitle" : document.getElementById("eventTitle").value		
	};			
	
	commonAjax.call("/prd/getUpdateEventItemList", "POST", params, function(data) {
    	const result = data.resultList;      
    	if (data.message == "OK") {
        	if (isNullStr(gridEventItem004)) {
        		const moveIcon = function(cell, formatterParams) {
        		    return "<img src='/resources/images/prd/Icon_sortMove.svg'>";
        		};
        		
        		const cellMoneyClass = function(cell, formatterParams) {
    		    	cell.getElement().classList.add("cell-money");
    		    	
    		    	return cell.getValue().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        		}
        		
        		const cellEditClass = function(cell, formatterParams) {
    		    	cell.getElement().classList.add("cell-edit");
    		    	
    		    	return "[EVENT] " + cell.getValue();		
        		}
        		
        		//Grid draw
        		gridEventItem004 = new Tabulator("#eventItemGrid", {    				    			
    			    layout: "fitColumns",
    			    rowFormatter: function(row) {
    			        if (row.getData().newYn == "Y") {
    			            row.getElement().style.backgroundColor = "#eceaf5";
    			        }
    			    },    			    
    				pagination: "local",
    				paginationSize: 15,
    				paginationButtonCount: 10,
    				placeholder: "해당 데이터가 없습니다.",    				
    				maxHeight: "100%",
    				autoColumnsDefinitions: {
    					eventProductTitle: {editor: "input"},
    					eventSale        : {editor: "input"},
    					eventPrice	     : {editor: "input"}
					},
        		    columns: [        		    		        		    	
        		    	{title: "번호" , formatter: "rownum" , resizable: false, headerSort: false, maxWidth: 50, hozAlign: "center"},	
        		    	{title: "노출" , field: "displayYn"  , resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false, formatter: function(cell, formatterParams, onRendered) {
			    	        if (cell._cell.row.data.displayYn == "Y") {
			    	            return "<span style='color: #4a4d9f;'>노출</span>";
			    	        } else {
			    	            return "<span style='color: #999;'>미노출</span>";
			    	        }	       			    	
	       			 	}},	       			 	
	       			 	{title: "중그룹코드"    , field: "eventSeq" 		, visible: false},
	       			 	{title: "소그룹코드"    , field: "eventSubSeq" 		, visible: false},
	       			 	{title: "이벤트시술코드", field: "eventProductCode" , visible: false},
	       			 	{title: "그룹"	    , field: "eventName"		, resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false},
	       			 	{title: "소그룹"	 	, field: "eventTitle"		, resizable: false, maxWidth: 180, hozAlign: "left", headerSort: false},
	       			 	{title: "이벤트 시술"	, field: "eventProductTitle", editor: "input" , formatter: cellEditClass, resizable: false, maxWidth: 500, hozAlign: "left", headerSort: false},
	       			 	{title: "할인가"		, field: "eventSale"		, editor: "input" , formatter: cellMoneyClass, resizable: false, maxWidth: 100, hozAlign: "left", align:"center" , headerSort: false},
	       			 	{title: "정상가"	 	, field: "eventPrice"		, editor: "input" , resizable: false, maxWidth: 100, hozAlign: "left", align:"center" , headerSort: false, formatter: cellMoneyClass},
	       			 	{title: "자세히 연결"	, field: "prdSubName"		, resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false},
	       			 	{title: "신규여부"	    , field: "newYn"		    , visible: false}
        		    ]			  
        		});

        		//Data set
        		gridEventItem004.on("tableBuilt", function(){				
        			gridEventItem004.setData(result);		            					
        		});
        	} else {        		
        		gridEventItem004.clearData();
        		gridEventItem004.setData(result); 
        	}        	        	
    	}    	
    });
}

function drawUpdatePopup() {	
	const startDate = commonGetToday("y.m.d");
	const today     = startDate.replace(/[^0-9]/g, "");
	const nextDate  = commonDateCalculate(today, 30);
	const endDate   = commonGetToday("y.m.d", nextDate);
	const content   =  
	    `<div class="popup-tit">
			<div class="text">
				<p>최종 업데이트(홈페이지 반영)</p>
				<span>이벤트 시술, 일반 시술 데이터 모두 반영됩니다. </br>
				최종 업데이트 내용이 맞는지 확인 후 반영해 주세요.</span>
			</div>
		</div>
		
		<div class="popup-con final-update" style="width: 360px">
			<div class="date-area">
	    		<label class="need">홈페이지 이벤트 진행 날짜</label>
	        	<div class="area">
			        <div class="con date">
		       			<input type="text" class="start-date" id="startDate" name="startDate" placeholder="시작일" autocomplete="off">
			        </div>
			      
		       		<i class="wave">~</i>
		       		
		        	<div class="con date">
		       			<input type="text" class="end-date" id="endDate" name="endDate" placeholder="종료일" autocomplete="off">
			        </div>
	        	</div>
			</div>
			
			<div class="status-area"></div>
		</div>
	
		<div class="popup-btn final-update-btn">
			<div id="spinner" style="display: none;">
				<div class="spinner-border" role="status">
				  <span class="visually-hidden">Loading...</span>
				</div>
			</div>
		
			<button type="button" class="full-update-btn" onclick="updateConfirmAlldata()">최종 업데이트 반영하기</button>
		</div>`;

	commonDrawPopup("draw", content);
	commonDatePicker(["startDate" , "endDate"]);
	
	//홈페이지 적용, 예정 데이터 리스트
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value
	};				
		
	commonAjax.call("/prd/getSummaryUpdateList", "POST", params, function(data) {		
		if (data.message == "OK") {	
			const result = data.resultList;
			
			if (result.length > 0) {
				const div = document.querySelector('.popup .status-area');
				
				result.forEach((item) => {
					div.innerHTML += 
						`<div class="${item.displayType}-active">
							<button type='button' class="${item.displayType}Btn"></button>
							<span>${item.eventDate}</span>
						</div>`;
				});
			}
		}
	});	
}

//최종 업데이트 실행
function updateConfirmAlldata() {
	const now       = new Date();
	const startDate = document.getElementById("startDate").value.replace(/[^0-9]/g,"");
	const endDate   = document.getElementById("endDate").value.replace(/[^0-9]/g,"");
	const todayDate = now.getFullYear() + ("0" + (1 + now.getMonth())).slice(-2) + ("0" + now.getDate()).slice(-2);
	let isSend = 'N' 
	
	if (isNullStr(startDate) || isNullStr(endDate)) {
		alert("이벤트 진행 날짜를 입력해주세요.");
		return;
	}
	
	//오늘 날짜가 시작, 종료일에 포함될 경우 
	if (startDate <= todayDate <= endDate) {
		isSend = 'Y';
	}
		
	document.getElementById("spinner").style.display = "block";
	document.querySelector(".full-update-btn").style.display = "none";
	isPop = false;
	
	setTimeout(function() {
		const params = {
			"hospitalCode"  : document.getElementById("hospitalCode").value,
			"officeCode"    : document.getElementById("officeCode").value,
			"prdItemList"   : JSON.stringify(gridPrd004.getData()),
			"eventItemList" : JSON.stringify(gridEventItem004.getData()),
			"startDate"     : startDate, 
			"endDate"       : endDate,
			"isSend"        : isSend
		};		
			
		commonAjax.call("/prd/updateConfirmAlldata", "POST", params, function(data) {		
			if (data.message == "OK") {	
				const content =  
				    `<div class="popup-con final-update" style="width:360px">
						<img src="/resources/images/prd/Icon_saveRound_color.svg">
						<p>최종 업데이트가 반영되었습니다.</p>
						<button class="go-home-btn" onclick="goPage()">홈페이지 바로가기</button>
					</div>
					
				
					<div class="popup-btn final-update-btn">
						<button type="button" class="full-btn" onclick="goHistory()">확인</button>
					</div>`;

				commonDrawPopup("draw", content);
			} else {
				alert(data.message);

				document.getElementById("spinner").style.display = "none";
				document.querySelector(".full-update-btn").style.display = "block";
			}
		});
	}, 2000);		
}

//업데이트 기록 보기
function goHistory() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"isTemp"	   : "Y"
	};
	
	popupClose();
	commonGoPage("/prd/prd004History", params);
}

//업데이트 기록 가져오기
function getHistory(hospitalCode, officeCode, seq) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;		
	document.getElementById("officeCode").value   = officeCode;	
	document.getElementById("hospitalCode").disabled = true;
	document.getElementById("officeCode").disabled   = true;
	
	getEventGroupHistory(seq);	
	getEventItemHistory(seq);
	getProductMtList();
	getProductList(seq);
	getProductItemHistory(seq);
	
	//상단탭 이벤트 리스너
	tabBtn(seq);

	document.querySelector('#eventTitle').addEventListener('keyup', (e)=>{
		if (e.keyCode === 13) {
			getEventItemHistory(seq);
		}  
	});
	
	document.querySelector('#prdItemName').addEventListener('keyup', (e)=>{
		if (e.keyCode === 13) {
			getProductItemHistory(seq);
		}  
	});
}

//이벤트 그룹 업데이트 기록 조회
function getEventGroupHistory(seq) {
	const params = {
		"hospitalCode"   : document.getElementById("hospitalCode").value,
		"officeCode"     : document.getElementById("officeCode").value,
		"eventUpdateSeq" : seq
	};					
	
	commonAjax.call("/prd/getEventGroupHistory", "POST", params, function(data) {
		const result = data.resultList;      
	  	
	  	if (data.message == "OK") {
	      	if (isNullStr(gridEvent004)) {
	      		//Grid draw
		  		drawEventList(result , seq);
		  		
	      		gridEvent004 = new Tabulator("#eventGrid", {    				    			
	  			    layout: "fitColumns",
	  				pagination: "local",
	  				paginationSize: 15,
	  				paginationButtonCount: 9,
	  				placeholder: "해당 데이터가 없습니다.",    				
	  				maxHeight:"100%",	
	      		    columns: [        		    		
	      		    	{title: "노출" , field: "displayYn" , resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false, formatter: function(cell, formatterParams, onRendered) {
			    	        if (cell._cell.row.data.displayYn == "Y") {
			    	            return "<span style='color: #4a4d9f;'>노출</span>";
			    	        } else {
			    	            return "<span style='color: #999;'>미노출</span>";
			    	        }	       			    	
	       			 	}},
		       			{title: "이벤트코드"      	 , field: "eventSeq" , visible: false},
		       			{title: "그룹"		     , field: "eventName", resizable: false, maxWidth: 200, hozAlign: "center", headerSort: false},
		       			{title: "특정 예약 가능 날짜", field: "eventDate", resizable: false, maxWidth: 400, hozAlign: "center", headerSort: false},
		       			{title: "예약 가능 요일"	 , field: "eventDay" , resizable: false, maxWidth: 300, hozAlign: "center", headerSort: false},
		       			{title: "예약 가능 시간"	 , field: "eventTime", resizable: false, maxWidth: 200, hozAlign: "center", headerSort: false}	       			 	
	      		    ]			  
	      		});
	
	      		//Data set
	      		gridEvent004.on("tableBuilt", function(){				
	      			gridEvent004.setData(result);		            					
	      		});	      		
	      	} else {        		
	      		gridEvent004.clearData();
	      		gridEvent004.setData(result);
	      	}        	        	
	  	}    	
	});
}

//이벤트 시술 업데이트 기록 조회 
function getEventItemHistory(seq) {
	const params = {
		"hospitalCode" 	    : document.getElementById("hospitalCode").value,
		"officeCode"  	    : document.getElementById("officeCode").value,
		"eventSeq"	  	    : document.getElementById("event").value,
		"eventSubSeq" 	    : document.getElementById("eventSub").value,
		"eventProductTitle" : document.getElementById("eventTitle").value,
		"eventUpdateSeq"    : seq,
	};					
	
	commonAjax.call("/prd/getEventItemHistory", "POST", params, function(data) {
    	const isEditYn = data.isEditYn;
		const result = data.resultList;      
    	const inputs = isEditYn == true ? 'input' : false;
    	const align  = isEditYn == true ? 'left' : 'center';
    	
    	if (data.message == "OK") {
    		const clickBtn = function(cell, formatterParams, onRendered) {        			
    			if (isEditYn) {
    				return "<button type='button' class='login-record edit-prd' style='max-width: 50px;'>수정</button>";	
    			}            		
        	};
        	
    		const cellMoneyClass = function(cell, formatterParams) {
    			if (isEditYn) {
    		    	cell.getElement().classList.add("cell-money");
    		    	
    		    	return cell.getValue().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    			} else {
    				return cell.getValue().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원'
    			}
    		}
    		
    		const cellEditClass = function(cell, formatterParams) {
    			if (isEditYn) {
    		    	cell.getElement().classList.add("cell-edit");	
    			}
		    	
		    	return "[EVENT] " + cell.getValue();
    		}
        	
    		//Grid draw
        	gridEventItemHis004 = new Tabulator("#eventItemGrid", {    				    			
			    layout: "fitColumns",
			    pagination: "local",
				paginationSize: 15,
				paginationButtonCount: 9,
				placeholder: "해당 데이터가 없습니다.",    	
				autoColumnsDefinitions: {
					eventProductTitle: {editor: "input"},
					eventSale        : {editor: "input"},
					eventPrice	     : {editor: "input"}
				},
				maxHeight: "100%",
				columns: [        		    		
    		    	{title: "노출" , field: "displayYn" , resizable: false, maxWidth: 50, hozAlign: "center", headerSort: false, formatter: function(cell, formatterParams, onRendered) {
		    	        if (cell._cell.row.data.displayYn == "Y") {
		    	            return "<span style='color: #4a4d9f;'>노출</span>";
		    	        } else {
		    	            return "<span style='color: #999;'>미노출</span>";
		    	        }	       			    	
       			 	}},
       			 	{title: "그룹"		  	  , field: "eventName"	      , resizable: false, maxWidth: 150, hozAlign: "center", headerSort: false},
       			 	{title: "소그룹"	 	  , field: "eventTitle"		  , resizable: false, maxWidth: 180, hozAlign: "left", headerSort: false},	       			 	
       			 	{title: "업데이트코드"    , field: "eventUpdateSeq"   , visible: false},
       			    {title: "이벤트중그룹코드", field: "eventSeq" 	      , visible: false},
       			    {title: "이벤트소그룹코드", field: "eventSubSeq"      , visible: false},
       			    {title: "이벤트시술코드"  , field: "eventProductCode" , visible: false},
       			 	{title: "이벤트 시술"	  , field: "eventProductTitle", editor: inputs , resizable: false, maxWidth: 500, hozAlign: "left", headerSort: false, formatter: cellEditClass},
       			 	{title: "할인가"		  , field: "eventSale"		  , editor: inputs , resizable: false, maxWidth: 100, hozAlign: align, align: align , headerSort: false, formatter: cellMoneyClass},
       			 	{title: "정상가"	 	  , field: "eventPrice"		  , editor: inputs , resizable: false, maxWidth: 100, hozAlign: align, align: align , headerSort: false, formatter: cellMoneyClass},
       			 	{title: "자세히 연결"	  , field: "prdSubName"		  , resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false},       			 	
       			    {formatter: clickBtn , maxWidth: 80  , hozAlign: "center", resizable: false, headerSort: false , cellClick:function(e, cell){ updateHistoryEventProduct(e, cell);}}
    		    ]			  
    		});

    		//Data set
        	gridEventItemHis004.on("tableBuilt", function(){				
        		gridEventItemHis004.setData(result);		            					
    		});
    	} else {        		
    		gridEventItemHis004.clearData();
    		gridEventItemHis004.setData(result);
    	}        	        	  	
    });
}

//이벤트 업데이트 기록 수정(반영 데이터)
function updateHistoryEventProduct(e, cell) {
	const params = {
		"hospitalCode"      : document.getElementById("hospitalCode").value,
		"officeCode"        : document.getElementById("officeCode").value,
		"eventUpdateSeq"    : cell._cell.row.data.eventUpdateSeq,
		"eventSeq" 			: cell._cell.row.data.eventSeq,
		"eventSubSeq" 	    : cell._cell.row.data.eventSubSeq,
		"eventProductCode"  : cell._cell.row.data.eventProductCode,
		"eventProductTitle" : cell._cell.row.data.eventProductTitle,
		"eventSale"         : cell._cell.row.data.eventSale,		
		"eventPrice" 	    : cell._cell.row.data.eventPrice
	};
    
	commonAjax.call("/prd/updateHistoryEventProductSurgical", "POST", params, function(data){
		if (data.message == "OK") {
			alert("수정되었습니다.");
		} else {
			alert(data.message);
		}
	});	
}

//일반 시술 업데이트 기록 조회
function getProductItemHistory(seq) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"updateSeq"    : seq,
		"prdMstCode"   : document.getElementById("productMt").value,
		"prdCode"      : document.getElementById("product").value,
		"prdSubCode"   : document.getElementById("productSub").value,
		"prdItemName"  : document.getElementById("prdItemName").value
	};					
		
	commonAjax.call("/prd/getProductItemHistory", "POST", params, function(data) {
		const isEditYn = data.isEditYn;
    	const result = data.resultList;      
    	const inputs = isEditYn == true ? 'input' : false;
    	
    	if (data.message == "OK") {
        	if (isNullStr(gridPrdHis004)) {
        		const clickBtn = function(cell, formatterParams, onRendered) {            		
        			if (isEditYn) {
        				return "<button type='button' class='login-record edit-prd' style='max-width: 50px;'>수정</button>";	
        			}               		
            	};
            	
        		const cellMoneyClass = function(cell, formatterParams) {
        			if (isEditYn) {
        		    	cell.getElement().classList.add("cell-money");
        		    	
        		    	return cell.getValue().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        			} else {
        				return cell.getValue().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원'
        			}
        		}
        		
        		const cellEditClass = function(cell, formatterParams) {
        			if (isEditYn) {
        		    	cell.getElement().classList.add("cell-edit");	
        			}
        			
    		    	return cell.getValue();
        		};

        		//Grid draw
            	gridPrdHis004 = new Tabulator("#prdGrid", {    				    			
    			    layout: "fitColumns",
    				pagination: "local",
    				paginationSize: 15,
    				paginationButtonCount: 9,
    				placeholder: "해당 데이터가 없습니다.",    				
    				maxHeight:"100%",	
    				autoColumnsDefinitions: {
    					prdItemName: {editor: "input"},
    					capacity   : {editor: "input"},
    					price      : {editor: "input"}
					},
        		    columns: [        		    		
        		    	{title: "노출" , field: "displayYn" , resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false, formatter: function(cell, formatterParams, onRendered) {
			    	        if (cell._cell.row.data.displayYn == "노출") {
			    	            return "<span style='color: #4a4d9f;'>" + cell.getValue() + "</span>";
			    	        } else {
			    	            return "<span style='color: #999;'>" + cell.getValue() + "</span>";
			    	        }	       			    	
	       			 	}},
        		    	{title: "중분류"	  , field: "prdName"      , resizable: false , headerSort: false, maxWidth: 150, hozAlign: "center"},        		    	
        		    	{title: "소분류"	  , field: "prdSubName"   , resizable: false , headerSort: false, maxWidth: 230, hozAlign: "center"},        		    	        		    	
        		    	{title: "일반 시술"	  , field: "prdItemName"  , editor: inputs , resizable: false, minWidth: 500, hozAlign: "left", headerSort: false, formatter: cellEditClass},
        		    	{title: "업데이트코드", field: "updateSeq"    , visible: false},
        		    	{title: "일반시술코드", field: "prdItemCode"  , visible: false},        		    	
        		    	{title: "용량" 		  , field: "capacity"     , editor: inputs , resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false , formatter: cellEditClass},
        			    {title: "가격" 		  , field: "price"        , editor: inputs , resizable: false, maxWidth: 100, hozAlign: "center", headerSort: false, formatter: cellMoneyClass},        			    
        		    	{formatter: clickBtn  , maxWidth: 80  , hozAlign: "center", resizable: false, headerSort: false , cellClick: function(e, cell){ updateHistoryProduct(e, cell);}}
        		    ]			  
        		});

        		//Data set
            	gridPrdHis004.on("tableBuilt", function(){				
            		gridPrdHis004.setData(result);		            					
        		});
        	} else {        		
        		gridPrdHis004.clearData();
        		gridPrdHis004.setData(result);
        	}        	        	
    	}    	
    });
}

//일반 시술 업데이트 기록 수정(반영 데이터)
function updateHistoryProduct(e, cell) {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"updateSeq"    : cell._cell.row.data.updateSeq,
		"prdItemCode"  : cell._cell.row.data.prdItemCode,
		"prdItemName"  : cell._cell.row.data.prdItemName,
		"capacity" 	   : cell._cell.row.data.capacity,
		"price" 	   : cell._cell.row.data.price
	};
  
	commonAjax.call("/prd/updateHistoryProductSurgical", "POST", params, function(data){
		if (data.message == "OK") {
			alert("수정되었습니다.");
		} else {
			alert(data.message);
		}
	});	
}

//화면 미리보기
function preview() {
	const type = document.querySelector(".tab-tit ul li.active").dataset.type;
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"prdItemList"   : JSON.stringify(gridPrd004.getData()),
		"eventItemList" : JSON.stringify(gridEventItem004.getData()),
		"type"          : type
	};	
	
	commonAjax.call("/prd/updatePreviewAlldata", "POST", params, function(data){
		if (data.message == "OK") {							
			commonSetOfficeSite("#homePageUrl", params);
			
			const page = document.getElementById("homePageUrl").innerHTML;
			
			window.open(page + "/preview/" + type, "_blank");				
		}
	});	
}

function goPage(){
	const type = document.querySelector(".tab-tit ul li.active").dataset.type;
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"prdItemList"   : JSON.stringify(gridPrd004.getData()),
		"eventItemList" : JSON.stringify(gridEventItem004.getData()),
		"type"          : type
	};	
	
	commonAjax.call("/prd/updatePreviewAlldata", "POST", params, function(data){
		if (data.message == "OK") {			
			commonSetOfficeSite("#homePageUrl", params);
			
			const page = document.getElementById("homePageUrl").innerHTML;
			
			window.open(page + "/" + type, "_blank");				
		}
	});
}

//업데이트 알림 설정 팝업 
function popUpdateAlarm(){
	document.querySelector('.popup-inner').classList.remove('final-update');
	
	const content =  
	    `<div class="popup-tit">
			<div class="text">
				<p>업데이트 알림 설정</p>
				<span>업데이트 관련 카카오 알림톡을 받을 계정을 선택해 주세요. 최대 5명까지 가능합니다.<br/>
				업데이트 종료는 5일 전, 업데이트 예정은 2일 전 부터 알림을 받을 수 있습니다.</span>
			</div>
		</div>
	    
	    <div class="popup-con" style="width:580px">
	    	<div class="update-alarm">
	    		<div class="update-alarm-list">
	    			<div class="update-alarm-title">
	    				<p>병원 계정 리스트</p>
	    			</div>
	    			
					<ul class="update-alarm-con scroll list-style"></ul>
	    		</div>
	    		
	    		<span></span>
	    		
	    		<div class="update-alarm-user">
	    			<div class="update-alarm-title">
	    				<p>업데이트 알림 계정</p>
	    				<p>(<span>0</span>/<span>5</span>)<p>
	    			</div>
	    			
	    			<ul class="update-alarm-con list-style"></ul>
	    		</div>
	    	</div>
		</div>
		
		<div class="popup-btn">
			<button type="button" class="save-btn blue-btn" onclick="updateNoticeUser()">저장하기</button>
		</div>`;

	commonDrawPopup("draw", content);
	
	getOfficeUserList();  //병원 계정 리스트 조회 
}

//병원 계정 리스트 조회 
function getOfficeUserList(){
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"useYn"        : 'Y'
	};	
	
	commonAjax.call("/usr/getOfficeUserList", "POST", params, function(data){
		if (data.message == "OK") {			
			const result    = data.resultList;
			const list      = document.querySelector('.update-alarm-list ul'); 
			const user      = document.querySelector('.update-alarm-user ul'); 
			const userCnt   = document.querySelectorAll('.update-alarm-title span')[0];
			
			if (result.length > 0) {
				list.innerHTML = '';
				user.innerHTML = '';
				
				result.forEach((item) => {
					list.innerHTML += `<li data-id="${item.sysUserId}" data-yn="n" onclick="addUpdateUser(this)">${item.sysName}</li>`;	
					
					if (item.noticeUser == 'Y') {
						user.innerHTML += 
							`<li data-id="${item.sysUserId}">
								${item.sysName}
								<button type='button' class="del-btn" onclick="delUpdateUser(this)"></button>
							</li>`;
						
						list.querySelector('li:last-child').classList.add('active');
						userCnt.innerText = Number(userCnt.innerText) + 1;
					}
				});
			}
		}
	});
}

//업데이트 알림 계정 추가 
function addUpdateUser(target){
	const user    = document.querySelector('.update-alarm-user ul'); 
	const userCnt = document.querySelectorAll('.update-alarm-title span')[0];
	
	if (target.dataset.yn == 'n') {
		if (Number(userCnt.innerText) < 5) {
			userCnt.innerText = Number(userCnt.innerText) + 1;
			
			target.classList.add('active');
			target.dataset.yn = 'y';
			
			//업데이트 알림 계정에 추가 
			user.innerHTML += 
				`<li data-id="${target.dataset.id}">
					${target.innerText}
					<button type='button' class="del-btn" onclick="delUpdateUser(this)"></button>
				</li>`	
		} else {
			alert('업데이트 알림 계정 최대 인원을 초과하였습니다.');
		}	
	}
}

//업데이트 알림 계정 삭제
function delUpdateUser(target){
	const id        = target.parentElement.dataset.id;
	const list      = document.querySelectorAll('.update-alarm-list li'); 
	const userCnt   = document.querySelectorAll('.update-alarm-title span')[0];
	
	target.parentElement.remove();
	
	list.forEach((item) => {
		if (item.dataset.id == id) {
			item.classList.remove('active');
			item.dataset.yn = 'n';
			userCnt.innerText = Number(userCnt.innerText) - 1;
		}
	})
}

//업데이트 알림 설정 저장
function updateNoticeUser() {
	const user      = document.querySelectorAll('.update-alarm-user li'); 
	const sysUserId = new Array();
	
	user.forEach((item) => {
		sysUserId.push(item.dataset.id)
	});
	
	const params = {
		"hospitalCode"  : document.getElementById("hospitalCode").value,
		"officeCode"    : document.getElementById("officeCode").value,
		"sysUserId"     : sysUserId.toString(),
	};	
	
	commonAjax.call("/prd/updateNoticeUser", "POST", params, function(data){
		if (data.message == "OK") {			
			alert('업데이트 알림 설정이 저장되었습니다.');
			popupClose();
		}
	});
}