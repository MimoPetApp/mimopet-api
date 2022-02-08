'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

var getStepStatus = async (model = "slide", step_id = 0, pet_selected_id = 0) => {
  const stepDetails = await strapi.query(model).findOne({ id: step_id });
  return stepDetails.pets_completed.filter(p => p.id === pet_selected_id).length !== 0;
}

var getModuleStatus = async (module, pet_selected_id) => {
  var module_completed = true;
  var module_payload = module;
  for (let i = 0; i < module.steps.length; i++) {
    let step = module.steps[i];    
    step.completed = false;

    if (step.slides) step.completed = await getStepStatus("slide", step.slides.id, pet_selected_id);
    else if (step.video) step.completed = await getStepStatus("video", step.video.id, pet_selected_id);
    else if (step.quiz) step.completed = await getStepStatus("quiz", step.quiz.id, pet_selected_id);
    else if (step.exercise) step.completed = await getStepStatus("exercise", step.exercise.id, pet_selected_id);
    else if (step.feedback) step.completed = await getStepStatus("feedback", step.feedback.id, pet_selected_id);
    module_completed = module_completed && step.completed;
  }
  module_payload.completed = module_completed;
  return module_payload;
};

module.exports = {
  indexByTraining: async (ctx) => {
    const { id } = ctx.params;
    const entities = await strapi.query("module").find({ trainings: id });
    
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      entity = await getModuleStatus(entity, ctx.state.user.current_pet);
      delete entity.trainings;
      entity = sanitizeEntity(entity, { model: strapi.models.module });
    }

    return entities;
  },
  
  findOne: async (ctx) => {
    const { id } = ctx.params;
    let entity = await strapi.query("module").findOne({ id });
    entity = await getModuleStatus(entity, ctx.state.user.current_pet);
    delete entity.trainings;
    return sanitizeEntity(entity, { model: strapi.models.module });
  }
};
