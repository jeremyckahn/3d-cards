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
    }
  },
  paths: {
    jquery: '../bower_components/jquery/jquery'
    ,'jquery.mousewheel': '../bower_components/jquery-mousewheel/jquery.mousewheel'
    ,backbone: '../bower_components/backbone/backbone'
    ,underscore: '../bower_components/underscore/underscore'
  }
});

require([

  'jquery'
  ,'backbone'

  ,'views/cards-view'

  // Plugins that don't return anything
  ,'jquery.mousewheel'

], function (

  $
  ,Backbone

  ,CardsView

) {
  Backbone.history.start();

  var $cardsContainer = $('.cards-container');

  new CardsView({
    el: $cardsContainer[0]
  });

  $cardsContainer.removeClass('loading');
});
