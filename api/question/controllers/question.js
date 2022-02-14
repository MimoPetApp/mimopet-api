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
    const step = await strapi.query("question").findOne({ id });
    await strapi.config.functions['mixin'].updatePetTimeline(
      ctx.state.user.current_pet,
      {
        __component: 'utils.timeline-item',
        data: new Date(),
        label: step.name,
        details: "question",
        type: "step",
        status: "done"
      }
    );
    return await strapi.query("question")
     .update(
       { id },
       {
        pets_completed: [
          ...step.pets_completed,
          ctx.state.user.current_pet
        ]
       }
      );
  },
  
  find: async (ctx) => {
    let entities = await strapi.query("question").find();

    return entities.map(entity => {
      entity.completed = getStepStatus(entity.pets_completed, ctx.state.user.current_pet);
      delete entity.pets_completed;
      return sanitizeEntity(entity, {
        model: strapi.models.question,
      });
    });
  },

  findOne: async (ctx) => {
    const { id } = ctx.params;

    const entity = await strapi.query("question").findOne({ id });
    entity.completed = getStepStatus(entity.pets_completed, ctx.state.user.current_pet);
    delete entity.pets_completed;
    return sanitizeEntity(entity, { model: strapi.models.question });
  }
};
