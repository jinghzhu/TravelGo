
var nowTemp = new Date();
var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);


var checkin = $('#startDate').datepicker({
  format: 'yyyy-mm-dd',
  orientation: 'bottom',
  onRender: function(date) {
    alert("ddd")
    return date.valueOf() < now.valueOf() ? 'disabled' : '';
  }
}).on('changeDate', function(ev) {
  if (checkout.date && (ev.date.valueOf() > checkout.date.valueOf())) {
    var newDate = new Date(ev.date)
    newDate.setDate(newDate.getDate() + 1);
    checkout.setValue(newDate);
  }
  checkin.hide();
  $('#endDate') .focus();
}).data('datepicker');

var checkout = $('#endDate').datepicker({
  format: 'yyyy-mm-dd',
  orientation: 'bottom',
  onRender: function(date) {
    return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
  }
}).on('changeDate', function(ev) {
  checkout.hide();
}).data('datepicker');
