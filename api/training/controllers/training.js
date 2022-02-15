'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  indexByUser: async (ctx) => {
    const entities = await strapi.query("training").find({
      pets_completed: ctx.state.user.current_pet
    });    
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      entity = await strapi.config.functions['mixin'].getTrainingStatus(
        entity,
        ctx.state.user
      );
      delete entity.pets_completed;
      entity = sanitizeEntity(entity, { model: strapi.models.training });
    }
    return entities;
  },
  subscribe: async (ctx) => {
    const { id } = ctx.params;
    let entity = await strapi.query("training").findOne({ id });
    return await strapi.query("training")
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
  unsubscribe: async (ctx) => {
    const { id } = ctx.params;
    let entity = await strapi.query("training").findOne({ id });
    let subscribes = entity.pets_completed.filter(
      p => { return p.id != ctx.state.user.current_pet; }
    );
    return await strapi.query("training").update(
      { id },
      { pets_completed: subscribes }
    );
  },
  find: async (ctx) => {
    var trainings = await strapi.query("training").find();
    trainings = trainings.filter(
      train => {
        return train.pets_completed.filter(
          u => u.id === ctx.state.user.current_pet
        ).length === 0
      }
    );
    return trainings.map(
      train => {
        delete train.pets_completed;
        delete train.modules;
        return sanitizeEntity(train, { model: strapi.models.training });
      }
    );
  },
};
