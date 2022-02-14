'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {  
  create: async (ctx) => {
    return await strapi
      .query("step-user")
      .create({ ...ctx.request.body, user: ctx.state.user.id });
  },

  update: async (ctx) => {
    const { id } = ctx.params;
    return await strapi
      .query("step-user")
      .update({ id }, ctx.request.body);
  },
  
  find: async (ctx) => {
    return await strapi.query("step-user").find({ user: ctx.state.user.id });
  },
};
