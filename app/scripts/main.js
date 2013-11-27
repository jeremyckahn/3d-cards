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
    ,backbone: '../bower_components/backbone/backbone'
    ,underscore: '../bower_components/underscore/underscore'
  }
});

require([

  'backbone'

  ,'views/cards-view'

], function (

  Backbone

  ,CardsView

) {
  Backbone.history.start();

  new CardsView({
    el: document.querySelector('.cards')
  });
});
