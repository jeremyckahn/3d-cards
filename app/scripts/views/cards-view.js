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

  var ROWS = 1;
  var COLUMNS = 1;
  var LAYERS = 8;
  var LAYER_DEPTH = 500;
  var Z_FADE_DISTANCE = LAYER_DEPTH * (LAYERS * 0.5);

  var CardsView = Backbone.View.extend({
    initialize: function () {
      // TODO: For debugging.  Remove this.
      window.cardView = this;

      this._totalCards = 0;
      this._card$els = {};
      this._sampledCardWidth = null;
      this._sampledCardHeight = null;

      _.range(LAYERS).forEach(_.bind(this.buildLayer, this));
      this.zoom(0);
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

      var totalCards = this._totalCards;
      var quadrant = totalCards % 4;
      var transformX =
          (quadrant === 0 || quadrant === 2) ? -100 : 100;
      var transformY = (quadrant < 2) ? -100 : 100;
      var transformZ = z * -LAYER_DEPTH;
      this.applyTransform3d(
          $card, transformX + '%', transformY + '%', transformZ + 'px');
      $card.attr({
        'data-x': transformX
        ,'data-y': transformY
        ,'data-z': transformZ
      });

      this._card$els[z][y][x] = $card;
      this.$el.append($card);
      this._totalCards++;
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
      $el.css('transform', 'translate3d(' + x + ', ' + y + ', ' + z + ')');
    }

    /**
     * @param {jQuery} $card
     * @param {number} z
     */
    ,applyZFade: function ($card, z) {
      var opacity;
      if (z < 0) {
        opacity = 1 + (z / Z_FADE_DISTANCE);
      } else {
        var boundedOpacity = Math.min(1, (z / Z_FADE_DISTANCE));
        opacity = 1 - boundedOpacity;
      }

      $card.css('opacity', opacity);
    }

    /**
     * @param {number} zoomDelta
     */
    ,zoom: function (zoomDelta) {
      this.$el.hide();

      var $cards = this.$el.children();
      var i = 0, len = $cards.length;
      var $card, x, y, z, newZ;
      for (i; i < len; i++) {
        $card = $cards.eq(i);
        x = +$card.attr('data-x') + '%';
        y = +$card.attr('data-y') + '%';
        z = +$card.attr('data-z');
        newZ = this.cycleZ(z + zoomDelta);
        this.applyTransform3d($card, x, y, newZ + 'px');
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
      var doubledThreshold = Z_FADE_DISTANCE * 2;
      if (unboundedZ > Z_FADE_DISTANCE) {
        return unboundedZ - doubledThreshold;
      } else if (unboundedZ < -Z_FADE_DISTANCE) {
        return unboundedZ + doubledThreshold;
      }

      return unboundedZ;
    }

    /**
     * @param {jQuery.Event} evt
     */
    ,onWindowMouseWheel: function (evt) {
      evt.preventDefault();
      this.zoom(evt.deltaY);
    }
  });

  return CardsView;
});
