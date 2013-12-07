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

  var LAYER_DEPTH = 500;

  var CardsView = Backbone.View.extend({
    events: {
      'click .card': 'onClickCard'
    }

    ,initialize: function () {
      // TODO: For debugging.  Remove this.
      window.cardView = this;

      this._totalCards = 0;
      this._sampledCardWidth = null;
      this._sampledCardHeight = null;
      this._zFadeDistance = LAYER_DEPTH * (this.$el.children().length * 0.5);

      this.initCards();
      this.zoom(0);

      $(window).on('mousewheel', _.bind(this.onWindowMouseWheel, this));
    }

    ,initCards: function () {
      this.$el.children().each(_.bind(function (i, el) {
        this.initCard($(el));
      }, this));
    }

    /**
     * @param {jQuery} $card
     */
    ,initCard: function ($card) {
      if (this._sampledCardWidth === null) {
        this.measureAndStoreCardDimensions($card);
      }

      var totalCards = this._totalCards;
      var quadrant = totalCards % 4;
      var transformX =
          (quadrant === 0 || quadrant === 2) ? -100 : 100;
      var transformY = (quadrant < 2) ? -100 : 100;
      var transformZ = totalCards * -LAYER_DEPTH;
      this.applyTransform3d(
          $card, transformX + '%', transformY + '%', transformZ + 'px');
      $card.attr({
        'data-x': transformX
        ,'data-y': transformY
        ,'data-z': transformZ
      });

      this._totalCards++;
    }

    /**
     * @param {jQuery} $card
     */
    ,focusCard: function ($card) {
      $card.data('isFocused', true);
      $card.css('opacity', 1);
      this.applyTransform3d($card, 0, 0, 0);
    }

    /**
     * @param {jQuery} $card
     */
    ,blurCard: function ($card) {
      $card.data('isFocused', false);
      this.zoom(0);
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
        opacity = 1 + (z / this._zFadeDistance);
      } else {
        var boundedOpacity = Math.min(1, (z / this._zFadeDistance));
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
      var doubledThreshold = this._zFadeDistance * 2;
      if (unboundedZ > this._zFadeDistance) {
        return unboundedZ - doubledThreshold;
      } else if (unboundedZ < -this._zFadeDistance) {
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

    /**
     * @param {jQuery.Event} evt
     */
    ,onClickCard: function (evt) {
      var $card = $(evt.currentTarget);

      if ($card.data('isFocused')) {
        this.blurCard($card);
      } else {
        this.focusCard($card);
      }
    }
  });

  return CardsView;
});
