<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="con" style="align-items: flex-start;">
	<label class="need" style="margin-top:20px; min-width:125px;" >팝업 내용</label>
	<div class="tab-right">
		<div id="fileWrap">		
		   <div class="file-upload" style="display:block;">
	          <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*"/>
	          <input type="hidden" id="tabInputImg" name="rightImage" data-object/>
	          <i class="icon"></i>
	          <input type="text" class="tab-url" name="rightUrl" placeholder="연결할 링크를 입력해 주세요.">
	          <img src="" alt="이미지" style="display: none;">
	          <div class="resolution">이미지해상도 (1400 x 1420)</div>
		   </div>
		   
	   	   <div class="file-upload" style="display:none;">
	          <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	          <input type="hidden" id="tabInputImg" name="rightImage" data-object/>
	          <i class="icon"></i>
	          <input type="text" class="tab-url" name="rightUrl" placeholder="연결할 링크를 입력해 주세요.">
	          <img src="" alt="이미지" style="display: none;">
	          <div class="resolution">이미지해상도 (1400 x 1420)</div>
		   </div>
		   
	   	   <div class="file-upload" style="display:none;">
	          <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	          <input type="hidden" id="tabInputImg" name="rightImage" data-object/>
	          <i class="icon"></i>
	          <input type="text" class="tab-url" name="rightUrl" placeholder="연결할 링크를 입력해 주세요.">
	          <img src="" alt="이미지" style="display: none;">
	          <div class="resolution">이미지해상도 (1400 x 1420)</div>
		   </div>
		   
	   	   <div class="file-upload" style="display:none;">
	          <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	          <input type="hidden" id="tabInputImg" name="rightImage" data-object/>
	          <i class="icon"></i>
	          <input type="text" class="tab-url" name="rightUrl" placeholder="연결할 링크를 입력해 주세요." >
	          <img src="" alt="이미지" style="display: none;">
	          <div class="resolution">이미지해상도 (1400 x 1420)</div>
		   </div>
		   
	   	   <div class="file-upload" style="display:none;">
	          <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	          <input type="hidden" id="tabInputImg" name="rightImage" data-object/>
	          <i class="icon"></i>
	          <input type="text" class="tab-url" name="rightUrl" placeholder="연결할 링크를 입력해 주세요.">
	          <img src="" alt="이미지" style="display: none;">
	          <div class="resolution">이미지해상도 (1400 x 1420)</div>
		   </div>
		   
	   	   <div class="file-upload" style="display:none;">
	          <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	          <input type="hidden" id="tabInputImg" name="rightImage" data-object/>
	          <i class="icon"></i>
	          <input type="text" class="tab-url" name="rightUrl" placeholder="연결할 링크를 입력해 주세요.">
	          <img src="" alt="이미지" style="display: none;">
	          <div class="resolution">이미지해상도 (1400 x 1420)</div>
		   </div>
		   
	  	   <div class="file-upload" style="display:none;">
	          <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	          <input type="hidden" id="tabInputImg" name="rightImage" data-object/>
	          <i class="icon"></i>
	          <input type="text" class="tab-url" name="rightUrl" placeholder="연결할 링크를 입력해 주세요.">
	          <img src="" alt="이미지" style="display: none;">
	          <div class="resolution">이미지해상도 (1400 x 1420)</div>
		   </div>
		   
	   	   <div class="file-upload" style="display:none;">
	          <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	          <input type="hidden" id="tabInputImg" name="rightImage" data-object/>
	          <i class="icon"></i>
	          <input type="text" class="tab-url" name="rightUrl" placeholder="연결할 링크를 입력해 주세요.">
	          <img src="" alt="이미지" style="display: none;">
	          <div class="resolution">이미지해상도 (1400 x 1420)</div>
		   </div>
		   
	   	   <div class="file-upload" style="display:none;">
	          <input type="file" class="img-input" onchange="commonfileReader(this, 'img')" accept="image/*">
	          <input type="hidden" id="tabInputImg" name="rightImage" data-object/>
	          <i class="icon"></i>
	          <input type="text" class="tab-url" name="rightUrl" placeholder="연결할 링크를 입력해 주세요.">
	          <img src="" alt="이미지" style="display: none;">
	          <div class="resolution">이미지해상도 (1400 x 1420)</div>
		   </div>
	   </div>
		   
	   <div class="wrap">
	     	<div class="text-area">
	            <div class="top-text">BEAUTYON CHOICE EVENT</div>
				<div class="main-tit" id="preTit">팝업 제목이 표시됩니다.</div>
				<div class="bottom-text">이벤트 기간 동안 특별한 가격으로 만나보세요.</div>
				<ul>
				    <li><span>이벤트 기간</span><span class="bold" id="preDate">0000.00.00 ~ 0000.00.00</span></li>
				    <li><span>이벤트 대상</span><span class="bold">해당 기간 동안 방문 고객</span></li>
				</ul>
				<p>*원내 사정에 따라 이벤트가 변경되거나 조기 종료될 수 있습니다.</p>
		    </div>
		     
		   <ul class="tabs" id="tabs">
		      <li class="add-input">
		      <input class="new-tab"type="text" placeholder="타이틀을 입력해 주세요.">
		      <button class ="btn-del-tab" id="inputDel" type="button" onclick="inputValueDelete('right');"></button>
		      </li>
		      <button type="button" class="btn-add-tab"  style="display: block;"onclick="addTab('right')">탭 추가</button>
		   </ul>
	  
		</div>
	</div>
</div>

<script>
	setPopEventRightContent();
</script>