'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  indexByTraining: async (ctx) => {
    const { id } = ctx.params;
    const entities = await strapi.query("module").find({ trainings: id });
    
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      entity = await strapi.config.functions['mixin'].getModuleStatus(entity, ctx.state.user.current_pet);
      delete entity.trainings;
      entity = sanitizeEntity(entity, { model: strapi.models.module });
    }

    return entities;
  },
  
  findOne: async (ctx) => {
    const { id } = ctx.params;
    let entity = await strapi.query("module").findOne({ id });
    entity = await strapi.config.functions['mixin'].getModuleStatus(entity, ctx.state.user.current_pet);
    delete entity.trainings;
    return sanitizeEntity(entity, { model: strapi.models.module });
  }
};
