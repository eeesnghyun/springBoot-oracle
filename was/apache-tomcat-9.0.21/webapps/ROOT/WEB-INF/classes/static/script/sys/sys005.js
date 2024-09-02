var gridSys005 = null;
var gridSys005E = null;

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	commonDatePicker(["startDate" , "endDate"], '' , getAllProductList);

	document.getElementById("hospitalCode").value = hospitalCode;
	document.getElementById("officeCode").value = officeCode;	
	
	initGrid();
}

function initGrid() {	
	gridSys005 = new Tabulator("#divGrid", {    				    				
		layout: "fitColumns",
		rowFormatter: function(row) {
	        if (row.getData().applyYn == "Y") {
	            row.getElement().style.backgroundColor = "#eceaf5";
	        }
	    },
	    pagination: "local",
		paginationSize: 10,
		paginationButtonCount : 9,    	
		placeholder: "시술을 검색하세요.",
		maxHeight: "100%",
	    columns: [
	    	{title: "업데이트코드"  , field: "updateSeq"   , width: 100	  , hozAlign: "center", resizable: false},
	    	{title: "적용일자"	    , field: "applyDate"   , width: 150	  , hozAlign: "center", resizable: false},
	    	{title: "대분류코드"	, field: "prdMstCode"  , width: 100	  , hozAlign: "center", resizable: false},
	    	{title: "대분류명"	    , field: "prdMstName"  , width: 200	  , hozAlign: "left"  , resizable: false},
	    	{title: "중분류코드"	, field: "prdCode"     , width: 100	  , hozAlign: "center", resizable: false},
	    	{title: "중분류명"	    , field: "prdName"     , width: 200	  , hozAlign: "left"  , resizable: false},
	    	{title: "소분류코드"	, field: "prdSubCode"  , width: 100	  , hozAlign: "center", resizable: false},
	    	{title: "소분류명"	 	, field: "prdSubName"  , width: 200   , hozAlign: "left"  , resizable: false},
	    	{title: "일반시술코드"	, field: "prdItemCode" , width: 100   , hozAlign: "center", resizable: false},
	    	{title: "일반시술명"	, field: "prdItemName" , minWidth: 200, hozAlign: "left"  , resizable: false},
	    	{title: "적용여부"   	, field: "applyYn" 	   , visible: false}
	    ]			  
	});
	
	gridSys005E = new Tabulator("#divGridE", {    				    				
		layout: "fitColumns",
		rowFormatter: function(row) {
	        if (row.getData().applyYn == "Y") {
	            row.getElement().style.backgroundColor = "#eceaf5";
	        }
	    },
	    pagination: "local",
		paginationSize: 10,
		paginationButtonCount : 9,    	
		placeholder: "시술을 검색하세요.",
		maxHeight: "100%",		
		columns: [
	    	{title: "업데이트코드" , field: "eventUpdateSeq"   , width: 100	  , hozAlign: "center", resizable: false},
	    	{title: "적용일자"	   , field: "applyDate"        , width: 150	  , hozAlign: "center", resizable: false},
	    	{title: "중그룹코드"   , field: "eventSeq"  	   , visible: false},
	    	{title: "이벤트중그룹" , field: "eventName"  	   , width: 200	  , hozAlign: "left"  , resizable: false},
	    	{title: "소그룹코드"   , field: "eventSubSeq"      , visible: false},
	    	{title: "이벤트소그룹" , field: "eventTitle"       , width: 200	  , hozAlign: "left"  , resizable: false},
	    	{title: "이벤트타입"   , field: "eventProductType" , width: 100	  , hozAlign: "center", resizable: false},
	    	{title: "이벤트시술"   , field: "eventProductTitle", width: 200   , hozAlign: "left"  , resizable: false},
	    	{title: "그룹코드"	   , field: "eventDetailSeq"   , width: 100   , hozAlign: "center", resizable: false},
	    	{title: "대분류명"	   , field: "prdMstName" 	   , minWidth: 200, hozAlign: "left"  , resizable: false, 
	    									cellClick:function(e, cell){
	    										alert("일반시술 : " + cell._cell.row.data.prdItemName); //display the cells value							
	    									}	            
	        },
	    	{title: "일반시술모음" , field: "prdItemName" 	   , visible: false},
	    	{title: "적용여부"     , field: "applyYn" 	   	   , visible: false}
	    ]		  
	});
}

//일반 시술 리스트 조회
function getAllProductList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"field" 	   : document.getElementById("field").value,
		"start"   	   : document.getElementById("startDate").value.replace(/[^0-9]/gi,""),
		"end"   	   : document.getElementById("endDate").value.replace(/[^0-9]/gi,"")
	};
	
    commonAjax.call("/sys/getAllProductList", "POST", params, function(data) {
    	const result = data.resultList;
    	
    	if (data.message == "OK") {    		
    		if (isNullStr(gridSys005)) {
    			gridSys005 = new Tabulator("#divGrid", {    				    				
    				layout: "fitColumns",
    				rowFormatter: function(row) {
    			        if (row.getData().applyYn == "Y") {
    			            row.getElement().style.backgroundColor = "#eceaf5";
    			        }
    			    },
     			    pagination: "local",
     				paginationSize: 15,
     				paginationButtonCount : 9,    	
     				placeholder: "해당 데이터가 없습니다.",
     				maxHeight: "100%",
    			    columns: [
    			    	{title: "업데이트코드"  , field: "updateSeq"   , width: 100	  , hozAlign: "center", resizable: false},
    			    	{title: "적용일자"	    , field: "applyDate"   , width: 150	  , hozAlign: "center", resizable: false},
    			    	{title: "대분류코드"	, field: "prdMstCode"  , width: 100	  , hozAlign: "center", resizable: false},
    			    	{title: "대분류명"	    , field: "prdMstName"  , width: 200	  , hozAlign: "left"  , resizable: false},
    			    	{title: "중분류코드"	, field: "prdCode"     , width: 100	  , hozAlign: "center", resizable: false},
    			    	{title: "중분류명"	    , field: "prdName"     , width: 200	  , hozAlign: "left"  , resizable: false},
    			    	{title: "소분류코드"	, field: "prdSubCode"  , width: 100	  , hozAlign: "center", resizable: false},
    			    	{title: "소분류명"	 	, field: "prdSubName"  , width: 200   , hozAlign: "left"  , resizable: false},
    			    	{title: "일반시술코드"	, field: "prdItemCode" , width: 100   , hozAlign: "center", resizable: false},
    			    	{title: "일반시술명"	, field: "prdItemName" , minWidth: 200, hozAlign: "left"  , resizable: false},
    			    	{title: "적용여부"   	, field: "applyYn" 	   , visible: false}
    			    ]			  
    			});

        		//Data set
        		gridSys005.on("tableBuilt", function(){				
        			gridSys005.setData(result);			    				
        		});
        	} else {        		
        		gridSys005.clearData();
        		gridSys005.setData(result);
	    	}  
    	}
    });		    
}

//이벤트 시술 리스트 조회
function getAllEventProductList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"field" 	   : document.getElementById("field2").value,
		"start"   	   : document.getElementById("startDate2").value.replace(/[^0-9]/gi,""),
		"end"   	   : document.getElementById("endDate2").value.replace(/[^0-9]/gi,"")
	};
	
  commonAjax.call("/sys/getAllEventProductList", "POST", params, function(data) {
  	const result = data.resultList;
  	
  	if (data.message == "OK") {    		
  		if (isNullStr(gridSys005E)) {
  			gridSys005E = new Tabulator("#divGridE", {    				    				
  				layout: "fitColumns",
  				rowFormatter: function(row) {
  			        if (row.getData().applyYn == "Y") {
  			            row.getElement().style.backgroundColor = "#eceaf5";
  			        }
  			    },
  			    pagination: "local",
  				paginationSize: 10,
  				paginationButtonCount : 9,    	
  				placeholder: "해당 데이터가 없습니다.",
  				maxHeight: "100%",  			
  			    columns: [
  			    	{title: "업데이트코드" , field: "eventUpdateSeq"   , width: 100	  , hozAlign: "center", resizable: false},
  			    	{title: "적용일자"	   , field: "applyDate"        , width: 150	  , hozAlign: "center", resizable: false},
  			    	{title: "중그룹코드"   , field: "eventSeq"  	   , visible: false},
  			    	{title: "이벤트중그룹" , field: "eventName"  	   , width: 200	  , hozAlign: "left"  , resizable: false},
  			    	{title: "소그룹코드"   , field: "eventSubSeq"      , visible: false},
  			    	{title: "이벤트소그룹" , field: "eventTitle"       , width: 200	  , hozAlign: "left"  , resizable: false},
  			    	{title: "이벤트타입"   , field: "eventProductType" , width: 100	  , hozAlign: "center", resizable: false},
  			    	{title: "이벤트시술"   , field: "eventProductTitle", width: 200   , hozAlign: "left"  , resizable: false},
  			    	{title: "그룹코드"	   , field: "eventDetailSeq"   , width: 100   , hozAlign: "center", resizable: false},
  			    	{title: "대분류명"	   , field: "prdMstName" 	   , minWidth: 200, hozAlign: "left"  , resizable: false, 
											cellClick:function(e, cell){
												alert("The cell has a value of:" + cell.getValue()); //display the cells value							
											}	            
					},
  			    	{title: "일반시술모음" , field: "prdItemName" 	   , visible: false},
  			    	{title: "적용여부"     , field: "applyYn" 	   	   , visible: false}
  			    ]			  
  			});

      		//Data set
  			gridSys005E.on("tableBuilt", function(){				
  				gridSys005E.setData(result);			    				
      		});
      	} else {        		
      		gridSys005E.clearData();
      		gridSys005E.setData(result);
	    }  
  	}
  });		    
}

document.getElementById("field").addEventListener("keyup", (e)=>{
    if (e.keyCode === 13) {
    	getAllProductList();
    }  
});
document.getElementById("field2").addEventListener("keyup", (e)=>{
    if (e.keyCode === 13) {
    	getAllEventProductList();
    }  
});