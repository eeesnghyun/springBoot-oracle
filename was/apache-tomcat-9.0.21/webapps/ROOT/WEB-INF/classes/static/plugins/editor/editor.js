var commands = [
{
    cmd: "foreColor",
    name: "A",
    icon: "color",
    img : "/resources/images/prd/Editor_color.svg",
    val: "",
    desc:"글꼴의 색을 바꿀 수 있습니다."
},
{
    cmd: "bold",
    name: "B",
    icon: "bold",
    img : "/resources/images/prd/Editor_bold.svg",
    desc: "글꼴의 두께를 바꿀 수 있습니다."
},
{
    cmd: "italic",
    name: "I",
    icon: "italic",
    img : "/resources/images/prd/Editor_ita.svg",
    desc: "글꼴의 기울기를 바꿀 수 있습니다."
},
{
    cmd: "underline",
    name: "U",
    icon: "underline",
    img : "/resources/images/prd/Editor_under.svg",
    desc: "글꼴 하단에 밑줄을 추가합니다."
},
{
    cmd: "insertImage",
    icon: "insertImage",
    img : "/resources/images/common/Editor_image2.svg",
    desc: "이미지를 추가합니다."
  },
  {
    cmd: "insertHTML",
    icon: "insertHTML",
    img : "/resources/images/common/Editor_link.svg",
    desc: "선택영역에 링크요소를 만듭니다."
  },
];

var commandRelation = {};

function supported(cmd) {
    var css = !!document.queryCommandSupported(cmd.cmd)
        ? "btn-succes"
        : "btn-error";
    return css;
}

function icon(cmd) {
    return typeof cmd.icon !== "undefined" ? cmd.icon : "";
}

function doCommand(cmdKey) {
	setTimeout(function() {
	    var cmd = commandRelation[cmdKey];
	    if (supported(cmd) === "btn-error") {
	        alert("execCommand(“" + cmd.cmd + "”)\nis not supported in your browser");
	        return;
	    }
	    
	    if(cmd.cmd == 'foreColor'){
	    	commands[0].val = getComputedStyle(document.querySelector('.sp-preview-inner')).backgroundColor;	
	    }
	    
	    if(cmd.cmd == 'insertImage'){
	    	commands[0].val = document.querySelector('span.insertImage .input input[type="hidden"]').value;
	    	document.querySelector('span.insertImage .input').remove();
	    }
	    
	    if (cmd.cmd == 'insertHTML') {
	    	 var selectionText = ""; //마우스로 드래그한 글
             
	    	   if (document.getSelection) {
	    	       selectionText = document.getSelection();
	    	   } else if (document.selection) {
	    	       selectionText = document.selection.createRange().text;
	    	   }
			
			commands[0].val = '<a href="' + selectionText + '" target="_blank">' + selectionText + '</a>' ;
	    }
	    
	   document.execCommand(cmd.cmd, false, commands[0].val);
	}, 200);
}

function editorInit() {
    var html = "",
        template =
        `<span class="%iconClass%">
            <code class="btn btn-xs %btnClass%" title="%desc%" onmousedown="event.preventDefault();" onclick="doCommand(\'%cmd%\')">
                <img src="%img%">
            </code>
        </span>`;

    commands.map(function (command, i) {
        commandRelation[command.cmd] = command;
        var temp = template;
        temp = temp.replace(/%iconClass%/gi, icon(command));
        temp = temp.replace(/%desc%/gi, command.desc);
        temp = temp.replace(/%btnClass%/gi, supported(command));
        temp = temp.replace(/%cmd%/gi, command.cmd);
        temp = temp.replace(/%name%/gi, command.name);
        temp = temp.replace(/%img%/gi, command.img);
        html += temp;
    });
	
    //폰트 컬러
    document.querySelector(".buttons").innerHTML = html;
    document.querySelector('span.color code').innerHTML += `<input id="color-picker" onchange="doCommand('foreColor')">`;

	$('#color-picker').spectrum({      //폰트 컬러 플러그인
	    type: "color",
	    hideAfterPaletteSelect: true,
	    showInitial: true,
	    allowEmpty: false
	});
	
	document.querySelector('.sp-preview-inner').setAttribute('onclick',"doCommand('foreColor')");
	
    //이미지 삽입
    document.querySelector('span.insertImage code').removeAttribute('onclick',"doCommand('insertImage')");
    document.querySelector('span.insertImage').setAttribute('onclick',"setImg()");
}

function setImg(){
	if (isNullStr(document.querySelector('span.insertImage input'))) {
	    document.querySelector('span.insertImage').innerHTML += 
	    	`<div class="input">
		    	<input type="file" style="position:absolute; display:none;">
		    	<input type="hidden">
	    	</div>`;
	    
	    document.querySelector('span.insertImage input[type="file"]').setAttribute('onchange',"fileReader(this)");
	    document.querySelector('span.insertImage input[type="hidden"]').setAttribute('onchange',"doCommand('insertImage')");
	}
	document.querySelector('span.insertImage input[type="file"]').click();
}

function fileReader(ele){
    const reader = new FileReader();
    const file = ele.files[0];
	const imageTypes = [
		'tiff', 'pjp'  , 'jfif', 'bmp' , 'gif',
		'svg' , 'png'  , 'xbm' , 'dib' , 'jxl',
		'jpeg', 'svgz' , 'jpg' , 'webp', 'ico',
		'tif' , 'pjpeg', 'avif' 
	];    	    
	const image = file.name.split('.').pop().toLowerCase();    	

	//이미지 확장자 체크
	if (imageTypes.indexOf(image) === -1) {
		alert("파일 확장자를 확인해주세요.");
		return;
	}
	
	//이미지 용량 1MB 제한
	if (file.size > 1024 * 1024) {
        alert("이미지 용량이 너무 큽니다.");
        return;
    }    	    	
	
	reader.onload = function() {
		//파일 태그 다음에는 항상 히든 태그가 존재해야함
		ele.nextElementSibling.value = reader.result;
		ele.nextElementSibling.onchange(); 
	}
	
    reader.readAsDataURL(file);
}