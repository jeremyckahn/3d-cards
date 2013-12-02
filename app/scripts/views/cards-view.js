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
  var LAYER_DEPTH = 100;

  var CardsView = Backbone.View.extend({
    template: JST['app/scripts/templates/cards-tmpl.ejs']

    ,initialize: function () {
      this._card$els = {};
      this._sampledCardWidth = null;
      this._sampledCardHeight = null;

      _.range(LAYERS).forEach(_.bind(this.buildLayer, this));
      console.log(this._sampledCardWidth, this._sampledCardHeight);
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

      if (this._sampledCardWidth === null) {
        this.measureAndStoreCardDimensions($card);
      }

      var transformX = (x * this._sampledCardWidth) + 'px';
      var transformY = (y * this._sampledCardHeight) + 'px';
      var transformZ = (z * -LAYER_DEPTH) + 'px';
      $card.css('transform',
          'translate3d(' + transformX + ', ' + transformY + ', ' + transformZ +
          ')');
      $card.attr('data-layer', z);

      this._card$els[z][y][x] = $card;
      this.$el.append($card);
    }

    /**
     * @param {jQuery} $card
     */
    ,measureAndStoreCardDimensions: function ($card) {
      this.$el.append($card);
      this._sampledCardWidth = $card.outerWidth(true);
      this._sampledCardHeight = $card.outerHeight(true);
      $card.remove();
    }
  });

  return CardsView;
});
