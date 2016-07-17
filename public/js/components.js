const initLeftBar=function(dayNum){"use strict";var i=0,html="";for(html+='<div class="leftbar-title">DAY</div>',html+='<ul class="nav nav-tabs col-md-12">',i=0;i<dayNum;i++)html+=0===i?'<li class="active">':"<li>",html+='<span data-toggle="tab" class="day-span">'+(i+1)+"</span>",html+="</li>";return html+="</ul>"};
//# sourceMappingURL=maps/components.js.map
