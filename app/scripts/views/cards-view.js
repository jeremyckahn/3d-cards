/*global define*/

define([

  'jquery'
  ,'underscore'
  ,'backbone'

], function (

  $
  ,_
  ,Backbone

) {

  'use strict';

  var ROWS = 2;
  var COLUMNS = 2;
  var LAYERS = 4;
  var LAYER_DEPTH = 500;
  var Z_FADE_THRESHOLD = 1000;

  var CardsView = Backbone.View.extend({
    initialize: function () {
      // TODO: For debugging.  Remove this.
      window.cardView = this;

      this._card$els = {};
      this._sampledCardWidth = null;
      this._sampledCardHeight = null;

      _.range(LAYERS).forEach(_.bind(this.buildLayer, this));
      $(window).on('mousewheel', _.bind(this.onWindowMouseWheel, this));
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

      var transformX = x * this._sampledCardWidth;
      var transformY = y * this._sampledCardHeight;
      var transformZ = z * -LAYER_DEPTH;
      this.applyTransform3d($card, transformX, transformY, transformZ);
      $card.attr({
        'data-layer': z
        ,'data-x': transformX
        ,'data-y': transformY
        ,'data-z': transformZ
      });

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

    /**
     * @param {jQuery} $card
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    ,applyTransform3d: function ($el, x, y, z) {
      $el.css('transform',
          'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
    }

    /**
     * @param {jQuery} $card
     * @param {number} z
     */
    ,applyZFade: function ($card, z) {
      var opacity;
      if (z < 0) {
        opacity = 1;
      } else {
        var boundedOpacity =
            Math.min(1, (z / Z_FADE_THRESHOLD));
        opacity = 1 - boundedOpacity;
      }

      $card.css('opacity', opacity);
    }

    /**
     * @param {number} zoomDelta
     */
    ,zoomIn: function (zoomDelta) {
      this.$el.hide();

      var $cards = this.$el.children();
      var i = 0, len = $cards.length;
      var $card, x, y, z, newZ;
      for (i; i < len; i++) {
        $card = $cards.eq(i);
        x = +$card.attr('data-x');
        y = +$card.attr('data-y');
        z = +$card.attr('data-z');
        newZ = this.cycleZ(z + zoomDelta);
        this.applyTransform3d($card, x, y, newZ);
        this.applyZFade($card, newZ);
        $card.attr('data-z', newZ);
      }

      this.$el.show();
    }

    /**
     * @param {number} unboundedZ
     * @return {number}
     */
    ,cycleZ: function (unboundedZ) {
      if (unboundedZ > Z_FADE_THRESHOLD) {
        unboundedZ -= LAYER_DEPTH * (LAYERS);
      }

      return unboundedZ;
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onWindowMouseWheel: function (evt) {
      evt.preventDefault();
      this.zoomIn(evt.deltaY);
    }
  });

  return CardsView;
});
