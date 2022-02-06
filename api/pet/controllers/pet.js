"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  find: async (ctx) => {
    return await strapi.query("pet").find({ user: ctx.state.user.id });
  },
  create: async (ctx) => {
    const newPet = await strapi
      .query("pet")
      .create({ ...ctx.request.body, user: ctx.state.user.id });
    await strapi
      .query("user", "users-permissions")
      .update({ id: ctx.state.user.id }, { current_pet: newPet });
    return newPet;
  },
};
