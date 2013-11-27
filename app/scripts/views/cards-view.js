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

  var CardsView = Backbone.View.extend({
    template: JST['app/scripts/templates/cards-tmpl.ejs']

    ,initialize: function () {
      this._card$els = {};
      _.range(LAYERS).forEach(_.bind(this.buildLayer, this));
    }

    ,buildLayer: function (z) {
      var $layer = $(document.createElement('div'));
      this._card$els[z] = {};
      this.$el.append($layer);

      _.range(COLUMNS).forEach(_.bind(this.buildColumn, this, z));
    }

    ,buildColumn: function (z, y) {
      this._card$els[z][y] = {};

      _.range(ROWS).forEach(_.bind(this.buildRow, this, z, y));
    }

    ,buildRow: function (z, y, x) {
      var $card = $(document.createElement('div'));
      this._card$els[z][y][x] = $card;
      this.$el.children().eq(z).append($card);
    }
  });

  return CardsView;
});
