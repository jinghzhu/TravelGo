const initLeftBar = function (dayNum) {
  'use strict';

  var i = 0, html = '';
  html += '<div class="leftbar-title">DAY</div>';
  html += '<ul class="nav nav-tabs col-md-12">'
  for (i = 0; i < dayNum; i++) {
    if (i === 0) {
      html += '<li class="active">';
    }
    else {
      html += '<li>';
    }
    html += '<span data-toggle="tab" class="day-span">' + (i + 1) + '</span>';
    html += '</li>';
  }

  html += '</ul>';

  return html;
}; 

/*const initAttractionCard = function (attractionObj) {
  'use strict';

  var html = '<section class="col-md-6">';
  html += '<figure class="figure-attraction-card">';
  html += '<img class="img-responsive" src="' + attractionObj.thumbnail + '" alt="travel go" />';
  html += '<figcaption>';
  html += '<p class="attraction-name">' + attractionObj.name + '</p>';
  html += '<p class="attraction-duration btn btn-primary">';
  html += '<span class="duration-title">Duration:</span>';
  html += '<span class="duration-content">' + attractionObj.duration + '</span>';
  html += '</p>';
  html += '<p class="attraction-description">' + attractionObj.description + '</p>';
  html += '</figcaption>';
  html += '</figure>';
  html += '</section>';

  return html;
};*/
