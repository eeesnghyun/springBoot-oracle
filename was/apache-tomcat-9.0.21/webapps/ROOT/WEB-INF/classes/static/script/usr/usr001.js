var gridUsr001 = null;

function initSelect(hospitalCode , officeCode) {	
	const searchParams = commonGetQueryString();
	
	if (isNullStr(searchParams)) {
		commonGetHospital('', '', true); 
		
		document.getElementById("hospitalCode").value = hospitalCode;	
		document.getElementById("officeCode").value = officeCode;		
		
		$("#hospitalCode option:eq(0)").prop("selected", true); //첫번째 값 클릭
		$("#officeCode option:eq(0)").prop("selected", true);
	} else {
		commonGetHospital(searchParams.get("hCode"), '', true); 
	
		document.getElementById("hospitalCode").value = searchParams.get("hCode");
		document.getElementById("officeCode").value =  searchParams.get("oCode");
	}
	
	getOfficeUser();	
}

function setOfficeUserInfo(e, cell) {		
	const userName = cell._cell.row.data.sysName;
	const userId = cell._cell.row.data.sysUserId;
	const msg = userName + "(" + userId + ") 님을 차단하시겠습니까?";
	
	if (e.target.className === "login-record") {//로그인 기록		
		const hCode = document.getElementById("hospitalCode").value;
		const oCode = document.getElementById("officeCode").value;

		commonGoPage("/usr/usr001Login?hCode=" + hCode + "&oCode=" + oCode + "&id=" + userId + "&name=" + userName);
	} else if (e.target.className === "login-delete") {	//로그인 차단		
		if (confirm(msg)) {
			const params = {
				"sysUserId" : userId
			};
	        
			commonAjax.call("/sys/updateSysUserLock", "POST", params, function(data){
				if (data.message == "OK") {				    
					getOfficeUser();
				}
			});	
		}
	}
}

//지점 계정 조회
function getOfficeUser() {
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value,
		"user" 		   : document.getElementById("user").value,
		"useYn"        : 'Y'
	};	
	
	commonAjax.call("/usr/getOfficeUserList", "POST", params, function(data) {
    	const result = data.resultList;      
    	
    	if (data.message == "OK") {
    		history.pushState(null, null, '?hCode=' + params.hospitalCode + '&oCode=' + params.officeCode);
    		
    		const clickBtn = function(cell, formatterParams, onRendered) { //plain text value
        		let btn = "";
        		btn += "<button type='button' class='login-record' style='margin-right: 10px;'>로그인 기록</button>";
        		btn	+= "<button type='button' class='login-delete'>로그인 차단</button>";
        		return btn;
        	};
        	
        	if (isNullStr(gridUsr001)) {
        		//Grid draw
            	gridUsr001 = new Tabulator("#divGrid", { 
    			    layout: "fitColumns",
    				pagination: "local",
    				paginationSize: 15,
    				paginationButtonCount : 9,
    				placeholder: "해당 데이터가 없습니다.",    				
    				maxHeight:"100%",
        		    columns: [        		    	
        		    	{title: "아이디(ID)"  , field: "sysUserId" , resizable:false , minWidth:100 , hozAlign: "center", headerSort: false},
        		    	{title: "이름"		  , field: "sysName"   , resizable:false , hozAlign: "center", headerSort: false},
        		    	{title: "병원"		  , field: "officeLocation", resizable:false, hozAlign: "center", headerSort: false},
        		    	{title: "직책"		  , field: "posName"   , resizable:false , hozAlign: "center", headerSort: false},
        		    	{title: "휴대폰 번호" , field: "mobile"    , resizable:false , minWidth: 150 , hozAlign: "center", headerSort: false, 
        		    		formatter:function(cell) {
        		    			if (!isNullStr(cell.getValue())) {
        		    				return cell.getValue().replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);	
        		    			}        		    			
        		    		}
        		    	},				    	
        		    	{title: "메뉴 권한"   , field: "menuCode"  , visible:false},
        			    {title: "최근 로그인" , field: "loginDate" , resizable:false , minWidth:290 , hozAlign: "center", headerSort: false},
        			    {formatter: clickBtn  , resizable:false , minWidth:250, headerSort: false, cellClick:function(e, cell){ setOfficeUserInfo(e, cell); }}
        		    ]
        		});
            	
            	gridUsr001.on('rowClick', (e, row) => {
            		if (e.srcElement.localName != 'button') {
                		const selectedRows = row.getData(); 
                		commonDrawPopup("load", "/usr/usr001Popup", selectedRows);		
            		}
		    	});

        		//Data set
            	gridUsr001.on("tableBuilt", function(){				
            		gridUsr001.setData(result);			    				
        		});		
        	} else {        		
        		gridUsr001.clearData();
        		gridUsr001.setData(result);
        	}        	        	
    	}    	
    });
}

function drawPopup() {	
	const params = {
		"hospitalCode" : document.getElementById("hospitalCode").value,
		"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonDrawPopup("load", "/usr/usr001Popup", params);	
}

function drawMenuCode() {
	const area = document.querySelector('.check-wrap');
	
	//메뉴 권한 설정
	commonAjax.call("/menu/getMenuCode", "POST", "", function(data){
		if (data.message == "OK") {			
			const result = data.resultList;			
			area.innerHTML = "";
			
			for (let i = 0; i < result.length; i++) {
				area.innerHTML +=
					`<div class="menu-auth-btn" data-code=${result[i].menuCode}>${result[i].menuName}</div>`;	
			}
			
			getAutoMenu();
		}
	});	
}

function getAutoMenu() {
	const menu = document.querySelectorAll('.check-wrap div');

	for (let i = 0; i < menu.length; i++) {
		menu[i].addEventListener('click', function(){
			menu[i].classList.toggle('active');
		});
	}
}

document.querySelector('#user').addEventListener('keyup', (e)=>{
	if (e.keyCode === 13) {
		getOfficeUser();
	}  
});

