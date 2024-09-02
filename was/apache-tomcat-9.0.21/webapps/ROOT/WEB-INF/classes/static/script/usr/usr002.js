var gridUsr002 = null;

function initSelect() {
	commonGetHospital("", "", true);
		
	getBlockUser();
}

//차단 해제
function setBlockClear(e, cell) {
	const userName = cell._cell.row.data.sysName;
	const userId = cell._cell.row.data.sysUserId;		
	const msg = userName + "(" + userId + ") 님을 차단 해제하시겠습니까?";
	
	if (confirm(msg)) {
		const params = {
			"sysUserId" : userId
		};
		
		commonAjax.call("/usr/updateBlockClear", "POST", params, function(data) {
			if (data.message == "OK") {				
				getBlockUser();
			}
		});	
	}	
}

//차단 계정 조회
function getBlockUser() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"user" 		   : document.getElementById("user").value,
		"useYn"        : 'N'
	};	
	
    commonAjax.call("/usr/getOfficeUserList", "POST", params, function(data) {
    	const result = data.resultList;      
    	
    	if (data.message == "OK") {
    		const clickBtn = function(cell, formatterParams, onRendered) { //plain text value
        		let btn = "";
        		btn += "<button type='button' class='login-record' style='margin-right: 10px;'>차단 해제</button>";        		
        		return btn;        		
        	};
        	
        	if (isNullStr(gridUsr002)) {
        		//Grid draw
            	gridUsr002 = new Tabulator("#divGrid", {    				    			
    			    layout: "fitColumns",
    				pagination: "local",
    				paginationSize: 15,
    				paginationButtonCount:9,
    				placeholder: "해당 데이터가 없습니다.",    				
    				maxHeight:"100%",
        		    columns: [
        		    	{title: "아이디(ID)"  , field: "sysUserId" , resizable:false , minWidth:100, hozAlign: "center", headerSort: false},
        		    	{title: "이름"		  , field: "sysName"   , resizable:false , hozAlign: "center", headerSort: false},
        		    	{title: "병원"		  , field: "officeLocation", resizable:false , hozAlign: "center", headerSort: false},
        		    	{title: "직책"		  , field: "posName"   , resizable:false , hozAlign: "center", headerSort: false},
        		    	{title: "휴대폰 번호" , field: "mobile" , resizable:false , minWidth:150 , hozAlign: "center", headerSort: false,
        		    		formatter:function(cell) {
        		    			if (!isNullStr(cell.getValue())) {
        		    				return cell.getValue().replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);	
        		    			}        		    			
        		    		}		    	
        		    	},
        			    {title: "차단 날짜"   , field: "blockDate" , resizable:false , minWidth:250 , hozAlign: "center", headerSort: false},
        			    {formatter: clickBtn  , resizable:false , minWidth:200 , hozAlign: "center", headerSort: false, cellClick:function(e, cell){ setBlockClear(e, cell); }}
        		    ]			  
        		});

        		//Data set
            	gridUsr002.on("tableBuilt", function(){				
            		gridUsr002.setData(result);			    				
        		});		
        	} else {        		
        		gridUsr002.clearData();
        		gridUsr002.setData(result);
        	}        	        	
    	}    	
    });		    
}

document.querySelector('#user').addEventListener('keyup', (e)=>{
	if (e.keyCode === 13) {
		getBlockUser();
	}  
});
