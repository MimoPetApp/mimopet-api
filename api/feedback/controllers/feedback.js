'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

var getStepStatus = (pets_completed = [], pet_selected_id = 0) => {
  return pets_completed.filter(p => p.id === pet_selected_id).length !== 0;
}

module.exports = {
  completeStep: async (ctx) => {
    const { id } = ctx.params;
    const step = await strapi.query("feedback")
      .findOne({ id });
    let petss = step.pets_completed || []
    petss.push(ctx.state.user.current_pet)
    return await strapi.query("feedback")
     .update({ id }, { pets_completed: petss });
  },
  
  find: async (ctx) => {
    let entities = await strapi.query("feedback").find();

    return entities.map(entity => {
      entity.completed = getStepStatus(entity.pets_completed, ctx.state.user.current_pet);
      delete entity.pets_completed;
      return sanitizeEntity(entity, {
        model: strapi.models.feedback,
      });
    });
  },

  findOne: async (ctx) => {
    const { id } = ctx.params;

    const entity = await strapi.query("feedback").findOne({ id });
    entity.completed = getStepStatus(entity.pets_completed, ctx.state.user.current_pet);
    delete entity.pets_completed;
    return sanitizeEntity(entity, { model: strapi.models.feedback });
  }
};
