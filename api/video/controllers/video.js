'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  completeStep: async (ctx) => {
    const { id } = ctx.params;
    const step = await strapi.query("video")
      .findOne({ id });
    let users = step.users_completed || []
    users.push(ctx.state.user)
    return await strapi.query("video")
     .update({ id }, { users_completed: users });
  }
};
