'use strict';


module.exports = {
  getStepStatus: async (model = "slide", step_id = 0, pet_selected_id = 0) => {
    const stepDetails = await strapi.query(model).findOne({ id: step_id });
    return stepDetails.pets_completed.filter(p => p.id === pet_selected_id).length !== 0;
  },
  setModuleCompleted: async (module, pet_selected_id) => {
    var module_completed = true;
    var module_payload = module;
    for (let i = 0; i < module.steps.length; i++) {
      let step = module.steps[i];    
      step.completed = false;
  
      if (step.slides) step.completed = await strapi.config.functions['mixin'].getStepStatus("slide", step.slides.id, pet_selected_id);
      else if (step.video) step.completed = await strapi.config.functions['mixin'].getStepStatus("video", step.video.id, pet_selected_id);
      else if (step.quiz) step.completed = await strapi.config.functions['mixin'].getStepStatus("quiz", step.quiz.id, pet_selected_id);
      else if (step.exercise) step.completed = await strapi.config.functions['mixin'].getStepStatus("exercise", step.exercise.id, pet_selected_id);
      else if (step.feedback) step.completed = await strapi.config.functions['mixin'].getStepStatus("feedback", step.feedback.id, pet_selected_id);
      module_completed = module_completed && step.completed;
    }
    module_payload.completed = module_completed;
    return module_payload;
  },
  setModuleLocked: async (module, is_locked) => {
    module.locked = is_locked;
    return module;
  },
  getTrainingStatus: async (training, pet_selected_id) => {
    var training_completed = true;
    for (let i = 0; i < training.modules.length; i++) {
      training.modules[i] = await strapi.config.functions['mixin'].setModuleCompleted(training.modules[i], pet_selected_id);
      training_completed = training_completed && training.modules[i].completed;
    }
    training.completed = training_completed;
    return training;
  }
};
