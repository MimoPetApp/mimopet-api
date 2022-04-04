'use strict';


module.exports = {
  getStepStatus: async (model = "slide", step_id = 0, current_pet = 0) => {
    const stepDetails = await strapi.query(model).findOne({ id: step_id });
    return stepDetails.pets_completed.filter(p => p.id === current_pet).length !== 0;
  },
  setModuleCompleted: async (module, user) => {
    var module_completed = true;
    var module_payload = module;
    for (let i = 0; i < module.steps.length; i++) {
      let step = module.steps[i];    
      step.completed = false;  
      // Calculo step é completo
      if (step.slide) {
        step.completed = await strapi.config.functions['mixin'].getStepStatus(
          "slide",
          step.slide.id,
          user.current_pet
        );
      }
      else if (step.video) {
        step.completed = await strapi.config.functions['mixin'].getStepStatus(
          "video",
          step.video.id,
          user.current_pet
        );
      }
      else if (step.exercise) {
        step.completed = await strapi.config.functions['mixin'].getStepStatus(
          "exercise",
          step.exercise.id,
          user.current_pet
        );
      }
      else if (step.question) {
        step.completed = await strapi.config.functions['mixin'].getStepStatus(
          "question",
          step.question.id,
          user.current_pet
        );
      }
      // Calculo step é bloqueado
      step.locked = await strapi.config.functions['mixin'].getLocked(
        module.steps,
        i,
        user.is_premium
      );
      module_completed = module_completed && step.completed;
    }
    module_payload.completed = module_completed;
    return module_payload;
  },
  setTrainingCompleted: async (training, user) => {
    let shoudAddOnTimeline = true;
    const timeline = await strapi.query("pet-timeline").findOne({ pet: user.current_pet });
    if (timeline) {
      const items = timeline.items.filter(
        (val) => {
          return (
            val.type == "training" &&
            val.status == "done" &&
            val.reference_id == training.id
          )
        }
      );
      if (items.length > 0) {
        shoudAddOnTimeline = false
      }
    }
    if (shoudAddOnTimeline) {
      await strapi.config.functions['mixin'].updatePetTimeline(
        user.current_pet,
        {
          __component: 'utils.timeline-item',
          data: new Date(),
          label: training.title,
          details: "subscribe",
          type: "training",
          status: "done",
          reference_id: training.id
        }
      );
    }
  },
  getLocked: async (items, index, is_premium) => {
    if (index != 0 && !is_premium) {
      return !items[index - 1].completed
    }
    return false;
  },
  getTrainingStatus: async (training, user) => {
    var training_completed = true;
    for (let i = 0; i < training.modules.length; i++) {
      training.modules[i] = await strapi.config.functions['mixin'].setModuleCompleted(
        training.modules[i],
        user
      );
      training_completed = training_completed && training.modules[i].completed;
    }
    training.completed = training_completed;
    if (training.completed) {
      await strapi.config.functions['mixin'].setTrainingCompleted(
        training,
        user
      );
    }
    return training;
  },
  updatePetTimeline: async (pet, event) => {
    const timeline = await strapi.query("pet-timeline").findOne({ pet: pet });  
    await strapi
      .query("pet-timeline")
      .update(
        { id: timeline.id },
        {
          items: [
            ...timeline.items,
            event
          ]
        }
      );
  }
};
