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
    const entity = await strapi.query("session").findOne({ id });
    await strapi.config.functions['mixin'].updatePetTimeline(
      ctx.state.user.current_pet,
      {
        __component: 'utils.timeline-item',
        data: new Date(),
        label: entity.name,
        details: "session",
        type: "session",
        status: "done"
      }
    );
    return await strapi.query("session")
     .update(
       { id },
       {
        pets_completed: [
          ...entity.pets_completed,
          ctx.state.user.current_pet
        ]
       }
      );
  },
  
  find: async (ctx) => {
    const entities = await strapi.query("session").find();
    return entities.map(entity => {
      entity.completed = getStepStatus(entity.pets_completed, ctx.state.user.current_pet);
      delete entity.pets_completed;
      return sanitizeEntity(entity, {
        model: strapi.models.session,
      });
    });
  },

  findOne: async (ctx) => {
    const { id } = ctx.params;
    const entity = await strapi.query("session").findOne({ id });
    entity.completed = getStepStatus(entity.pets_completed, ctx.state.user.current_pet);
    delete entity.pets_completed;
    return sanitizeEntity(entity, { model: strapi.models.session });
  }
};
