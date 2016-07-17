console.log(1);
//# sourceMappingURL=maps/ft.citySearch.js.map

//获取line
function getPointList(){
  var tmp = localStorage.pointList;
  var tmpArr = unique(JSON.parse(tmp));
  console.log(tmpArr);
// wp.push('50.11,8.68');
  console.log("start");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // console.info( xhttp.responseText);
      var rs = eval('(' + xhttp.responseText + ')');
	  var wp = [];
      console.log(rs);
	  if(rs.activities && rs.activities.length){
		  for (var i =0;i<rs.activities.length; i++) {
			if(rs.activities[i] != null){
				console.log(rs.activities[i].latLng);
				wp.push(rs.activities[i].latLng);
			}
		  }

		  if(wp.length > 1){
			  addRouteOnMap(wp);
		  } else if(wp.length ===1){
			  var loc = wp[0].split(",");
			  addorRemoveMark({lat:loc[0],lng:loc[1]}, true);
			  centerMap({lat:loc[0],lng:loc[1]}, 5.73);
		  }
		}
    }
  };
  xhttp.open("POST", "api/v1/routing", true);
  xhttp.send(JSON.stringify({"ids":tmpArr, "endPoint":tmpArr[tmpArr.length-1], "startPoint":tmpArr[0]}));

  console.log("send");
  return tmpArr;
}


function addRouteOnMap(arr){
  var wp=[];
  for(var i=0;i<arr.length;i++){
    wp.push(arr[i]);
  }
  showRoute(wp);
}

//添加点
function addPoint(posId){
  var objStr = localStorage.pointList;
  var obj = [];

  if(typeof(objStr) !== "undefined"){
    obj = JSON.parse(objStr);
  }

  var ids = obj;
  var index =  ids.indexOf(posId);
  if(index!="-1"){
    //删除
    ids.splice(index,1);
  }else{
    //添加
    ids.push(posId);
  }
  unique(ids);
  console.log(ids);
  var tmp = JSON.stringify(ids);
  localStorage.pointList = tmp;
}

//去重
function unique(a) {
  return Array.from(new Set(a));
}

function removePoint(id) {
    var list = JSON.parse(localStorage.pointList);

      for(var i = 0;i < list.length;i ++) {
        if(id == list[i]) {
            list.splice(i, 1);
          }
      }
    localStorage.pointList = JSON.stringify(list);
  }


//添加交互事件
function bindAddToMapEvent() {
  $('.select').each(function () {
    $(this).click(function (event) {
      var id = $(this).val();
      if($(this).is(':checked')) {
        addPoint(id);
		getPointList();
      } else {
        removePoint(id);
		getPointList();
      }
    });
  });
}

// Render City
function renderCity(data) {
  var cityList = '';
  cityList += "<section class='col-xs-10 col-md-6'><figure class='figure-attraction-card'>";
  cityList += "<div class='actions'><span class='startLoc'>start</span><input class='select' type='checkbox' value=" + data.id + "></div>";
  cityList += "<img class='img-responsive' src='" + data.imageUrl + "' alt='travel go' />";
  cityList += "<figcaption>";
  cityList += "<p class='attraction-name' title='" + data.title + "'>" + data.title + "</p>";
  cityList += "<p class='attraction-duration btn btn-primary'><span class='duration-title'>Duration:</span>";
  cityList += "<span class='duration-content'>" + data.duration + "</span></p>";
  // cityList += "<p class='attraction-description'>"+ data.supplierName + "</p>";
  // cityList += "<p class='attraction-description'>"+ data.redemptionType +"</p>";
  // cityList += "<p class='attraction-description'>"+ data.fromPrice + "</p>";
  cityList += "<p class='attraction-description'>"+ data.fromPrice + "</p>";
  cityList += "</figcaption>";
  cityList += "</figure></section>";

  return cityList;
}

var queryVal = window.location.search,
  queryVal = queryVal.substring(1),
  values = queryVal.split('&'),
  loc = values[0].split('=')[1],
  startDate = values[1].split('=')[1],
  endDate = values[2].split('=')[1],
  _location = $('#location').val() || loc,
  _start = $('#startDate').val() || startDate,
  _end = $('#endDate').val() || endDate;

$('#location').val(loc);
$('#startDate').val(startDate);
$('#endDate').val(endDate);
$('#topLoc').text(loc);
$('#firstDate').text(startDate);

searchView(_location, _start, _end);

$('#search').click(function () {
  var _location = $('#location').val(),
  _start = $('#startDate').val(),
  _end = $('#endDate').val();

  $('#topLoc').text(_location);
  $('#firstDate').text(_start);

  location = location.protocol + '//' + location.host +'/main?location=' + _location + '&start=' + _start + '&end=' + _end;

  // searchView(_location, _start, _end);
});

//搜索函数
function searchView(city, startDate, endDate) {
  var uri = "api/v1/list/" + city + "/" + startDate + "/" + endDate;
  $.get(uri,
    {},
    function (data) {
      var rs = data;
      var html = "";
      var cityListHtml = "";
      var arr = rs.activities[0].latLng.split(','),
        obj = {};
      obj.lat = arr[0];
      obj.lng = arr[1];
      centerMap(obj, 8);
      for (var i in rs.activities) {
        cityListHtml += renderCity(data.activities[i]);
      }
      $('#cityList').html(cityListHtml);
      cityActions();
      bindAddToMapEvent();

    });
}

function addTestMark(data) {

  var pos = {lat: data.lat, lng: data.lng};
  var animatedSvg = "<div class='mark-item'><ul><img src=" + data.img + "><li>" + data.title + "</li><li>价格：" + data.price + "</li></ul></div>";

  var icon = new H.map.DomIcon(animatedSvg),
    coords = pos,
    marker = new H.map.DomMarker(coords, {icon: icon});

  //var marker = new H.map.Marker(pos);
  marker.addEventListener('pointerenter', movin);
  marker.addEventListener('pointerleave', moveout);
  marker.addEventListener('tap', tap);
  map.addObject(marker);
}

function removeTestMark(data) {
  var pos = {lat: data.lat, lng: data.lng};
  var coords = pos,
    marker = new H.map.DomMarker(coords);
  map.removeObject(marker);
}
