
function drawPopup() {
    commonDrawPopup("load", "/pge/pge004Popup");
}

function initSelect(hospitalCode, officeCode) {
	commonGetHospital(hospitalCode);
	
	document.getElementById("hospitalCode").value = hospitalCode;	
	document.getElementById("officeCode").value = officeCode;	
	
	getHomeIntro();
}

function getHomeIntro() {	
	let hospitalCode = "";
	let officeCode   = "";
		
	if (isPop) {
		hospitalCode = document.getElementById("popHospitalCode").value;
		officeCode   = document.getElementById("popOfficeCode").value;			
	} else {
		hospitalCode = document.getElementById("hospitalCode").value;
		officeCode   = document.getElementById("officeCode").value;		
	}
	
	const params = {
		"hospitalCode" : hospitalCode,
		"officeCode"   : officeCode
	};
	
	if (!isPop) {
		commonSetOfficeSite("#homePageUrl", params , "/intro");	
	}
	
	commonAjax.call("/pge/getHomeIntro", "POST", params, function(data){
		if (data.message == "OK") {
			const result = data.result;

			commonFormReset("#frm");
			
			if (!isNullStr(result)) {
				document.querySelector('input[name="headerImage"]').value 		= result.headerImage;				
				document.querySelector('input[name="headerTitle1"]').value      = result.headerTitle1;
				document.querySelector('input[name="headerTitle2"]').value      = result.headerTitle2;
				document.querySelector('input[name="headerContent1"]').value    = result.headerContent1;
				document.querySelector('textarea[name="headerContent2"]').value = result.headerContent2;
				document.querySelector('input[name="bottomImage"]').value		= result.bottomImage;
				document.querySelector('input[name="bottomTitle1"]').value      = result.bottomTitle1;
				document.querySelector('input[name="bottomTitle2"]').value      = result.bottomTitle2;
				document.querySelector('input[name="bottomContent1"]').value    = result.bottomContent1;
				document.querySelector('textarea[name="bottomContent2"]').value = result.bottomContent2;
				document.querySelector('input[name="bottomContent3"]').value    = result.bottomContent3;
				document.querySelector('textarea[name="bottomContent4"]').value = result.bottomContent4;
				document.querySelector('input[name="bottomContent5"]').value    = result.bottomContent5;
				document.querySelector('textarea[name="bottomContent6"]').value = result.bottomContent6;
							
				//이미지
				getImg(result.headerImage , 'headerImage');
				getImg(result.bottomImage , 'bottomImage');	
				
				textHeight();
			}	
		} else {
			alert(data.message);
		}
	});		
}

function getImg(image, name) {
	const div = document.querySelector(`input[name="${name}"]`).parentNode;
	
	if (!isNullStr(image)) {
		div.querySelector('i').style.display = 'none';
		div.querySelector('img').src = image;
		div.querySelector('img').style.display = 'block';
	}
}

function checkSave() {	
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
				<button type="button" class="preview-btn dark-btn" onclick="introPreview()">미리보기</button>
				<button type="button" class="save-btn blue-btn" onclick="introSave()">저장하기</button>
			</div>
		</div>`;

	commonDrawPopup("draw", content);
}

function introPreview() {	
	const params = commonArrayToJson($("#frm").serializeArray());
		
	if (commonCheckRequired("#frm")) {
		commonAjax.call("/pge/updateIntroPreview", "POST", params, function(data){
			if (data.message == "OK") {				
				
				const page = document.getElementById("homePageUrl").innerHTML.split('/intro');
				
				window.open(page[0] + "/preview/intro", "_blank");				
			}
		});		
	} else {
		document.querySelector(".del-btn").click();
	}		
}

function introSave() {		
	if (commonCheckRequired("#frm")) {
		const params = commonArrayToJson($("#frm").serializeArray());
    	
    	commonAjax.call("/pge/updateIntro", "POST", params, function(data){
    		if (data.message == "OK") {				
    			alert('저장되었습니다.');      
    			document.querySelector(".del-btn").click();
    		}
    	});
	}		
}

function textHeight(){
	const textarea = document.querySelectorAll("textarea");
    
	for(let i = 0; i < textarea.length; i++){
		textarea[i].style.minWidth = "900px";
		textarea[i].style.fontSize = "18px";
		textarea[i].style.height = textarea[i].scrollHeight +  10 + "px";
		textarea[i].addEventListener("input", function (e) {
			  this.style.height = this.scrollHeight + "px";
		});	
		
		textarea[i].addEventListener('keyup', function(e) {
			this.style.height = "auto";
			this.style.height = this.scrollHeight + "px";
		});
		
		textarea[i].dispatchEvent(new Event('keyup'));	
	}
}

