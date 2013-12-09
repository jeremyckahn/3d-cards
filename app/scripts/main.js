/*global require*/
'use strict';

require.config({
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore'
        ,'jquery'
      ]
      ,exports: 'Backbone'
    },
    bootstrap: {
      deps: ['jquery']
      ,exports: 'jquery'
    },
    'jquery.vertigo': {
      deps: ['jquery']
    }
  },
  paths: {
    jquery: '../bower_components/jquery/jquery'
    ,'jquery.mousewheel': '../bower_components/jquery-mousewheel/jquery.mousewheel'
    ,'jquery.vertigo': '../bower_components/vertigo/src/vertigo'
    ,backbone: '../bower_components/backbone/backbone'
    ,underscore: '../bower_components/underscore/underscore'
  }
});

require([

  'jquery'
  ,'backbone'

  // Plugins that don't return anything
  ,'jquery.mousewheel'
  ,'jquery.vertigo'

], function (

  $
  ,Backbone

) {
  Backbone.history.start();

  var $cardsContainer = $('.cards-container');
  $cardsContainer
    .vertigo()
    .removeClass('loading');
});
