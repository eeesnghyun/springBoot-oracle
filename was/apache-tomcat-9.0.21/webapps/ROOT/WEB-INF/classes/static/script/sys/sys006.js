var gridSysAdd001  = null;
var gridSysAdd002  = null;
var clientCheck = false;

function init() {
	tabClick();
	getInquireList();
	handleClientLoad();
}

function tabClick() {
	const btn = document.querySelectorAll('.btn-tab');
	const con = document.querySelectorAll('.grid-area');
	
	for (let i = 0; i < btn.length; i ++) {
		btn[i].addEventListener('click', function (){
			
			for (let j = 0; j < btn.length; j ++ ) {
				
				con[j].style.display = "none";
				btn[j].classList.remove('active');
			}
			con[i].style.display ="block";
			btn[i].classList.add('active');
		});
	}
}

// 개원문의 리스트 조회
function getInquireList() {
	const apiKey = 'AIzaSyBZ3pS6Aco6QQ9p69u6oerZv0HoqJyOj0o';
	const sheetId1 = '19n14jreXURDZHwcGXiZeagephZfYAnNmXc0Pgsp--Kk'; //신규 
	const sheetId2 = '1471KHYlmMp4jOaxubZIyq__GgKH5wxHuWD41N1Hq7nE'; //이전
	const url1 = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId1}/values/responses?key=${apiKey}`;
	const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId2}/values/responses?key=${apiKey}`;

	//신규개원 
	fetch(url1)	
	    .then((response) => {
			if (response.ok) {
				return response.json();		
			}
		})
	    .then((data) => {
	    	delete data.values[0];

	        if (isNullStr(gridSysAdd001)) {        	
	        	var tableData = data.values;
	        	
	        	gridSysAdd001 = new Tabulator("#grid1", {  
	        		data: tableData,
	        		index: "index",
    			    layout: "fitColumns",
    			    pagination: "local",
    				paginationSize: 15,
    				paginationButtonCount : 9,    	
    				placeholder: "해당 데이터가 없습니다.",
    				maxHeight: "100%",
    			    columns: [
    			    	{title: "이름"           , field: "1" , width: 150, headerHozAlign: "center", hozAlign: "center", resizable: false},
    			    	{title: "연락처"         , field: "4" , width: 200, headerHozAlign: "center", hozAlign: "center", resizable: false},
    			    	{title: "개원 희망 지역" , field: "5" , width: 200, headerHozAlign: "center", hozAlign: "center", resizable: false},
    			    	{title: "개원 희망 날짜" , field: "6" , width: 200, headerHozAlign: "center", hozAlign: "center", resizable: false,
    			    		formatter:function(cell){
    			    			const date = cell.getValue();
    			    			return dataFomatChange(1, date);
    			    		}
    			    	},
    			    	{title: "문의 내용"      , field: "7" , width: 200, headerHozAlign: "center", hozAlign: "center", resizable: false,
    			    		cellClick:function(e, cell){ 
    			    			 openPopup(cell.getValue());
			    			},
    			    		formatter:function(e,cell){
    			    			return "<button type='button' class='btn-inqury-content'>내용 확인하기</button>";
    			    		}
    			    	},
    			    	{title: "문의 날짜"      , field: "0" , width: 240, headerHozAlign: "center", hozAlign: "center", resizable: false,
    			    		formatter:function(cell){
    			    			const date = cell.getValue();
    			    			return dataFomatChange(2, date);
    			    		}
    			    	},
    			    	{title: "확인"           , field: "8" , width: 180, headerHozAlign: "center", hozAlign: "center", resizable: false,
    			    		formatter:function(cell){
    			    			var seq = this.table.rowManager.activeRows.indexOf(cell.getRow()._getSelf()) + 2;

     			    			if (cell.getValue() == "Y") {
     			    				return "<button type='button' class='btn-check active' data-seq='" + seq + "' value='N' onclick='makeApiCall(this, 1)'>확인완료</button>";
     			    			} else {
     			    				return "<button type='button' class='btn-check' data-seq='" + seq + "' value='Y' onclick='makeApiCall(this, 1)'>확인완료</button>";
     			    			}
    			    		}
    			    	}
    			    ]
    			}); 
	        	
        		//Data set
	        	gridSysAdd001.on("tableBuilt", function(){				
	        		gridSysAdd001.setData(tableData);			    				
        		});
        	} else {      		
        		gridSysAdd001.clearData();
        		gridSysAdd001.setData(tableData);
        	}
	        
	        document.querySelector('.new-cnt').innerHTML = '(' + Number( data.values.length - 1) + ')';
	    });
	
	//이전문의
	fetch(url2)	
    .then((response) => {
		if (response.ok) {
			return response.json();		
		}
	})
	 .then((data) => {
	        delete data.values[0];
	        
	        if (isNullStr(gridSysAdd002)) {        	
	        	var tableData = data.values;
	        	
	        	gridSysAdd002 = new Tabulator("#grid2", {  
        		data:tableData,
 			    layout: "fitColumns",
 			    pagination: "local",
 				paginationSize: 15,
 				paginationButtonCount : 9,    	
 				placeholder: "해당 데이터가 없습니다.",
 				maxHeight: "100%",
 			    columns: [    			    	
 			    	{title: "이름"                    , field: "1" , width: 150, headerHozAlign: "center", hozAlign: "center", resizable: false},
 			    	{title: "연락처"                  , field: "4" , width: 200, headerHozAlign: "center", hozAlign: "center", resizable: false},
 			    	{title: "현재 병원위치/운영 기간" , field: "5" , width: 200, headerHozAlign: "center", hozAlign: "center", resizable: false,
 			    		formatter:function(cell){
			    			return cell.getValue() + "/" + cell._cell.row.data[6];
			    		}
 			    	},
 			    	{title: "이전 희망 날짜"          , field: "7" , width: 200, headerHozAlign: "center", hozAlign: "center", resizable: false,
			    		formatter:function(cell){
			    			const date = cell.getValue();
			    			return dataFomatChange(1, date);
			    		}
			    	},
 			    	{title: "문의 내용"               , field: "8" , width: 200, headerHozAlign: "center", hozAlign: "center", resizable: false,
 			    		cellClick:function(e, cell){ 
 			    			 openPopup(cell.getValue());
			    			},
 			    		formatter:function(e,cell){
 			    			return "<button type='button' class='btn-inqury-content'>내용 확인하기</button>";
 			    		}
 			    	},
			    	{title: "문의 날짜"               , field: "0" , width: 240, headerHozAlign: "center", hozAlign: "center", resizable: false,
			    		formatter:function(cell){
			    			const date = cell.getValue();
			    			return dataFomatChange(2, date);
			    		}
			    	},
 			    	{title: "확인"                    , field: "9" , width: 180, headerHozAlign: "center", hozAlign: "center", resizable: false,
 			    		formatter:function(cell){
 			    			var seq = this.table.rowManager.activeRows.indexOf(cell.getRow()._getSelf()) + 2;
 			    			
 			    			if (cell.getValue() == "Y") {
 			    				return "<button type='button' class='btn-check active' data-seq='" + seq + "' value='N' onclick='makeApiCall(this, 2)'>확인완료</button>";
 			    			} else {
 			    				return "<button type='button' class='btn-check' data-seq='" + seq + "' value='Y' onclick='makeApiCall(this, 2)'>확인완료</button>";
 			    			}
 			    		}
 			    	}
 			    ]			  
 			});     	
	        	
    		//Data set
        	gridSysAdd002.on("tableBuilt", function(){				
        		gridSysAdd002.setData(tableData);			    				
    		});
    	} else {      		
    		gridSysAdd002.clearData();
    		gridSysAdd002.setData(tableData);
    	}
    	
        document.querySelector('.move-cnt').innerHTML = '(' + Number( data.values.length - 1) + ')';
	    });
}

//내용 확인하기 팝업
function openPopup(con) {
	const content = 
		`<div class="popup-tit">
		        <p>문의 내용 확인하기</p>
		    </div>
			    
		    <div class="popup-con">
		    	<div class='content-box'>${con}</div>
			</div>`;
	
	commonDrawPopup("draw", content);
}

//날짜형식 포맷
function dataFomatChange(type, val) {
	let date = '';
	
	if (type == '1') {
		var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
		
		if (!regex.test(val)) {
			date = val;
		} else {
			date = val.substr(0,4) + '년 ' + val.substr(5,2) + '월 ' + val.substr(8,2) + '일';
		}
	} else {
		const time = val.substr(11,2);
		let hour =  Number(time) ? time : Number(time) - 12; 
		let h = Number(time) < 12 ? "오전 " : "오후 ";
		
		date = val.substr(6,4) + '년 ' + val.substr(3,2) + '월 ' + val.substr(0,2) + '일 ' + h + hour + ':' + val.substr(14,2) ;
	}
	
	return date;
}

function makeApiCall(target, type) {
	if (clientCheck) {
	    const range         = type == 1 ? 'I' + target.dataset.seq : 'J' + target.dataset.seq;
	    const spreadsheetId = type == 1 ? '19n14jreXURDZHwcGXiZeagephZfYAnNmXc0Pgsp--Kk' : '1471KHYlmMp4jOaxubZIyq__GgKH5wxHuWD41N1Hq7nE';
	    const cellValue     = target.value;
	    
    	const params = {
			spreadsheetId: spreadsheetId,
		    range: range,
		    valueInputOption: 'USER_ENTERED'
    	}

	    var valueRangeBody = {
	        "range": range,
	        "values": [
	            [
	            	cellValue
	            ]
	        ]
	    };

	    var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
	    request.then(function(response) {
	    	target.classList.toggle('active');
	    }, function(reason) {
	    	console.error('error: ' + reason.result.error.message);
	    });	
	}
}

function initClient() {
    const CLIENT_ID = '682222336099-fi2s24r1loabocrsqkacesa4tfvcbdt4.apps.googleusercontent.com';
    const API_KEY   = 'AIzaSyBZ3pS6Aco6QQ9p69u6oerZv0HoqJyOj0o';
    const SCOPE     = 'https://www.googleapis.com/auth/spreadsheets';

	gapi.client.init({
	  'apiKey'  : API_KEY,
	  'clientId': CLIENT_ID,
	  'scope'   : SCOPE,
	  'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
	  'plugin_name'  : 'WINWINLAB'
	}).then(function() {
		if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
			 gapi.auth2.getAuthInstance().signIn().then(() => {
				 initClient();
			 });
		} else {
			clientCheck = true;
		}
	});
}

function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}