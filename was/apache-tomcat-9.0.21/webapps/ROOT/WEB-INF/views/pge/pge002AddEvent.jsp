 <%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="con" style="align-items: flex-start;">
	<label class="need" style="margin-top:20px;">팝업 내용</label>
	<div class="event-popup">
	    <div class="text-area">
	        <div class="main-tit" id="preTit">팝업 제목이 표시됩니다.</div>
	        <div class="bottom-text">이벤트 기간 동안 특별한 가격으로 만나보세요.</div>
	        <ul>
	            <li><span class="pre-text-tit">이벤트 기간</span><span class="bold" id="preDate">0000.00.00 ~ 0000.00.00</span></li>
	            <li><span class="pre-text-tit">이벤트 대상</span><span class="bold">해당 기간 동안 방문 고객</span></li>
	        </ul>
	    </div>
	    <ul class="event-tabs" id="newEvent">
	        
	        <li class="new-event">
	            <div class="btns">
	                <label class="best"><input type="radio" name="eventType1" value="BEST" checked="checked"><span>BEST</span></label>
	                <label class="new"><input type="radio" name="eventType1" value="NEW"><span>NEW</span></label>
	                <label class="hot"><input type="radio" name="eventType1" value="HOT"><span>HOT</span></label>
	            </div>
	            <div class="input-con">
	                <textarea class="event-tit" name="eventContent1" placeholder="이벤트 제목을 입력해 주세요." required></textarea>
	                <textarea class="event-desc" name="eventContent2" placeholder="이벤트 설명을 입력해 주세요." required></textarea>
	                <input class="event-price" name="eventPrice" type="text" placeholder="가격을 입력해 주세요." onkeyup="setNumValue(this)" required>
	                <input class="event-url" name="eventUrl" type="text" placeholder="연결할 링크를 입력해 주세요." required>
	            </div>
	        </li> 
	        
   	        <li class="new-event">
	            <div class="btns">
	                <label class="best"><input type="radio" name="eventType2" value="BEST" checked="checked"><span>BEST</span></label>
	                <label class="new"><input type="radio" name="eventType2" value="NEW"><span>NEW</span></label>
	                <label class="hot"><input type="radio" name="eventType2" value="HOT"><span>HOT</span></label>
	            </div>
	            <div class="input-con">
	                <textarea class="event-tit" name="eventContent1" placeholder="이벤트 제목을 입력해 주세요." required></textarea>
	                <textarea class="event-desc" name="eventContent2"placeholder="이벤트 설명을 입력해 주세요." required></textarea>
	                <input class="event-price" name="eventPrice" type="text" placeholder="가격을 입력해 주세요." onkeyup="setNumValue(this)" required>
	                <input class="event-url" name="eventUrl" type="text" placeholder="연결할 링크를 입력해 주세요." required>
	            </div>
	        </li>
	        
   	        <li class="new-event">
	            <div class="btns">
	                <label class="best"><input type="radio" name="eventType3" value="BEST" checked="checked"><span>BEST</span></label>
	                <label class="new"><input type="radio" name="eventType3" value="NEW"><span>NEW</span></label>
	                <label class="hot"><input type="radio" name="eventType3" value="HOT"><span>HOT</span></label>
	            </div>
	            <div class="input-con">
	                <textarea class="event-tit" name="eventContent1" placeholder="이벤트 제목을 입력해 주세요." required></textarea>
	                <textarea class="event-desc" name="eventContent2"placeholder="이벤트 설명을 입력해 주세요." required></textarea>
	                <input class="event-price" name="eventPrice" type="text" placeholder="가격을 입력해 주세요." onkeyup="setNumValue(this)" required>
	                <input class="event-url" name="eventUrl" type="text" placeholder="연결할 링크를 입력해 주세요." required>
	            </div>
	        </li>
	        
   	        <li class="new-event">
	            <div class="btns">
	                <label class="best"><input type="radio" name="eventType4" value="BEST" checked="checked"><span>BEST</span></label>
	                <label class="new"><input type="radio" name="eventType4" value="NEW"><span>NEW</span></label>
	                <label class="hot"><input type="radio" name="eventType4" value="HOT"><span>HOT</span></label>
	            </div>
	            <div class="input-con">
	                <textarea class="event-tit" name="eventContent1" placeholder="이벤트 제목을 입력해 주세요." required></textarea>
	                <textarea class="event-desc" name="eventContent2"placeholder="이벤트 설명을 입력해 주세요." required></textarea>
	                <input class="event-price" name="eventPrice" type="text" placeholder="가격을 입력해 주세요." onkeyup="setNumValue(this)" required>
	                <input class="event-url" name="eventUrl" type="text" placeholder="연결할 링크를 입력해 주세요." required>
	            </div>
	        </li> 
	        
   	        <li class="btn-add-event" onclick="addEvent();">
	            <img src="/resources/images/pge/PlusDoc.svg" alt="탭추가">
	        </li>	        
        </ul>	        
	</div>
</div>

<script>
	setPopEventRightContent();
</script>