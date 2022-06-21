"use strict";

module.exports = {
  getStepStatus: async (model = "slide", step_id = 0, current_pet = 0) => {
    const stepDetails = await strapi.query(model).findOne({ id: step_id });
    return (
      stepDetails.pets_completed.filter((p) => p.id === current_pet).length !==
      0
    );
  },
  setModuleCompleted: async (module, user) => {
    var module_completed = true;
    var steps_completed = 0;
    var module_payload = module;
    for (let i = 0; i < module.steps.length; i++) {
      let step = module.steps[i];
      step.completed = false;
      // Calculo se step foi completo
      if (step.slide) {
        step.completed = await strapi.config.functions["mixin"].getStepStatus(
          "slide",
          step.slide.id,
          user.current_pet
        );
      } else if (step.video) {
        step.completed = await strapi.config.functions["mixin"].getStepStatus(
          "video",
          step.video.id,
          user.current_pet
        );
      } else if (step.exercise) {
        step.completed = await strapi.config.functions["mixin"].getStepStatus(
          "exercise",
          step.exercise.id,
          user.current_pet
        );
      } else if (step.question) {
        step.completed = await strapi.config.functions["mixin"].getStepStatus(
          "question",
          step.question.id,
          user.current_pet
        );
      }
      // Calculo step é bloqueado
      step.locked = await strapi.config.functions["mixin"].getLocked(
        module.steps,
        i,
        user.is_premium
      );
      module_completed = module_completed && step.completed;
      steps_completed += step.completed ? 1 : 0;
    }
    module_payload.completed = module_completed;
    if (module.steps.length > 0) {
      module_payload.progress = (steps_completed / module.steps.length) * 100;
    } else {
      module_payload.progress = 0;
    }
    return module_payload;
  },
  setTrainingCompleted: async (training, user) => {
    let shoudAddOnTimeline = true;
    const timeline = await strapi
      .query("pet-timeline")
      .findOne({ pet: user.current_pet });
    if (timeline) {
      const items = timeline.items.filter((val) => {
        return (
          val.type == "training" &&
          val.status == "done" &&
          val.reference_id == training.id
        );
      });
      if (items.length > 0) {
        shoudAddOnTimeline = false;
      }
    }
    if (shoudAddOnTimeline) {
      await strapi.config.functions["mixin"].updatePetTimeline(
        user.current_pet,
        {
          __component: "utils.timeline-item",
          data: new Date(),
          label: training.title,
          details: "subscribe",
          type: "training",
          status: "done",
          reference_id: training.id,
        }
      );
    }
  },
  getLocked: async (items, index, is_premium) => {
    if (index != 0 && !is_premium) {
      return !items[index - 1].completed;
    }
    return false;
  },
  getTrainingStatus: async (training, user) => {
    var training_completed = true;
    var modules_completed = 0;
    for (let i = 0; i < training.modules.length; i++) {
      training.modules[i] = await strapi.config.functions[
        "mixin"
      ].setModuleCompleted(training.modules[i], user);
      training_completed = training_completed && training.modules[i].completed;
      modules_completed += training.modules[i].completed ? 1 : 0;
    }
    training.completed = training_completed;
    if (training.modules.length > 0) {
      training.progress = (modules_completed / training.modules.length) * 100;
    } else {
      training.progress = 0;
    }
    if (training.completed) {
      await strapi.config.functions["mixin"].setTrainingCompleted(
        training,
        user
      );
    }
    return training;
  },
  updatePetTimeline: async (pet, event) => {
    const timeline = await strapi.query("pet-timeline").findOne({ pet: pet });
    await strapi.query("pet-timeline").update(
      { id: timeline.id },
      {
        items: [...timeline.items, event],
      }
    );
  },
};
