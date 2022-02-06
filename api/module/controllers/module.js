'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

var getModuleStatus = async (module) => {
  var query = module.steps.map(
    step => {
      let payload = {
        type: step.type
      }
      if (step.slides) payload.step = step.slides.id;
      else if (step.video) payload.step = step.video.id;
      else if (step.quiz) payload.step = step.quiz.id;
      else if (step.exercise) payload.step = step.exercise.id;
      else if (step.feedback) payload.step = step.feedback.id;

      return payload
    }
  );
  
  query = query.reduce((acc, curr) => {
    let {type, step} = curr;
    acc.type = [...(acc.type || [])]
    acc.step = [...(acc.step || [])]
    return {type: [...(acc.type || []), type], step: [...(acc.step || []), step]};
  }, {});

  query.type = Array.from(new Set(query.type));
  query.step = Array.from(new Set(query.step));

  const stepscompleted = await strapi.query("step-user").find(
    { ...query, status_eq: "done" }
  );

  if (stepscompleted.length === 0) return "todo";
  if (stepscompleted.length === module.steps.length) return "done";
  
  return "doing"
};

module.exports = {
  indexByTraining: async (ctx) => {
    const { id } = ctx.params;
    const modules = await strapi.query("module")
      .find({ trainings: id });

    for (let i = 0; i < modules.length; i++)
      modules[i].status = await getModuleStatus(modules[i]);
    return modules;
  }
};
