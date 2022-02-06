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
    const step = await strapi.query("exercise")
      .findOne({ id });
    let pets = step.pets_completed || []
    pets.push(ctx.state.user.current_pet)
    return await strapi.query("exercise")
     .update({ id }, { pets_completed: pets });
  },
  
  find: async (ctx) => {
    let entities = await strapi.query("exercise").find();

    return entities.map(entity => {
      entity.completed = getStepStatus(entity.pets_completed, ctx.state.user.current_pet);
      delete entity.pets_completed;
      return sanitizeEntity(entity, {
        model: strapi.models.exercise,
      });
    });
  },

  findOne: async (ctx) => {
    const { id } = ctx.params;

    const entity = await strapi.query("exercise").findOne({ id });
    entity.completed = getStepStatus(entity.pets_completed, ctx.state.user.current_pet);
    delete entity.pets_completed;
    return sanitizeEntity(entity, { model: strapi.models.exercise });
  }
};
