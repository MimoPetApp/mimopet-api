'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  indexByUser: async (ctx) => {
    const entities = await strapi.query("training").find({ users: ctx.state.user.id });    
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      entity = await strapi.config.functions['mixin'].getTrainingStatus(entity, ctx.state.user.current_pet);
      delete entity.users;
      entity = sanitizeEntity(entity, { model: strapi.models.training });
    }
    return entities;
  },
  subscribe: async (ctx) => {
    const { id } = ctx.params;
    let train = await strapi.query("training").findOne({ id });    
    let subscribes = train.users || [];
    subscribes.push(ctx.state.user);
    return await strapi.query("training").update({ id }, { users: subscribes });
  },
  unsubscribe: async (ctx) => {
    const { id } = ctx.params;
    let train = await strapi.query("training").findOne({ id });
    let subscribes = train.users.filter(
      u => { return u.id != ctx.state.user.id; }
    );
    return await strapi.query("training").update({ id }, { users: subscribes });
  },
  find: async (ctx) => {
    var trainings = await strapi.query("training").find();
    trainings = trainings.filter(
      train => {
        return train.users.filter(
          u => u.id === ctx.state.user.id
        ).length === 0
      }
    );
    return trainings.map(
      train => {
        delete train.users;
        delete train.modules;
        return sanitizeEntity(train, { model: strapi.models.training });
      }
    );
  },
};
