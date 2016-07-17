
function onEnter() {
  if(event.keyCode == 13) {
    $('#search').click();
  }
}

function redirectMain() {
  var location = $('#location').val() || 'paris',
    start = $('#startDate').val() || '2016-07-15',
    end = $('#endDate').val() || '2016-07-18';

  window.location += 'main?location=' + location + '&start=' + start + '&end=' + end;
}

$('#search').click(function (evt) {
  redirectMain();
});
