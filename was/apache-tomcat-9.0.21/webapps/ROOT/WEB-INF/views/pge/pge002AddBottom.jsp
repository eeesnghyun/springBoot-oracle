<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="con" style="align-items: flex-start;">
	<label class="need" style="margin-top:20px; min-width:125px;">팝업 내용</label>
	<div class="tab-bottom" style="width:1200px;">
		<div id="fileWrap">
	       	<div class="file-upload">
	           	<input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	           	<input type="hidden" id="tabInputImg" name="bottomImage" data-object/>
	           	<i class="icon"></i>
	           	<input type="text" class="tab-url" name="bottomUrl" placeholder="연결할 링크를 입력해 주세요." >
	           
	           	<img src="" alt="이미지" style="display: none;">
	           	<div class="resolution">이미지해상도 (2000 x 1280)</div>
	       	</div>
	       	
	       	<div class="file-upload" style="display:none;">
	           	<input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*" >
	           	<input type="hidden" id="tabInputImg" name="bottomImage" data-object/>
	           	<i class="icon"></i>
	           	<input type="text" class="tab-url" name="bottomUrl" placeholder="연결할 링크를 입력해 주세요.">
	           
	           	<img src="" alt="이미지" style="display: none;">
	           	<div class="resolution">이미지해상도 (2000 x 1280)</div>
	       	</div>
	       	
	       	<div class="file-upload" style="display:none;">
	           	<input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	           	<input type="hidden" id="tabInputImg" name="bottomImage" data-object/>
	           	<i class="icon"></i>
	           	<input type="text" class="tab-url" name="bottomUrl" placeholder="연결할 링크를 입력해 주세요.">
	           
	           	<img src="" alt="이미지" style="display: none;">
	           	<div class="resolution">이미지해상도 (2000 x 1280)</div>
	       	</div>
	       	
	       	<div class="file-upload" style="display:none;">
	           	<input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	           	<input type="hidden" id="tabInputImg" name="bottomImage" data-object/>
	           	<i class="icon"></i>
	           	<input type="text" class="tab-url" name="bottomUrl" placeholder="연결할 링크를 입력해 주세요.">
	           
	           	<img src="" alt="이미지" style="display: none;">
	           	<div class="resolution">이미지해상도 (2000 x 1280)</div>
	       	</div>
	       	
       		<div class="file-upload" style="display:none;">
	           	<input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	           	<input type="hidden" id="tabInputImg" name="bottomImage" data-object/>
	           	<i class="icon"></i>
	           	<input type="text" class="tab-url" name="bottomUrl" placeholder="연결할 링크를 입력해 주세요.">
	           
	           	<img src="" alt="이미지" style="display: none;">
	           	<div class="resolution">이미지해상도 (2000 x 1280)</div>
	       	</div>	
       	</div>	
        
		<ul class="tabs" id="tabs">
			<li class="add-input">
				<input class="new-tab" type="text" placeholder="타이틀을 입력해 주세요.">
				<button class ="btn-del-tab" id="inputDel" type="button" onclick="inputValueDelete('bottom');"></button>
			</li>
			<button type="button" class="btn-add-tab" onclick="addTab('bottom')">탭 추가</button>
		</ul>
    </div>
</div>
