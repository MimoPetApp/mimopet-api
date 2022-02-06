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
    let petss = step.pets_completed || []
    petss.push(ctx.state.user.current_pet)
    return await strapi.query("feedback")
     .update({ id }, { pets_completed: petss });
  }
};
