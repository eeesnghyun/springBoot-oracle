var gridSys002 = null;

//로그인기록, 관리자 삭제
function clickGridButton(e, cell) {
	const fullName = cell._cell.row.data.fullName;
	const userId   = cell._cell.row.data.sysUserId;	

	if (e.target.className === "login-record") {	//로그인 기록
		const params = {
			"sysUserId" : userId,
			"sysUser" : fullName
		};
				
		commonGoPage("/sys/sys002Login", params, "sysArea");
	} else if (e.target.className === "login-delete") {	//관리자 삭제		
		const params = {
			"sysUserId" : userId
		};
		
		const content = 
            `<div class="popup-tit">
            	<div class="text">
	                <p>관리자 삭제</p>
                	<span>삭제된 계정은 복구되지 않습니다.</span>	
            	</div>
            </div>

			<div class="popup-con" style="min-width:460px">
	            <div class="inputs">
	                <label for="id">이름(아이디)</label>
	                <input type="text" id="id" value="${fullName}" disabled>
	            </div>
			</div>

            <div class="popup-btn">
                <button class="save-btn blue-btn">삭제하기</button>
            </div>`;
        
	    commonDrawPopup("draw", content);

        document.querySelector('.save-btn').addEventListener('click',function(){
        	commonAjax.call("/sys/deleteSysUser", "POST", params, function(data){
				if (data.message == "OK") {
					alert("삭제되었습니다.");
					document.querySelector(".del-btn").click();
				    getSysUser();
				}
			})
        });
	}
}

//관리자 리스트 조회
function getSysUser() {
    commonAjax.call("/sys/getSysUserList", "POST", "", function(data) {
    	const result = data.resultList;
    	
    	if (data.message == "OK") {
    		const clickBtn = function(cell, formatterParams, onRendered) { //plain text value
        		let btn = "";
        		btn += "<button type='button' class='login-record' style='margin-right: 10px;'>로그인 기록</button>";
        		btn	+= "<button type='button' class='login-delete'>관리자 삭제</button>";
        		return btn;        		
        	};
        	
        	if (isNullStr(gridSys002)) {
        		gridSys002 = new Tabulator("#divGrid", {    				
    				headerVisible: false, //hide header
    			    layout:"fitColumns",
    				pagination: "local",
    				paginationSize: 15,
    				paginationButtonCount:9,
    				placeholder: "해당 데이터가 없습니다.",
    				maxHeight:"100%",
    			    columns: [
    			    	{title: "관리자정보" , field: "fullName" , resizable:false},
    			    	{title: "사번"		 , field: "sysUserId", visible: false},
    			    	{title: "이름"		 , field: "sysName"  , visible: false},
    				    {title: "로그인일시" , field: "loginDate", width: 290, hozAlign: "center", resizable:false},
    				    {formatter: clickBtn , cellClick:function(e, cell){ clickGridButton(e, cell);}, width:250, resizable:false}
    			    ]			  
    			});

        		gridSys002.on('rowClick', (e, row) => {
            		if (e.srcElement.localName != 'button') {                		
                		getUserInfo(row.getData());	
            		}
		    	});

        		//Data set
        		gridSys002.on("tableBuilt", function(){				
        			gridSys002.setData(result);			    				
        		});
        	} else {        		
        		gridSys002.clearData();
        		gridSys002.setData(result);
	    	}  
    	}
    });		    
}

//관리자 추가
function saveSysUser(type) {
	const userPw = document.getElementById("userPw").value;
	const pw     = document.getElementById("pw").value;

	if (commonCheckRequired("#frm1")) {
		if (userPw != pw) {
			alert('비밀번호를 확인해 주세요.');
	        return;
		}
		
		const params = {
			"sysUserId" : document.getElementById("userId").value, 
			"sysUserPw" : userPw,
			"sysName"   : document.getElementById("name").value		
		};
		
		let url = "";
		
		if (type == 0) {
			url = "/sys/insertSysUser";
		} else {
			url = "/sys/updateSysUser";
		}
		
		commonAjax.call(url, "POST", params, function(data){
			if (data.message == "OK") {
				alert("저장되었습니다.");
				
				popupClose();
			    getSysUser();
			} else {
				alert(data.message);
			}
		});		
	}
}

//관리자 수정
function getUserInfo(data) {
	const content = 
	    `<div class="popup-tit">
	        <p>계정 수정</p>
	    </div>
	
    	<div class="popup-con" style="width:460px">
    		<form id="frm1">
			    <div class="inputs">
			        <label for="userId" class="need">아이디</label>
			        <input type="text" id="userId" value="${data.sysUserId}" placeholder="아이디를 입력해 주세요." disabled>
			
			        <label for="name" class="need">이름</label>
			        <input type="text" id="name" value="${data.sysName}" placeholder="이름을 입력해 주세요." required>
			
			        <label for="pw" class="need">비밀번호</label>
			        <input type="password" id="pw" placeholder="비밀번호를 입력해 주세요." required>
			        <input type="password" id="userPw" placeholder="비밀번호를 재입력해 주세요." required>
			    </div>
	    	</form>
    	</div>
	
	    <div class="popup-btn">
	        <button class="save-btn blue-btn" onclick="saveSysUser(1)">저장하기</button>
	    </div>`;

    commonDrawPopup("draw", content);
}

function drawPopup() {
    const content = 
	    `<div class="popup-tit">
	        <p>계정 추가</p>
	    </div>
	
    	<div class="popup-con" style="width:460px">
    		<form id="frm1">
			    <div class="inputs">
			        <label for="userId" class="need">아이디</label>
			        <input type="text" id="userId" placeholder="아이디를 입력해 주세요." required>
			
			        <label for="name" class="need">이름</label>
			        <input type="text" id="name" placeholder="이름을 입력해 주세요." required>
			
			        <label for="pw" class="need">비밀번호</label>
			        <input type="password" id="pw" placeholder="비밀번호를 입력해 주세요." required>
			        <input type="password" id="userPw" placeholder="비밀번호를 재입력해 주세요." required>
			    </div>
	    	</form>
    	</div>
	
	    <div class="popup-btn">
	        <button class="save-btn blue-btn" onclick="saveSysUser(0)">저장하기</button>
	    </div>`;

    commonDrawPopup("draw", content);
}
