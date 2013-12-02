/*global define*/

define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'templates'

], function (

  $
  ,_
  ,Backbone
  ,JST

) {

  'use strict';

  var ROWS = 2;
  var COLUMNS = 2;
  var LAYERS = 4;
  var ZOOM_PIXELS = 100;

  var CardsView = Backbone.View.extend({
    template: JST['app/scripts/templates/cards-tmpl.ejs']

    ,initialize: function () {
      this._card$els = {};
      _.range(LAYERS).forEach(_.bind(this.buildLayer, this));
    }

    ,buildLayer: function (z) {
      this._card$els[z] = {};

      _.range(COLUMNS).forEach(_.bind(this.buildColumn, this, z));
    }

    ,buildColumn: function (z, y) {
      this._card$els[z][y] = {};

      _.range(ROWS).forEach(_.bind(this.buildRow, this, z, y));
    }

    ,buildRow: function (z, y, x) {
      var $card = $(document.createElement('div'));
      $card.addClass('card');
      this._card$els[z][y][x] = $card;
      this.$el.append($card);
    }
  });

  return CardsView;
});
