'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  findByPet: async (ctx) => {
    const { id } = ctx.params;
    const timeline = await strapi.query("pet-timeline").findOne({ pet: id });
    return sanitizeEntity(timeline, { model: strapi.models["pet-timeline"] });
  }
};
