'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  findByPet: async (ctx) => {
    const { id } = ctx.params;
    var timeline = await strapi.query("pet-timeline").findOne({ pet: id });
    timeline.items = timeline.items.sort(function(a, b) {
      const cond = new Date(a.data) > new Date(b.data);
      if (cond) {
        return -1;
      } else {
        return 1;
      }
    });
    return sanitizeEntity(timeline, { model: strapi.models["pet-timeline"] });
  }
};
