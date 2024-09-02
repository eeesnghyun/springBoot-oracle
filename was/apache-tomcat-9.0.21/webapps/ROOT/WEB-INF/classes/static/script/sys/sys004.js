var gridSys004 = null;

//관리자 리스트 조회
function getSysMenu() {
    commonAjax.call("/sys/getSysMenuList", "POST", "", function(data) {
    	const result = data.resultList;
    	
    	if (data.message == "OK") {
    		const clickBtn = function(cell, formatterParams, onRendered) { //plain text value  	    			
    			if (cell._cell.row.data.parentMenu === "ROOT") {
    				return "";
    			} else {
    				return "<button type='button' class='login-delete'>메뉴 삭제</button>";	
    			}        		         	
        	};
        	
    		if (isNullStr(gridSys004)) {
        		gridSys004 = new Tabulator("#divGrid", {    				    				
    			    layout:"fitColumns",    				
    				placeholder: "해당 데이터가 없습니다.",
    				maxHeight:"100%",
    			    columns: [
    			    	{title: "메뉴코드"	 , field: "menuCode"  , visible: false, headerSort: false},
    			    	{title: "메뉴명"     , field: "menuName"  , width: 250, hozAlign: "left", headerSort: false, resizable:false,
    			    		formatter:function(cell){    			    			
    			    			if (cell._cell.row.data.parentMenu === "ROOT") {
    			    				cell._cell.row.getElement().style.backgroundColor = "#efeff5";
    			    				return cell.getValue();
    			    			} else {
    			    				return "ㄴ" + cell.getValue();
    			    			}
    			    		}
    				    },
    			    	{title: "부모메뉴"	 , field: "parentMenu", visible: false},
    			    	{title: "메뉴URL"	 , field: "menuUrl"   , width: 200, hozAlign: "center", resizable:false, headerSort: false},
    				    {title: "메뉴순서"   , field: "menuOrder" , width: 200, hozAlign: "center", resizable:false, headerSort: false},
    				    {title: "사용여부"   , field: "useYn"     , width: 200, hozAlign: "center", resizable:false, headerSort: false,
    			    		formatter:function(cell){
    			    			if (cell.getValue() === "Y") {
    			    				return "사용";
    			    			} else {
    			    				return "미사용";
    			    			}		    			
    			    		}
    				    },
    				    {title: "메뉴이미지" , field: "menuImg"   , width: 290, hozAlign: "left", resizable:false, headerSort: false},
    				    {formatter: clickBtn , width: 200, resizable:false, headerSort: false,
    				    	cellClick:function(e, cell){ 
    				    		clickGridButton(e, cell);
    				    	}
    				    }
    			    ]			  
    			});

        		gridSys004.on('rowClick', (e, row) => {
            		if (e.srcElement.localName != 'button') {        
            			getMenuInfo(row.getData());	
            		}
		    	});

        		//Data set
        		gridSys004.on("tableBuilt", function(){				
        			gridSys004.setData(result);			    				
        		});
        	} else {        		
        		gridSys004.clearData();
        		gridSys004.setData(result);
	    	}  
    	}
    });		    
}

//메뉴 삭제
function clickGridButton(e, cell) {
	if (e.target.className === "login-delete") {		
		if (confirm("메뉴를 삭제하시겠습니까?\n삭제된 메뉴는 복구할 수 없습니다.")) {
			const params = {
				"menuCode" : cell._cell.row.data.menuCode,
				"menuName" : cell._cell.row.data.menuName				
			};
			
	      	commonAjax.call("/sys/deleteMenu", "POST", params, function(data){
				if (data.message == "OK") {
					alert("삭제되었습니다.");
					
					getSysMenu();
				}
			});	
		}								
	}
}

//메뉴 추가
function saveSysMenu(type) {
	if (commonCheckRequired("#frm1")) {		
		const params = {
			"parentMenu" : isNullStr(document.getElementById("parentMenu")) == true ? "ROOT" : document.getElementById("parentMenu").value,
			"menuName"   : document.getElementById("menuName").value, 				
			"menuUrl"    : isNullStr(document.getElementById("menuUrl")) == true ? "" : document.getElementById("menuUrl").value,
			"menuOrder"  : document.getElementById("menuOrder").value,
			"menuImg"    : document.getElementById("menuImg").value,
			"useYn"      : document.getElementById("useYn").value
		};
		
		let url = "";
		
		if (type == 0) {
			url = "/sys/insertMenu";
		} else {
			url = "/sys/updateMenu";
			params.menuCode = document.getElementById("menuCode").value;
		}
		
		commonAjax.call(url, "POST", params, function(data){
			if (data.message == "OK") {
				alert("저장되었습니다.");
				
				popupClose();
				getSysMenu();
			} else {
				alert(data.message);
			}
		});		
	}
}

//메뉴 수정
function getMenuInfo(data) {
	const content = 
	    `<div class="popup-tit">
	        <p>메뉴 수정</p>
	    </div>
	
    	<div class="popup-con" style="width: 300px">
    		<form id="frm1">
    			<input type="hidden" id="menuCode" value="${data.menuCode}">
			    <div class="inputs">			    
			        <label for="parentMenu" class="need parent">부모메뉴</label>
			        <div class="select-box">
			   			<select class="small" id="parentMenu" style="width: 100%"></select>
			   			<div class="icon-arrow"></div>
		   			</div>

			        <label for="userId" class="need">메뉴명</label>
			        <input type="text" id="menuName" value="${data.menuName}" required>			
			
			        <label for="menuUrl" class="need url">메뉴URL</label>
			        <input type="text" id="menuUrl" value="${data.menuUrl}" required>
			
					<label for="menuOrder">메뉴순서</label>
			        <input type="text" id="menuOrder" value="${data.menuOrder}">					
			
					<label for="menuImg">메뉴아이콘</label>
			        <input type="text" id="menuImg" value="${nvlStr(data.menuImg)}">					
			
					<label for="useYn">사용여부</label>
			        <div class="select-box">
			   			<select class="small" id="useYn" style="width: 100%">
			   				<option value="Y">사용</option>
			        		<option value="N">미사용</option>
			   			</select>			   						   			
			   			<div class="icon-arrow"></div>
		   			</div>		   						   			
			    </div>
	    	</form>
    	</div>
	
	    <div class="popup-btn">
	        <button class="save-btn blue-btn" onclick="saveSysMenu(1)">저장하기</button>
	    </div>`;

    commonDrawPopup("draw", content);
    
    getRootMenu();
    
    if (data.parentMenu == "ROOT") {
    	document.querySelector(".parent").nextElementSibling.remove();    	
    	document.querySelector(".parent").remove();
    	
    	if (data.menuUrl == "-") {
    		document.querySelector(".url").nextElementSibling.remove();
        	document.querySelector(".url").remove();
    	} 	
    } else {
    	document.getElementById("parentMenu").value = data.parentMenu;
        document.getElementById("useYn").value = data.useYn;	
    }        
}

//메뉴 추가
function drawPopup() {
    const content = 
	    `<div class="popup-tit">
	        <p>메뉴 추가</p>
	    </div>
	
    	<div class="popup-con" style="width: 300px">
    		<form id="frm1">
			    <div class="inputs">			    
			        <label for="parentMenu" class="need">부모메뉴</label>
			        <div class="select-box">
			   			<select class="small" id="parentMenu" style="width: 100%"></select>
			   			<div class="icon-arrow"></div>
		   			</div>

			        <label for="userId" class="need">메뉴명</label>
			        <input type="text" id="menuName" required>			
			
			        <label for="menuUrl" class="need">메뉴URL</label>
			        <input type="text" id="menuUrl" required>
			
					<label for="menuOrder">메뉴순서</label>
			        <input type="text" id="menuOrder">					
			
					<label for="menuImg">메뉴아이콘</label>
			        <input type="text" id="menuImg">					
			
					<label for="useYn">사용여부</label>
			        <div class="select-box">
			   			<select class="small" id="useYn" style="width: 100%">
			   				<option value="Y">사용</option>
			        		<option value="N">미사용</option>
			   			</select>			   						   			
			   			<div class="icon-arrow"></div>
		   			</div>		   						   			
			    </div>
	    	</form>
    	</div>
	
	    <div class="popup-btn">
	        <button class="save-btn blue-btn" onclick="saveSysMenu(0)">저장하기</button>
	    </div>`;

    commonDrawPopup("draw", content);
    
    getRootMenu();
}

//부모 메뉴 조회
function getRootMenu() {
	commonAjax.call("/sys/getRootMenu", "POST", "", function(data) {
		const result = data.resultList;				
		
		if (data.message == "OK") {
			if (result.length > 0) {				
				let dataList = new Array();
				let comboObj;
				
				for (idx in result) {				
			        let data = new Object();
			         
			        data.code = result[idx].menuCode;
			        data.name = result[idx].menuName;

					dataList.push(data);
				}
				
				comboObj = {"target" : "parentMenu", "data" : dataList};
				
				commonInitCombo(comboObj);
			}						
		}
	});
}

function drawMenuCode() {
	const area = document.querySelector('.auto-area');
	
	//메뉴 권한 설정
	commonAjax.call("/menu/getMenuCode", "POST", "", function(data){
		if (data.message == "OK") {			
			const result = data.resultList;			
			area.innerHTML = "";
			
			for (let i = 0; i < result.length; i++) {
				area.innerHTML +=
					`<button class="auth-btn" data-code=${result[i].menuCode}>${result[i].menuName}</button>`;	
			}						
		}
	});	
}

function setMenuClickEvent() {
	const menu = document.querySelectorAll('.auto-area button');

	for (let i = 0; i < menu.length; i++) {
		menu[i].addEventListener('click', function(){
			menu[i].classList.toggle('active');
		});
	}
}

//사용자 메뉴 권한 조회
function getSysAuthList() {
    commonAjax.call("/sys/getUserMenuList", "POST", "", function(data) {
    	const result = data.resultList;
    	
    	if (data.message == "OK") {	    		
    		if (isNullStr(gridSysAuth004)) {
    			gridSysAuth004 = new Tabulator("#divAuthGrid", {    				    							
    			    layout: "fitColumns",    				
    				placeholder: "해당 데이터가 없습니다.",    				
    				maxHeight:"100%",
    			    columns: [
    			    	{formatter: "rowSelection", titleFormatter: "rowSelection", width: 80, hozAlign: "center", resizable: false, headerSort: false, cellClick: function(e, cell){
    			            cell.getRow().toggleSelect();
    			        }},
    			    	{title: "병원/지점"	 , field: "hospitalName", width: 200, hozAlign: "left"  , resizable:false, headerSort: false},
    			    	{title: "아이디"	 , field: "sysUserId"   , width: 150, hozAlign: "left"  , resizable:false, headerSort: false},
    			    	{title: "이름"	     , field: "sysName"     , width: 100, hozAlign: "left"  , resizable:false, headerSort: false},	    				    
    			    	{title: "계정"       , field: "useYn"       , width: 100, hozAlign: "center", resizable:false, headerSort: false,
    			    		formatter:function(cell){
    			    			if (cell.getValue() === "Y") {
    			    				return "활성화";
    			    			} else {
    			    				return "비활성화";
    			    			}		    			
    			    		}
    				    },
    				    {title: "메뉴권한"   , field: "menuCode"    , visible: false}
    			    ]			  
    			});

    			gridSysAuth004.on('rowClick', (e, row) => {
    				row.toggleSelect();	//체크박스 클릭
    				
    				document.querySelectorAll(".auth-btn").forEach(e => e.classList.remove("active"));        	
					
    				if (!isNullStr(row._row.data.menuCode)) {
    					const authMenu = row._row.data.menuCode.split("/");
    					
    					document.querySelectorAll(".auth-btn").forEach(function(e){
        					if (authMenu.includes(e.dataset.code)) {
        						e.classList.add("active");
        					}
        				});	        				
    				}    			    				    		
		    	});

        		//Data set
        		gridSysAuth004.on("tableBuilt", function(){				
        			gridSysAuth004.setData(result);			    				
        		});
        	} else {        		
        		gridSysAuth004.clearData();
        		gridSysAuth004.setData(result);
	    	}  
    	}
    });		    
}

//메뉴 권한 등록
function updateAuthMenu() {
	const sysUser = gridSysAuth004.getSelectedData();
	const userArr = [];
	
	for (let i = 0; i < sysUser.length; i++) {
		userArr.push(sysUser[i].sysUserId);
	}
	
	const menu    = document.querySelectorAll('.auto-area button.active');
	const menuArr = [];
	
	for (let i = 0; i < menu.length; i++) {		
		menuArr.push(menu[i].dataset.code);		
	}
	
	if (userArr.length == 0) {
		alert("사용자를 선택해주세요.");
		return;
	}
	
	if (menuArr.length == 0) {
		alert("메뉴 권한을 선택해주세요.");
		return;
	}
	
	const params = {
		"sysUserId" : JSON.stringify(userArr), 
		"menuList"  : JSON.stringify(menuArr)		
	};

	commonAjax.call("/sys/updateAuthMenu", "POST", params, function(data){
		if (data.message == "OK") {
			alert("저장되었습니다.");
			
			location.reload();
		} else {
			alert(data.message);
		}
	});	
}
