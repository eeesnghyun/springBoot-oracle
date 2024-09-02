function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;	
	document.getElementById("officeCode").value = officeCode;	
	
	getMedteam();
}

function checkData() {
	let memberList = [];		

    const type            = document.querySelector('input[name="medType"]:checked').value;
	const memberName      = document.querySelectorAll(`.${type} input[name="memberName"]`);
	const memberPosition  = document.querySelectorAll(`.${type} input[name="memberPosition"]`);
	const memberIntro     = document.querySelectorAll(`.${type} input[name="memberIntro"]`);
	const memberImage1    = document.querySelectorAll(`.${type} input[name="memberImage1"]`);
	const memberImage2    = document.querySelectorAll(`.${type} input[name="memberImage2"]`);
	const memberImage3    = document.querySelectorAll(`.${type} input[name="memberImage3"]`);
	const displayPosition = document.querySelectorAll('.all input[name="displayPosition"]');
	const displayYn       = document.querySelectorAll(`.${type} button.displayYn`);
	const content         = document.querySelectorAll(`.${type} ul.history`);
	
	for (let i = 0; i < memberName.length; i++) {
		let memberJson = new Object();
		
		memberJson.memberName     = memberName[i].value;
		memberJson.memberPosition = memberPosition[i].value;
		memberJson.displayYn      = displayYn[i].value;
		memberJson.memberImage1   = memberImage1[i].value;
		
		//프로필인 경우
		if (type == "profile") {
			let profileList = [];
				
			memberJson.memberIntro  = memberIntro[i].value;
			
			//서브 이미지가 둘 다 있을 경우 해당 서브 이미지를 넣음
			if (!isNullStr(memberImage2[i].value) && !isNullStr(memberImage3[i].value)) {
				memberJson.memberImage2 = memberImage2[i].value;
				memberJson.memberImage3 = memberImage3[i].value;
			}
			
			if (isNullStr(memberImage2[i].value) || isNullStr(memberImage3[i].value)) {
				if (!isNullStr(memberImage2[i].value)) {
					memberJson.memberImage2 = memberImage2[i].value;
					memberJson.memberImage3 = '/resources/images/main/Img_noPerson.svg';	
				}
				
				if (!isNullStr(memberImage3[i].value)) {
					memberJson.memberImage2 = '/resources/images/main/Img_noPerson.svg';
					memberJson.memberImage3 = memberImage3[i].value;	
				}
			}
					
			const span = content[i].querySelectorAll('li span');
			
			//약력
			for (let j = 0; j < span.length; j++) {
				if (span[j].innerHTML != null) {
					let profileJson = new Object();
					
					profileJson.content = span[j].innerHTML;
					profileList.push(profileJson);		
				}											
			}	
			
			memberJson.profileList = profileList;
		} else {
			memberJson.sortOrder       = i + 1;
			memberJson.displayPosition = displayPosition[i].value;
		}
		
		memberList.push(memberJson);
    }
	
	const input = document.createElement("input");
	input.type  = "hidden";
	input.name  = "memberList";
	input.value = JSON.stringify(memberList);
	
	document.getElementById("frm").appendChild(input);
}

function getMedteam() {
	const hospitalCode = document.getElementById("hospitalCode").value;
	const officeCode = document.getElementById("officeCode").value;
	var type = "";

	const params = {
			"hospitalCode" : document.getElementById("hospitalCode").value,
			"officeCode"   : document.getElementById("officeCode").value
	};
	
	commonSetOfficeSite("#homePageUrl", params, "/staff");	//홈페이지 주소	
	
	commonAjax.call("/pge/getMedteam", "POST", params, function(data) {
		if (data.message == "OK") {				
			const result = data.result;
			
			if (!isNullStr(result)) {
				type = result.medType;
				
				commonFormReset("#frm");	        //폼 초기화

				if (!isNullStr(type)){
					//메인공통
					document.querySelector(`input[value=${type}]`).checked = true;	
					document.querySelector('input[name="positionA"]').value = nvlStr(result.positionA);
					document.querySelector('input[name="positionB"]').value = nvlStr(result.positionB);
					document.querySelector('input[name="positionC"]').value = nvlStr(result.positionC);
					document.querySelector('input[name="positionD"]').value = nvlStr(result.positionD);
					
					document.querySelector('input[name="title1"]').value = nvlStr(result.title1);
					document.querySelector('input[name="title2"]').value = nvlStr(result.title2);
				}	
			}else{
				commonFormReset("#frm");
				type = 'all';
			}
			
			getMedteamMember(type);	
		} else {
			alert(data.message);
		}	
	});			
}	

function getMedteamMember(type) {
    const div = document.querySelectorAll('.col1 .type'); 					//타입종류    
	const hospitalCode = document.getElementById("hospitalCode").value;
	const officeCode = document.getElementById("officeCode").value;
	const btn = document.querySelector('button.list-btn');                 //순서변경 버튼
	const tit = document.querySelector('input[name="title1"]');
     
	div.forEach((ele) => ele.classList.remove('active'));
    document.querySelector(`.type.${type}`).classList.add('active');
    
    if (type == 'profile') {
    	btn.style.display = 'none';
    	tit.placeholder = 'Medical Team';
    } else {
    	btn.style.display = 'block';
    	tit.placeholder = 'STAFF';
    }
    
	const params = {
			"hospitalCode" : hospitalCode,
			"officeCode"   : officeCode,
			"medType"      : type
	};
    
	commonAjax.call("/pge/getMedteamMember", "POST", params, function(data) {
		if (data.message == "OK") {
			if (type == 'all') {
				drawAllMedteamMember(data.resultList);
			} else {
				drawProfileMedteamMember(data.resultList);
			}
		} else {
			alert(data.message);
		}
	});
}

function drawAllMedteamMember(result) {
	const con = document.querySelectorAll('.all ul.con');
	
	let content = "";
	con.forEach((ele) => ele.innerHTML = "");  //all 영역 초기화
	
	for(let i = 0; i < result.length; i++){
		content = 
			`<li>
            	<input type="hidden" name="displayPosition" value="${result[i].displayPosition}"/>
                <div class="btn-area">
                    <button type="button" class="show displayYn" value="${result[i].displayYn}" onclick="showButton(this , true)">노출</button>
                    <button type="button" class="edit" onclick="editButton(this)">수정</button>
                    <button type="button" class="del" onclick="delButton(this)">삭제</button>
                </div>

                <div class="img">
                    <div class="file-upload">
                        <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" data-object/>
                        <input type="hidden" name="memberImage1" value="${result[i].memberImage1}" data-object/>
                        <i class="icon"></i>

                        <img src="" alt="의료진 이미지" style="display:none;" data-object>
                    </div>

                    <div class="img-del">
                        <button type="button" class="img-del-btn" onclick="delImage(this)">이미지 삭제</button>
                    </div>
                </div>

                <div class="input hide">
                    <input type="text" class="doc-pos position" placeholder="직책" onkeyup="valueAdd(this)" name="memberPosition" value="${result[i].memberPosition}" data-object>
                    <span class="txt">${result[i].memberPosition}</span>
                    <input type="text" class="doc-name name" placeholder="이름" onkeyup="valueAdd(this)" name="memberName" value="${result[i].memberName}" data-object>
                    <h3 class="txt">${result[i].memberName}</h3>
                </div>
            </li>`;
		
		const location = document.getElementById(`${result[i].displayPosition}`);
		
		location.querySelector('ul.con').innerHTML += content;
		showButton(document.querySelectorAll('button.displayYn')[i]);	
		getImg(result[i].memberImage1 , 'memberImage1' , i);
	};
	
	//의료진 추가 div
	for (let i = 0; i < con.length; i++) {
		document.querySelectorAll('ul.con')[i].innerHTML += `<li class="add-person" onclick="addAllDiv(this)"></li>`;
	}
}

function drawProfileMedteamMember(result){
	const con = document.querySelector('div.profile');
	
	con.innerHTML = "";  //profile 영역 초기화
	
	if(!isNullStr(result)){
		for(let i = 0; i < result.length; i++){		
			const content = 
				`<div class="con-area">
					<ul class="con">
						<li class="img-area">
		                    <div class="img">
		                        <div class="file-upload">
		                            <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" data-object/>
		                            <input type="hidden" name="memberImage1" value="${result[i].memberImage1}" data-object/> 
		                            <i class="icon"></i>

		                            <img src="" alt="의료진이미지" style="display: none;" data-object>
		                        </div>

		                        <div class="img-del">
		                            <button type="button" class="img-del-btn" onclick="delImage(this)">이미지 삭제</button>
		                        </div>
		                    </div>

		                    <div class="sub-img">
		                    	<div class="img">
			                        <div class="file-upload">
			                            <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" data-object/>
			                            <input type="hidden" name="memberImage2" value="${result[i].memberImage2}" data-object/>
			                            <i class="icon"></i>
			
			                            <img src="" alt="의료진이미지" style="display: none;" data-object>
			                        </div>
			                        
			                    	<div class="img-del">
			                            <button type="button" class="img-del-btn" onclick="delImage(this)">이미지 삭제</button>
			                        </div>
		                    	</div>

		                    	<div class="img">
			                        <div class="file-upload">
			                            <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" data-object/>
			                            <input type="hidden" name="memberImage3" value="${result[i].memberImage3}" data-object/>
			                            <i class="icon"></i>
			
			                            <img src="" alt="의료진이미지" style="display: none;" data-object>
			                        </div>
			                        
			                    	<div class="img-del">
			                            <button type="button" class="img-del-btn" onclick="delImage(this)">이미지 삭제</button>
			                        </div>
		                    	</div>
		                    </div>
						</li>

		                <li class="btn-area">
		                    <button type="button" class="show displayYn" value="${result[i].displayYn}" onclick="showButton(this , true)">노출</button>
		                    <button type="button" class="edit" onclick="editButton(this)">수정</button>
		                    <button type="button" class="del" onclick="delButton(this.parentElement)">삭제</button>
		                </li>

		                <li class="history-area">
		                    <div class="hospital">${result[i].hospitalName}</div>

		                    <div class="input hide">
		                        <input type="text" class="name" placeholder="이름" onkeyup="valueAdd(this)" name="memberName" value="${result[i].memberName}" data-object>
		                        <h2 class="txt">${result[i].memberName}</h2>
		                        <input type="text" class="position" placeholder="직책" onkeyup="valueAdd(this)" name="memberPosition" value="${result[i].memberPosition}" data-object>
		                        <span class="txt">${result[i].memberPosition}</span>
		                        <input type="text" class="desc" placeholder="설명" onkeyup="valueAdd(this)" name="memberIntro" value="${result[i].memberIntro}" data-object>
		                        <p class="txt">${result[i].memberIntro}</p>
		           	         </div> 

		                     <ul class="history"></ul>
		                </li>
		             </ul>
		          </div>`;
			
			document.querySelector('.content.profile').innerHTML += content;

			showButton(document.querySelectorAll('button.displayYn')[i]);
			
			//프로필 영역 이미지
			getImg(result[i].memberImage1 , 'memberImage1' , i);
			getImg(result[i].memberImage2 , 'memberImage2' , i);
			getImg(result[i].memberImage3 , 'memberImage3' , i);
			
			//프로필 영역 약력 
			const ul = document.querySelectorAll('.profile ul.history')[i];
			
			if (!isNullStr(result[i].content)) {
				const contentArr = result[i].content.split("\n");
				
				for(let i = 0; i < contentArr.length; i++){
					const content = 
							`<li> 
							    <input type="text" class="history-fin" value="${contentArr[i]}" onkeyup="valueAdd(this)">
							    <span>${contentArr[i]}</span>
							    <div class="btn">
							        <button type="button" class="del-history" onclick="delButton(this)">-</button>
							    </div>
							</li>`;
						
					ul.innerHTML += content;
				}
			}
			
			//약력 인풋 추가
			ul.innerHTML += 
				`<li>
				    <input class="history" type="text" placeholder=" 약력을 추가해 주세요.">
				    <button type="button" class="add-history" onclick="addProfileLi(this)">+</button>
				</li>`;
		}
	}
	
	con.innerHTML += `<div class="add-person" onclick="addProfileDiv(this)"></div>`;
}

function getImg(result , target , num){
	const content = document.querySelector('.content.active');
	var input     = content.querySelectorAll(`input[name="${target}"]`)[num];
	const parent  = input.parentElement;
	
	if (!isNullStr(input.value)) {
		parent.parentElement.querySelector('.img-del').classList.add('show');
		parent.querySelector('i').style.display = 'none';
		parent.querySelector('img').src = result;
		parent.querySelector('img').style.display = 'block';
	}
	
	//기본이미지일 경우 인풋에 넣어두었던 값을 지워줌
	if (target != 'memberImage1' && input.value == '/resources/images/main/Img_noPerson.svg') {
		input.value = '';
	}
}
          
function listOrder() {	
	document.querySelector('button.list-btn').style.display = 'none';

	commonSetDragDrop('#conList1', "", "");
	commonSetDragDrop('#conList2', "", "");
	commonSetDragDrop('#conList3', "", "");
	commonSetDragDrop('#conList4', "", "");
}

//약력 1개 이상 필수값 체크
function historyLength() {
	const state = false;
	const area = document.querySelectorAll('.profile .con-area');
	
	for (let i = 0; i < area.length; i++) {
		const history = area[i].querySelectorAll('ul.history span');
		
		if (history.length == 0) {
			alert('약력을 입력해 주세요.');
			return false;
		}
	}
	
	return true;
}

function checkSave() {		
	const history = document.querySelectorAll('ul.history span');
	
	if (commonCheckRequired("#frm")) {
		if (historyLength()) {
			const content =  
				  `<div class="popup-con" style="width:480px">
				       <div class="popup-tit">
				        	<div class="text">
					        	<p>화면 미리보기</p>
					        	<span>
						        	현재 페이지에서 변경한 내용으로 미리보기를 할 수 있습니다.<br/>
									미리보기가 필요 없으면 저장하기를 눌러주세요.
								</span>
							</div>
						</div>
				
						<div class="popup-btn">
							<button type="button" class="preview-btn dark-btn" onclick="homePreview()">미리보기</button>
							<button type="button" class="save-btn blue-btn" onclick="homeSave()">저장하기</button>
						</div>
					</div>`;

			commonDrawPopup("draw", content);		
		}	
	} 
}

function homePreview() {	
	checkData();
	const params = commonArrayToJson($("#frm").serializeArray());
	
	commonAjax.call("/pge/insertMedteamPreview", "POST", params, function(data){
		if (data.message == "OK") {								
			const page = document.getElementById("homePageUrl").innerHTML.split('/staff');
			
			window.open(page[0] + "/preview/staff", "_blank");
		}
	});		
}

function homeSave() {		
	checkData();							
	const params = commonArrayToJson($("#frm").serializeArray());
	
	commonAjax.call("/pge/updateMedteam", "POST", params, function(data){
		if (data.message == "OK") {				
			alert('저장되었습니다.');      
			document.querySelector(".del-btn").click();
			
			getMedteam();
		}
	});
}

function editButton(target){
	const parent = target.parentElement.parentElement;
    const area   = parent.querySelector('.input');
    const input  = parent.querySelectorAll('.input input');
    const txt    = parent.querySelectorAll('.input .txt');
    const historyInput = parent.querySelectorAll('.history-fin');
    const historySpan  = parent.querySelectorAll('ul.history li span');
    
    const name = parent.querySelector("input.name");
    const positon = parent.querySelector("input.position");

    if (target.classList.contains('end')) {    
    	if (isNullStr(positon.value)) {
    		alert('직책을 입력해 주세요.');
    		positon.style.border='1px solid red';
    		positon.focus();
    		return;
    	}
    	
    	if (isNullStr(name.value)) {
    		alert('이름을 입력해 주세요.');
    		name.style.border='1px solid red';
    		name.focus();
    		return;
    	}
    	
    	if (!isNullStr(name) && !isNullStr(positon)) {
    		target.classList.remove('end');
            target.innerHTML = '수정';
            area.classList.add('hide');
            txt.forEach((ele) => ele.style.display = 'block');
            historyInput.forEach((ele) => ele.style.display = 'none');
            historySpan.forEach((ele) => ele.style.display = 'block');
    	}
    } else {    	
		target.classList.add('end');
        target.innerHTML = '완료';
        area.classList.remove('hide');
        txt.forEach((ele) => ele.style.display = 'none');
        historyInput.forEach((ele) => ele.style.display = 'block');
        historySpan.forEach((ele) => ele.style.display = 'none');	
    }
}

function valueAdd(target){
    target.nextElementSibling.innerHTML = target.value;
}

function delButton(target){
    target.parentElement.parentElement.remove();
}

function showButton(target , click){
    if(target.value == 'Y'){
    
        target.innerHTML = '노출';
        target.classList.remove('show');
        target.classList.add('no-show');
        
    	if(click){
    		target.value = 'N';
            target.innerHTML = '노출';
            target.classList.add('show');
            target.classList.remove('no-show');
    	}
      
    }else{
    	
        target.innerHTML = '노출';
        target.classList.add('show');
        target.classList.remove('no-show');
       
    	if(click){
    		target.value = 'Y';
            target.innerHTML = '노출';
            target.classList.remove('show');
            target.classList.add('no-show');
    	}
    }
}

function addAllDiv(target){

    var content = document.createElement('li');
    var position = target.parentElement.parentElement.getAttribute('id');
    
    content.innerHTML = 
        `<input type="hidden" name="displayPosition" value="${position}"/>
        <div class="btn-area">
            <button type="button" class="no-show displayYn" value="Y" onclick="showButton(this , true)">노출</button>
            <button type="button" class="edit end" onclick="editButton(this)">완료</button>
            <button type="button" class="del" onclick="delButton(this)">삭제</button>
        </div>

        <div class="img">
            <div class="file-upload">
                <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" data-object/>
                <input type="hidden" value="/resources/images/main/Img_noPerson.svg" name="memberImage1" data-object/>
                <i class="icon"></i>

                <img src="" alt="의료진 이미지" style="display: none; data-object">
                
                <div class="resolution">이미지해상도 (520 x 560)</div>
            </div>

            <div class="img-del">
                <button type="button" class="img-del-btn" onclick="delImage(this)">이미지 삭제</button>
            </div>
        </div>

        <div class="input">
            <input type="text" class="doc-pos position" placeholder="직책" onkeyup="valueAdd(this)" name="memberPosition" required data-object>
            <span class="txt" style="display:none"></span>
            <input type="text" class="doc-name name" placeholder="이름" onkeyup="valueAdd(this)" name="memberName" required data-object>
            <h3 class="txt" style="display:none"></h3>
        </div>`;

        target.parentElement.insertBefore(content , target);
}

function addProfileDiv(target){
	const hospital = document.getElementById('hospitalCode');
	const office = document.getElementById('officeCode');
	
	const name = `${hospital.options[hospital.selectedIndex].innerHTML} ${office.options[office.selectedIndex].innerHTML}`;
	
    var content = document.createElement('div');
    content.classList.add('con-area');
    content.innerHTML = 
        `<ul class="con">
	        <li class="img-area">
		        <div class="img">
		            <div class="file-upload">
		                <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" data-object/>
		                <input type="hidden" value="/resources/images/main/Img_noPerson.svg" name="memberImage1" data-object/> 
		                <i class="icon"></i>
		
		                <img src="" alt="의료진 이미지" style="display: none;" data-object>
		                
                        <div class="resolution">이미지해상도 (1200 x 1240)</div>
		            </div>
		
		            <div class="img-del">
		                <button type="button" class="img-del-btn" onclick="delImage(this)">이미지 삭제</button>
		            </div>
		        </div>
		
		        <div class="sub-img">
                	<div class="img">
                        <div class="file-upload">
                            <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" data-object/>
                            <input type="hidden" name="memberImage2" data-object/>
                            <i class="icon"></i>
                           
                            <img src="" alt="의료진 이미지" style="display: none;" data-object>
                            
                        	<div class="resolution">이미지해상도 (592 x 400)</div>
                        </div>
                        
                    	<div class="img-del">
                            <button type="button" class="img-del-btn" onclick="delImage(this)">이미지 삭제</button>
                        </div>
                	</div>

                	<div class="img">
                        <div class="file-upload">
                            <input type="file" id="upload" class="tab-con-img" onchange="commonfileReader(this, 'img')" data-object/>
                            <input type="hidden" name="memberImage3" data-object/>
                            <i class="icon"></i>

                            <img src="" alt="의료진 이미지" style="display: none;" data-object>
                            
                        	<div class="resolution">이미지해상도 (592 x 400)</div>
                        </div>
                        
                    	<div class="img-del">
                            <button type="button" class="img-del-btn" onclick="delImage(this)">이미지 삭제</button>
                        </div>
		        </div>
			</li>
		
	        <li class="btn-area">
	            <button type="button" class="no-show displayYn" value="Y" onclick="showButton(this , true)">노출</button>
	            <button type="button" class="edit end" onclick="editButton(this)">완료</button>
	            <button type="button" class="del" onclick="delButton(this.parentElement)">삭제</button>
	        </li>
		
		    <li class="history-area">
		        <div class="hospital">${name}</div>
		
		        <div class="input">
		            <input type="text" class="name" placeholder="이름" onkeyup="valueAdd(this)" name="memberName" required data-object>
		            <h2 class="txt" style="display:none"></h2>
		            <input type="text" class="position" placeholder="직책" onkeyup="valueAdd(this)" name="memberPosition" required data-object>
		            <span class="txt" style="display:none"></span>
		            <input type="text" class="desc" placeholder="설명" onkeyup="valueAdd(this)" name="memberIntro" required data-object>
		            <p class="txt" style="display:none"></p>
		         </div>
		
		        <ul class="history">
		        	<li>
                        <input class="history" type="text" placeholder="약력을 추가해 주세요.">
                        <button type="button" class="add-history" onclick="addProfileLi(this)">+</button>
                    </li>
		        </ul>
		    </li>
		</ul>`;

        target.parentElement.insertBefore(content , target);
}

function addProfileLi(target){
    const input = target.previousElementSibling;
    const btn = target.closest('ul.con').querySelector('.edit');

    if(input.value != ""){
        var content = document.createElement('li'); 
        content.innerHTML = 
            `<input class="history-fin" type="text" value="${input.value}" onkeyup="valueAdd(this)">
             <span>${input.value}</span>
             <div class="btn">
                 <button type="button" class="del-history" onclick="delButton(this)">-</button>
             </div>`;
    
        target.parentElement.parentElement.insertBefore(content , target.parentElement);
        input.value = null;
        
        //수정, 완료 상태값에 맞춰 보여주기
        if (btn.classList.contains('end')) { //수정 상태이면
        	const parent = target.closest('.history').querySelector('li:nth-last-child(2)');
        	
        	parent.querySelector('li:last-child input').style.display = 'block';
        	parent.querySelector('li:last-child span').style.display = 'none';
        }
    }else{
        alert('약력을 입력해 주세요');
    }
}

function delImage(target){
    const delBtn = target.parentElement;
    const parent = target.closest('.img');    
    const img    = parent.querySelector('img');
    const input  = parent.querySelector('input[type="hidden"]');
    const file   = parent.querySelector('input[type="file"]');
    const icon   = parent.querySelector('i');

	img.src = "";
    img.style.display = 'none';	
	input.value = ""; 
    file.style.display = 'block';
    icon.style.display = 'block';
    delBtn.classList.remove('show');
}