function onEnter(){13==event.keyCode&&$("#search").click()}const cityActions=function(){$(".actions .startLoc").click(function(evt){var elem=evt.target,active=$(".actions .active");active.removeClass("active"),$(elem).addClass("active"),$(elem).next().attr("checked",!0);var id=$(elem).next().val();localStorage.start=id,addPoint(id)})};
//# sourceMappingURL=maps/cityActions.js.map
