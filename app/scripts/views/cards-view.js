/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'templates'
], function ($, _, Backbone, JST) {
  'use strict';

  var CardsView = Backbone.View.extend({
    template: JST['app/scripts/templates/cards-tmpl.ejs']

    ,initialize: function () {
    }
  });

  return CardsView;
});
