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
    console.log(subscribes);
    return await strapi.query("training").update({ id }, { users: subscribes });
  },
  find: async (ctx) => {
    const trainings = await strapi.query("training").find();
    return trainings.filter(
      train => {
        return train.users.filter(
          u => u.id === ctx.state.user.id
        ).length === 0
      }
    );
  },
};
