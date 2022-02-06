'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

 const { sanitizeEntity } = require('strapi-utils');

var getStepStatus = (step, user) => {
  return (step.users_completed || []).filter(u => u.id === user.id).length !== 0;
}

module.exports = {
  completeStep: async (ctx) => {
    const { id } = ctx.params;
    const step = await strapi.query("slide")
      .findOne({ id });
    let users = step.users_completed || []
    users.push(ctx.state.user)
    return await strapi.query("slide")
     .update({ id }, { users_completed: users });
  },
  
  find: async (ctx) => {
    let entities = await strapi.query("slide").find();

    return entities.map(entity => {
      entity.completed = getStepStatus(entity, ctx.state.user);
      delete entity.users_completed;
      return sanitizeEntity(entity, {
        model: strapi.models.slide,
      });
    });
  },

  findOne: async (ctx) => {
    const { id } = ctx.params;

    const entity = await strapi.query("slide").findOne({ id });
    entity.completed = getStepStatus(entity, ctx.state.user);
    delete entity.users_completed;
    return sanitizeEntity(entity, { model: strapi.models.slide });
  }
};
