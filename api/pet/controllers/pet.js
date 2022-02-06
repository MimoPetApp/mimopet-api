"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

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
    return sanitizeEntity(newPet, {
      model: strapi.models.pet,
    });
  },
  select: async (ctx) => {
    console.log("oi")
    const { id } = ctx.params;
    const pet = await strapi.query("pet")
      .findOne({ id });
    
    await strapi
     .query("user", "users-permissions")
     .update({ id: ctx.state.user.id }, { current_pet: pet });
    return sanitizeEntity(pet, {
      model: strapi.models.pet,
    });
  }
};
