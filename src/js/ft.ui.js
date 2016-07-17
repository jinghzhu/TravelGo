  var movin = function() {
    console.info('movin');
  };
  
  var moveout = function() {
    console.info('moveout');
  };

  var tap = function(evt) {
    console.info(evt.target.bb);
    $(evt).addClass("mark-item-big");
  };
  
  var addorRemoveMark = function(pos, start) {
    // if mark exsited, remove it
    var allObj = map.getObjects(), 
	  bb, 
	  animatedSvg, 
	  icon, 
	  coords, 
	  marker;
    for (var i=0;i<allObj.length;i++){
      bb = allObj[i].bb;
      if(bb && (bb.lat == pos.lat && bb.lng == pos.lng)){
        map.removeObject(allObj[i]);
        return;
      }
    };
	if(start){
		map.removeObjects(map.getObjects());
		// mark not exsited, add it
        animatedSvg = "<div class='mark-item-start'>S</div>";
	} else {
		// mark not exsited, add it
        animatedSvg = "<div class='mark-item'></div>";
	}	
    icon = new H.map.DomIcon(animatedSvg);
    coords = pos;
    marker = new H.map.DomMarker(coords, {icon: icon});
    marker.addEventListener('pointerenter', movin);
    marker.addEventListener('pointerleave', moveout);
    marker.addEventListener('tap', tap);
    map.addObject(marker);
  };
  
  //route 
  function showRoute(waypoints){	
	map.removeObjects(map.getObjects());
  
	// Create the parameters for the routing request:
    var routingParameters = {	
	  'mode': 'fastest;car',
	  'representation': 'display'	  
	};
	
	for(var i = 0; i< waypoints.length; i++){
		routingParameters['waypoint' + i] = waypoints[i];
	};
	
	// Get an instance of the routing service:
    var router = platform.getRoutingService();
    
    // Call calculateRoute() with the routing parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    router.calculateRoute(routingParameters, onResult,
    function(error) {
      alert(error.message);
    });	
  };

  // Define a callback function to process the routing response:
  var onResult = function(result) {
    var route,
      routeShape,
      strip,
	  wps,
	  routeLine,
	  mp,
	  objs = [];	  
    if(result.response.route) {
      // Pick the first route from the response:
      route = result.response.route[0];
      // Pick the route's shape:
      routeShape = route.shape;
	  
	  wps = route.waypoint;

      // Create a strip to use as a point source for the route line
      strip = new H.geo.Strip();

      // Push all the points in the shape into the strip:
      routeShape.forEach(function(point) {
        var parts = point.split(',');
        strip.pushLatLngAlt(parts[0], parts[1]);
      });

	  // Retrieve the mapped positions of the requested waypoints:
	  // Retrieve the mapped positions of the requested waypoints:
	  for(var i=0; i < wps.length; i++){
		  mp = wps[i].mappedPosition;
		  if(i==0){
			  addorRemoveMark({lat:mp.latitude, lng:mp.longitude},true);
		  } else {
			  addorRemoveMark({lat:mp.latitude, lng:mp.longitude});
		  }
	  }	  
      // Create a polyline to display the route:
      routeLine = new H.map.Polyline(strip, {
        style: { strokeColor: 'red', lineWidth: 4 },
		arrows: {fillColor: '#F8E71C', width:3, length:3, frequency:5}
      });
	  objs.push(routeLine);    

      // Add the route polyline and the two markers to the map:
      map.addObjects(objs);

      // Set the map's viewport to make the whole route visible:
      map.setViewBounds(routeLine.getBounds());
    }
  }; 
	
  function centerMap(pos, len){
	const cons = 86.48;
    map.setCenter({lat:pos.lat, lng:pos.lng});
    if(!len)len = 1;
    map.setZoom(cons/len);
  };