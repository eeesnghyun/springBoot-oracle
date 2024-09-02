
var gridPge002 = null;

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;			
	document.getElementById("officeCode").value = officeCode;	
	
	getPopList();
}

function setPopInfo(e, cell) {
	if (e.target.className === "login-record") {		//수정
		const seq    = cell._cell.row.data.seq;
		const params = {
			"hospitalCode"   : cell._cell.row.data.hospitalCode,
			"officeCode"     : cell._cell.row.data.officeCode,
			"hospitalName"   : cell._cell.row.data.hospitalName,
			"officeLocation" : cell._cell.row.data.officeLocation
		};
		
		commonGoPage(`/pge/pge002Add?seq=${seq}`, params);
	} else if (e.target.className === "login-delete") {	//삭제		
		if (confirm("삭제하시겠습니까?")) {
			const params = {
				"hospitalCode" : cell._cell.row.data.hospitalCode,
				"officeCode"   : cell._cell.row.data.officeCode,
				"seq" 		   : cell._cell.row.data.seq
			};
		        
			commonAjax.call("/pge/deleteHomePopup", "POST", params, function(data){
				if (data.message == "OK") {
					alert("삭제되었습니다.");
				    
					getPopList();
				}
			});	
		}
	}
}

function getPopList() {			
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};

	commonAjax.call("/pge/getHomePopupList", "POST", params, function(data) {
		const result = data.resultList;      
		
		commonSetOfficeSite("#homePageUrl", params);
		
	   	if (data.message == "OK") {
	   		const clickBtn = function(cell, formatterParams, onRendered) { //plain text value
	       		let btn = "";
	       		btn += "<button type='button' class='login-record' style='margin-right: 10px;'>수정</button>";
	       		btn	+= "<button type='button' class='login-delete'>삭제</button>";
	       		return btn;
	       	};
	       		       	
	       	if (isNullStr(gridPge002)) {	       		
	       		//Grid draw
	           	gridPge002 = new Tabulator("#divGrid", {    				    			
	   			    layout: "fitDataStretch",
	   				pagination: "local",
	   				paginationSize: 15,
	   				paginationButtonCount: 9,
	   				placeholder: "해당 데이터가 없습니다.",
	   				maxHeight:"100%",
	       		    columns: [
	       		    	{title: "SEQ"      , field: "seq", visible: false},
	       		    	{title: "병원코드" , field: "hospitalCode"  , visible: false},
	       		    	{title: "지점코드" , field: "officeCode"    , visible: false},
	       		    	{title: "병원이름" , field: "hospitalName"  , visible: false},
	       		    	{title: "지점이름" , field: "officeLocation", visible: false},
	       		    	{title: "팝업 제목", field: "popTitle"      , resizable: false, minWidth: 350, hozAlign: "center", headerSort: false},
	       		    	{title: "팝업타입" , field: "popType"       , visible: false},
	       		    	{title: "타입"	   , field: "popTypeNm"     , resizable: false, minWidth: 80 , hozAlign: "center", headerSort: false},
	       		    	{title: "순서"     , field: "popOrder"      , resizable: false, minWidth: 60 , hozAlign: "center", headerSort: false},
	       		    	{title: "노출"     , field: "displayYn"     , resizable: false, minWidth: 60 , hozAlign: "center", headerSort: false, formatter: function(cell, formatterParams) {
				    		const value = cell.getValue();

			    	        if (value.indexOf("미") == -1 && cell._cell.row.data.isInclude == "Y"){
			    	        	return "<span style='color: #3E51B5;'>" + value + "</span>";
			    	        } else{
			    	        	return value ;
			    	        }
			    	    }},			    	
	       			    {title: "게시일"   , field: "popupDate"     , resizable: false, minWidth: 250, hozAlign: "center", headerSort: false, formatter: function(cell, formatterParams, onRendered) {	       			 			       			    		     
	       			    	const value = cell._cell.row.data.isInclude;
							
			    	        if (value == "Y") {
			    	            return "<span style='color: #3E51B5;'>" + cell.getValue() + "</span>";
			    	        } else {
			    	            return cell.getValue();
			    	        }	       			    	
	       			 	}},
	       			 	{title: "등록일"   , field: "createDate" , resizable: false, minWidth: 200, hozAlign: "center", headerSort: false},
	       				{title: "등록인"   , field: "createUser" , resizable: false, minWidth: 200, hozAlign: "center", headerSort: false},
	       				{title: "오늘포함" , field: "isInclude"  , visible: false},
	       			    {formatter: clickBtn, resizable:false  , minWidth: 150, headerSort: false, cellClick: function(e, cell){ setPopInfo(e, cell); }}
	       		    ]			  
	       		});

	       		//Data set
	           	gridPge002.on("tableBuilt", function(){
	           		gridPge002.setData(result);			    				
	       		});		
	       	} else {
	       		gridPge002.clearData();
	       		gridPge002.setData(result);
	       	}        	        	
	   	}    	
	});
}	

//팝업추가 페이지 이동
function addPopup() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value 
	};
	
	commonGoPage("/pge/pge002Add", params);
}