'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  completeStep: async (ctx) => {
    const { id } = ctx.params;
    const step = await strapi.query("exercise")
      .findOne({ id });
    let pets = step.pets_completed || []
    pets.push(ctx.state.user.current_pet)
    return await strapi.query("exercise")
     .update({ id }, { pets_completed: pets });
  }
};
