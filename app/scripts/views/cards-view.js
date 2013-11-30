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

  var ROWS = 4;
  var COLUMNS = 4;
  var LAYERS = 4;
  var ZOOM_PIXELS = 100;

  var CardsView = Backbone.View.extend({
    template: JST['app/scripts/templates/cards-tmpl.ejs']

    ,initialize: function () {
      this._card$els = {};
      this._$layers = $(document.createElement('div'));
      this._$layers.addClass('card-layers');
      _.range(LAYERS).forEach(_.bind(this.buildLayer, this));
      this.$el.append(this._$layers);
    }

    ,buildLayer: function (z) {
      var $layer = $(document.createElement('div'));
      $layer.addClass('card-layer');
      $layer.css('transform', 'translateZ(' + -(z * ZOOM_PIXELS) + 'px)');
      this._card$els[z] = {};
      this._$layers.append($layer);

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
      this._$layers.children().eq(z).append($card);
    }
  });

  return CardsView;
});
