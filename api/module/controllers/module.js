'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  indexByTraining: async (ctx) => {
    const { id } = ctx.params;
    return await strapi.query("module")
      .find({ trainings: id });
  }
};
