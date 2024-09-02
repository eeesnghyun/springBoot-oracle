var gridPrd003 = null;

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;	
	document.getElementById("officeCode").value = officeCode;	

	getProductMtList();
	getProductList();		   		    
	getProductSubDtList();
}

//대분류 시술 조회
function getProductMtList() {
	const parmas = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonAjax.call("/prd/getProductMtList", "POST", parmas, function(data) {
		const result = data.resultList;				
		
		if (data.message == "OK") {							
			let dataList = new Array();
			
			for (idx in result) {				
		        let data = new Object();
		         
		        data.code = result[idx].prdMstCode;
		        data.name = result[idx].prdMstName;

				dataList.push(data);
			}
			
			const comboObj = {"target" : "productMt", "data" : dataList , "defaultOpt" : "대분류 전체"};
			commonInitCombo(comboObj);
			
			const searchParams = commonGetQueryString();
						
			if (!isNullStr(searchParams)) {
				document.getElementById("productMt").value = searchParams.get("prdMstCode");
			}
		}						
	});		
}	

//중분류 시술 조회
function getProductList() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdMstCode"   : document.getElementById("productMt").value
	};
	
	commonAjax.call("/prd/getProductList", "POST", params , function(data) {
		const result = data.resultList;				
		
		if (data.message == "OK") {
			if (result.length > 0) {				
				let dataList = new Array();
				
				for (idx in result) {				
			        let data = new Object();
			         
			        data.code = result[idx].prdCode;
			        data.name = result[idx].prdName;

					dataList.push(data);
				}
				
				const comboObj = {"target" : "productCode", "data" : dataList , "defaultOpt" : "중분류 전체"};
				commonInitCombo(comboObj);
			}			
		}
	});
}

//상세 페이지(소분류) 리스트 조회
function getProductSubDtList() {	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"prdMstCode"   : document.getElementById("productMt").value,
		"prdCode"      : document.getElementById("productCode").value,
		"field"        : document.getElementById("productSub").value
	};
	
	commonAjax.call("/prd/getProductSubDtList", "POST", params, function(data) {
    	const result = data.resultList;
    	
    	commonSetOfficeSite("#homePageUrl", params, "");
    	
    	if (data.message == "OK") {
    		const clickBtn = function(cell, formatterParams, onRendered) {
        		let btn = "";
        		btn += "<button type='button' class='login-record edit-prd' style='margin-right: 10px;'>수정</button>";
        		
        		if (data.edit == 'Y') btn += "<button type='button' class='login-delete del-prd'>삭제</button>";
        		return btn;
        	};
        	
        	const displayYn = function(cell, formatterParams) {
        		const value = cell.getValue();
        		
        		if (value.indexOf('미노출')) {
        			return `<span style='color:#4a4d9f;'>${value}</span>`;
        		} else {
        			return `<span>${value}</span>`;
        		}
        	}
    		
        	if (isNullStr(gridPrd003)) {
        		gridPrd003 = new Tabulator("#divGrid", {    					    				
    			    layout: "fitColumns",
    				pagination: "local",	    				
    				paginationSize: 15,
    				paginationButtonCount: 9,	    				
    				placeholder: "해당 데이터가 없습니다.",
    				maxHeight:"100%",
    			    columns: [	    
    			        {formatter:"rownum"   , title: "번호"                        , hozAlign:"center", width:50, headerSort: false},
    			        {title: "병원코드"             		 , field: "hospitalCode" , visible: false},
    			        {title: "지점코드"            		 , field: "officeCode"   , visible: false},
    			        {title: "중분류시술코드"             , field: "prdCode"      , visible: false},
    			        {title: "소분류시술코드"             , field: "prdSubCode"   , visible: false},
    			    	{title: "일반시술코드"               , field: "prdItemCode"  , visible: false},	    			    		    			    
    			    	{title: "대분류" 	                 , field: "prdMstName"   , hozAlign: "center" , maxWidth: 150 , resizable:false, headerSort: false},
    			    	{title: "중분류" 	                 , field: "prdName"      , hozAlign: "center" , maxWidth: 150 , resizable:false, headerSort: false},
    			    	{title: "소분류(상세페이지)"         , field: "prdSubName"   , hozAlign: "center" , maxWidth: 325 , resizable:false, headerSort: false},
    			    	{formatter: displayYn , title: "노출", field: "displayYn"    , hozAlign: "center" , maxWidth: 150 , resizable:false, headerSort: false},
    			    	{title: "최소가격" 		             , field: "prdSubPrice"  , hozAlign: "center" , maxWidth: 325 , resizable:false, headerSort: false},  			    		    				   
    			    	{formatter: clickBtn , minWidth:250  , hozAlign: "center"    , resizable: false, headerSort: false , cellClick:function(e, cell){ setProductEvent(e, cell);}}
			    	]			  
    			});

        		//Data set
        		gridPrd003.on("tableBuilt", function(){
                	gridPrd003.setData(result);
                	
                	const searchParams = commonGetQueryString();
                	
                	if (!isNullStr(searchParams)) {
                		gridPrd003.setPage(searchParams.get("index"));	
                	}                	
        		});        	
        	} else {
        		gridPrd003.clearData();
        		gridPrd003.setData(result); 
        	}      
        	
        	//그리드 페이징 이벤트 추가
        	gridPrd003.on("renderComplete", function(data){
        		const currentPage = document.querySelector(".tabulator-page.active").dataset.page;
        		
        		document.querySelectorAll(".tabulator-page").forEach(function(el) {        	    
            	    el.addEventListener("click", function(e) {            	    	        	    	
            	    	let page = el.dataset.page;
            	    	
            	    	if (el.dataset.page == "next") {            	    		
            	    		page = Number(currentPage) + 1;
            	    	} else if (el.dataset.page == "prev") {
            	    		page = Number(currentPage) - 1 > 0 ? Number(currentPage) - 1 : 1;            	    		
            	    	}
            	    	
            	    	const url = "/prd/prd003?index=" + page
			        			  + "&prdMstCode=" + document.getElementById("productMt").value 
			     				  + "&prdCode=" + document.getElementById("productCode").value	
			    				  + "&field=" + encodeURI(document.getElementById("productSub").value);
            	    	
            	    	history.pushState(null, null, url);            	        
            	    });        	    
            	});
	        });        	
    	}
    });		    
}

function setProductEvent(e, cell) {
	const hospitalCode = cell._cell.row.data.hospitalCode;
	const officeCode   = cell._cell.row.data.officeCode;
	const prdCode      = cell._cell.row.data.prdCode;
	const prdSubCode   = cell._cell.row.data.prdSubCode;
	const prdSubName   = cell._cell.row.data.prdSubName;
	const msg = prdSubName + "를 삭제하시겠습니까?";
	
	if (e.target.className.includes("edit-prd")) {				
		location.href = `/prd/prd001Edit?code=${prdCode}&sub=${prdSubCode}`; 
	} else if (e.target.className.includes("del-prd")) {	
		if (confirm(msg)) {
			const params = {
				"hospitalCode" : hospitalCode,
				"officeCode"   : officeCode,
				"prdSubCode"   : prdSubCode
			};
	        
			commonAjax.call("/prd/deleteProductSub", "POST", params, function(data){
				if (data.message == "OK") {
					alert("삭제되었습니다.");
					
					getProductSubDtList();
				} else {
					alert(data.message);
				}
			});	
		}
	}
}

//예약 리스트 검색
function search() {
	const url = "/prd/prd003?index=1"
		 	  + "&prdMstCode=" + document.getElementById("productMt").value 
		 	  + "&prdCode=" + document.getElementById("productCode").value	
		 	  + "&field=" + encodeURI(document.getElementById("productSub").value);
	
	history.pushState(null, null, url);
	
	getProductSubDtList();
}

document.querySelector('#productSub').addEventListener('keyup', (e)=>{
	if (e.keyCode === 13) {
		search();
	}  
});