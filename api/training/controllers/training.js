'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  indexByUser: async (ctx) => {
    return await strapi.query("training")
      .find({ users: ctx.state.user.id });
  },
  subscribe: async (ctx) => {
    const { id } = ctx.params;
    let train = await strapi.query("training")
      .findOne({ id });    
    var subscribes = train.users || []
    subscribes.push(ctx.state.user)
    return await strapi.query("training")
     .update({ id }, { users: subscribes });
  }
};
