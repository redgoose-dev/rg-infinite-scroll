# RGInfiniteScroll

스크롤에서 가장 아래쪽으로 내려가면 데이터를 추가로 불러들이는 jQuery 라이브러리를 사용한 플러그인입니다.  
버튼으로도 추가로 스크롤 이벤트를 실행할 수 있습니다.  


# Example

먼저 파일 두개를 준비합니다. 예) `main.html, data.html`  
`main.html`파일은 컨텐츠의 목록이며 이 페이지에서 `data.html`의 내용을 불러옵니다.

### demo.html
```
<script src="./src/vendor/jquery-2.1.3.min.js"></script>
<script src="./src/js/RGInfiniteScroll.js"></script>
<script>
var index = new RGInfiniteScroll($(document), {
	url : './data.html?page={page}&param2=value2'
	,method : 'load'
});
```

위와같은 형식으로 객체를 만들어 사용할 수 있습니다.  
jQuery 플러그인 형식으로 사용하려면 아래와 같이 호출할 수 있습니다.

```
$(document).rgInfiniteScroll(options);
```


# Options
RGInfiniteScroll를 사용할때의 필요한 옵션들이 있습니다. 아래 목록을 참고해 주세요.

* __bottomSpace__ {Number} - default: 50  
스크롤을 내릴때 아래에서 지정한 값 지점에 내려갈때 이벤트가 실행되는지에 대한 값입니다.  

* __url__ {String} - default: null  
이벤트가 실행될때 호출하는 url주소입니다.  
주소 중간에 `{page}`키워드를 넣으면 이것이 이벤트 실행할때마다 늘어나는 페이지번호로 변환되어 데이터 페이지를 호출합니다.  
ex) `./data.php?param=value&page={page}` -> `./data.php?param=value&page=1`

* __method__ {String} - default: load (load|ajax)  
데이터를 가져오는 방식에 대한 선택을 합니다.

   * load : `$('<div>').load()` 메서드를 사용하여 페이지에 있는 내용 그대로 가져와서 특정 위치에 붙입니다.
   * ajax : `$.ajax()` 메서드를 이용하여 이벤트가 일어나면 callback함수를 받아 인자값으로 데이터를 넘겨줍니다.


* __startNumber__ {Number} - default: 2  
위에서 소개한 url옵션 값에서 {page}키워드에 초기로 지정되는 값입니다. 이벤트 호출시 몇페이지부터 부를건지에 대한 값을 정합니다.

* __ajaxOptions__ {Object}  
$.ajax() 메서드로 통신할때 사용하는 옵션값입니다.

	* __data__ {String}  
	url로 호출할때 같이 날리는 파라메터입니다. ex) `param1=value1&param2&value2`
	* __dataType__ {String} default: html (xml|jsons|script|html)  
	가져오려는 문서의 타입입니다.
	* __complete__ {Function}  
	데이터 호출을 성공했을때 실행되는 콜백함수입니다.  
	함수에서 return true으로 값을 넘기면 계속 실행이 되고 return false로 넘기면 실행이 되지 않습니다.


* __loadOptions__ {Object}  
$.load()메서드로 실행할때 사용하는 옵션값입니다.

	* __target__ {$()}  
	데이터를 호출하고 얻은 엘리먼트들을 삽입할 위치를 jQuery selector형태로 지정합니다. ex) `$('#list')`
	* __selector__ {String}  
	호출하는 데이터의 dom에서 가져올 엘리먼트를 선택합니다. ex) `#data li`

	* __complete__ {Function} function(data) {}  
	불러온 데이터가 dom에 들어가고 실행되는 함수입니다.  
	함수에서 return true으로 값을 넘기면 계속 실행이 되고 return false로 넘기면 실행이 되지 않습니다.


* __loadingAction__ {Function} - default: function(sw) {}  
로딩에 관한 함수.  
sw값이 boolean형식으로 출력되는것을 이용하여 로딩전, 로딩후의 행동을 별도로 만들 수 있습니다.
```
default : function(sw) {
	switch(sw) {
		case true:
			// loading...
			break;
		case false:
			// finish loading
			break;
	}
}
```


# Method
별도의 클릭이벤트나 다른 이벤트를 통하여 RGInfiniteScroll의 이벤트를 제어할 수 있습니다.

### load( pageNumber )
url의 엘리먼트를 불러와 목록에서 추가합니다. 인자값은 페이지번호로 설정할 수 있습니다.

### ajax( pageNumber )
url의 데이터를 불러와 callback함수를 실행합니다.

### run()
스크롤 이벤트를 작동합니다.

### stop()
스크롤 이벤트를 중단합니다.

### setPageNumber( pageNumber )
현재 페이지를 변경합니다.

### getPageNumber()
현재 페이지를 가져옵니다. 숫자형으로 반환해줍니다.
