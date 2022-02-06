'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  completeStep: async (ctx) => {
    const { id } = ctx.params;
    const step = await strapi.query("feedback")
      .findOne({ id });
    let users = step.users_completed || []
    users.push(ctx.state.user)
    return await strapi.query("feedback")
     .update({ id }, { users_completed: users });
  }
};
