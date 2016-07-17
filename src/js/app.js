(function app() {
  'use strict';

  console.log('init app...');
  window.addEventListener('DOMContentLoaded', function appDCL() {
    // Mean to console.log out, so disabling
    console.log('Hello World'); // eslint-disable-line no-console

    $('#leftbar').html(initLeftBar(3));

  });
}());
