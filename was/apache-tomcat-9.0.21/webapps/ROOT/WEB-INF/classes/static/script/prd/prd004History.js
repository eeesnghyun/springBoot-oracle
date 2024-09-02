var gridHistory004 = null;

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);

	document.getElementById("hospitalCode").value = hospitalCode;	
	document.getElementById("officeCode").value = officeCode;	
	
	getUpdateDataList();
}

function setHistoryInfo(e, cell) {
	if (e.target.className === "login-record") {
		commonGoPage("/prd/prd004?seq=" + cell._cell.row.data.eventUpdateSeq, "");
	}
}

//최종 업데이트 데이터 기록 조회
function getUpdateDataList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};					

	commonAjax.call("/prd/getUpdateDataList", "POST", params, function(data) {
		const result = data.resultList;      
	
		if (data.message == "OK") {
	       	const statusBtn = function(cell, formatterParams) {
	    		const displayYn = cell._cell.row.data.displayYn;
	    		const newYn 	= cell._cell.row.data.newYn;

	    		if (displayYn == "Y") {
	    			status = true;  
	    			return `<button type="button" class="applyBtn"></button> ${cell.getValue()}`;
	    		} else {
	    			if (newYn == "Y") {
		    			status = true;  
		    			return `<button type="button" class="newBtn"></button> ${cell.getValue()}`;
		    		} else {
		    			status = false;
		    			return `<button type="button"></button> ${cell.getValue()}`;
		    		}
	    		}	    		
	       	}
	       	
			const clickBtn = function(cell, formatterParams, onRendered) { //plain text value	       		
	       		return `<button type='button' class='login-record'>시술 확인</button>`;
	       	};
	       	
	    	if (isNullStr(gridHistory004)) {
	    		//Grid draw
	    		gridHistory004 = new Tabulator("#historyGrid", {   
				    layout: "fitColumns",
				    movableRows: false,
					pagination: "local",
					paginationSize: 15,
					paginationButtonCount: 9,
					placeholder: "해당 데이터가 없습니다.",    				
					maxHeight:"100%",	
	    		    columns: [        	
	    		    	{title: "병원코드"			       , field: "hospitalCode"  , visible: false},
	    		    	{title: "지점코드"				   , field: "officeCode"    , visible: false},
		       			{title: "번호"   			       , field: "eventUpdateSeq", resizable: false, width: 50 , hozAlign: "center", headerSort: false},
		       			{title: "홈페이지 이벤트 진행 날짜", field: "eventDate" 	, resizable: false, width: 500, hozAlign: "center", headerSort: false , formatter: statusBtn},
		       			{title: "최종 업데이트 진행 날짜"  , field: "createDate" 	, resizable: false, width: 400, hozAlign: "center", headerSort: false},
		       			{title: "업데이트 진행자"          , field: "createUser" 	, resizable: false, width: 200, hozAlign: "center", headerSort: false},
		       			{title: "적용 여부"		           , field: "displayYn" 	, visible: false},
		       			{title: "적용 예정 여부"	       , field: "newYn" 		, visible: false},
		       			{formatter: clickBtn, resizable: false, width: 100, headerSort: false, cellClick: function(e, cell){ setHistoryInfo(e, cell); }}	       			 			       			
	    		    ]			  
	    		});

	    		//Data set
	    		gridHistory004.on("tableBuilt", function(){		
	    			gridHistory004.setData(result);
	    		});
	    	} else {        		
	    		gridHistory004.clearData();
	    		gridHistory004.setData(result);
	    	}    
		}    	
	});		
}
