"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  completeGuideline: async (ctx) => {
    const { idObedience, idExercise, guideline } = ctx.params;
    const guidelineOptions = [
      strapi.config.functions["enum"].OBEDIENCE.GUIDELINE.INSTRUCTION,
      strapi.config.functions["enum"].OBEDIENCE.GUIDELINE.GENERALIZATION,
      strapi.config.functions["enum"].OBEDIENCE.GUIDELINE.CHALLENGE,
    ];
    if (!guidelineOptions.includes(guideline)) {
      ctx.response.status = 400;
      ctx.response.message = `Campo 'guideline' precisa está entre os valores [${guidelineOptions.join(
        " | "
      )}]`;
      return ctx.response;
    }
    const obedience = await strapi
      .query("obedience-training")
      .findOne({ id: idObedience });
    const exercise = await strapi.query("exercise").findOne({ id: idExercise });
    const body = ctx.request.body || {};

    var obedience_data = obedience.data || [];
    obedience_data = [
      ...obedience_data,
      {
        guideline: guideline,
        user: ctx.state.user.email,
        pet: ctx.state.user.current_pet,
        exercise: {
          id: exercise.id,
          name: exercise.name,
        },
        created_at: new Date(),
        updated_at: new Date(),
        data: body,
      },
    ];
    const entity = await strapi.query("obedience-training").update(
      {
        id: idObedience,
      },
      {
        data: obedience_data,
      }
    );
    return sanitizeEntity(entity, {
      model: strapi.models["obedience-training"],
    });
  },

  find: async (ctx) => {
    let entities = await strapi.query("obedience-training").find();

    return entities.map((entity) => {
      const { total, instructionCount, generalizationCount, challengeCount } =
        strapi.config.functions["obedience"].countExecutions(
          entity,
          ctx.state.user
        );
      entity.executions = total;
      strapi.config.functions["obedience"].addGuidelinesCount(
        entity.guidelines,
        instructionCount,
        generalizationCount,
        challengeCount
      );
      return sanitizeEntity(entity, {
        model: strapi.models["obedience-training"],
      });
    });
  },

  findOne: async (ctx) => {
    const { id } = ctx.params;
    const entity = await strapi.query("obedience-training").findOne({ id });
    if (!entity) {
      ctx.response.status = 404;
      return ctx.response;
    }

    const counts = strapi.config.functions["obedience"].countExecutions(
      entity,
      ctx.state.user
    );
    entity.executions = counts.total;
    strapi.config.functions["obedience"].addGuidelinesCount(
      entity.guidelines,
      counts.instructions,
      counts.generalization,
      counts.challenge
    );
    return sanitizeEntity(entity, {
      model: strapi.models["obedience-training"],
    });
  },
};
