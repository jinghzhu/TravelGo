function onEnter() {
  if(event.keyCode == 13) {
    $('#search').click();
  }
}

const cityActions = function () {

  $('.actions .startLoc').click(function (evt) {
    var elem = evt.target,
      active = $('.actions .active');

    active.removeClass('active');
    $(elem).addClass('active');
    $(elem).next().attr('checked', true);
    var id = $(elem).next().val();
    localStorage.start = id;
    addPoint(id);
  });
};
