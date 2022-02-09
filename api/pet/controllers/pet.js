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
    // Cria pet
    const newPet = await strapi
      .query("pet")
      .create({ ...ctx.request.body, user: ctx.state.user.id });
    // Setta curr pet
    await strapi
      .query("user", "users-permissions")
      .update({ id: ctx.state.user.id }, { current_pet: newPet });
    // Cria timeline    
    await strapi
      .query("pet-timeline")
      .create({
        pet: newPet,
        items: [
          {
            __component: 'utils.timeline-item',
            data: new Date(),
            label: "Pet cadastrado",
            status: "done"
          }
        ]
      });
    // Payload
    return sanitizeEntity(newPet, {
      model: strapi.models.pet,
    });
  },
  async delete(ctx) {
    const { id } = ctx.params;
    // deleta timeline
    const timeline = await strapi.query("pet-timeline").findOne({ pet: id });
    if (timeline)
      await strapi.query("pet-timeline").delete({ id: timeline.id });
    // deleta pet
    const entity = await strapi.query("pet").delete({ id });
    if (id == ctx.state.user.current_pet) {
      const user = await strapi.query("user", "users-permissions").findOne({ id: ctx.state.user.id });
      let current_pet = null
      if (user.pets.length > 0) {
        current_pet = user.pets[0]
      }
      await strapi.query("user", "users-permissions")
        .update({ id: ctx.state.user.id }, { current_pet: current_pet });
    }
    return sanitizeEntity(entity, { model: strapi.models.pet });
  },
  select: async (ctx) => {
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
