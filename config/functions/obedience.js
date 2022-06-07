module.exports = {
  countExecutions: (obedience, user) => {
    const data = obedience.data || [];
    const petObedienceData =
      data.filter((d) => {
        return d.pet === user.current_pet;
      }) || [];
    const instructions =
      petObedienceData.filter((d) => {
        return (
          d.guideline ===
          strapi.config.functions["enum"].OBEDIENCE.GUIDELINE.INSTRUCTION
        );
      }) || [];
    const generalization =
      petObedienceData.filter((d) => {
        return (
          d.guideline ===
          strapi.config.functions["enum"].OBEDIENCE.GUIDELINE.GENERALIZATION
        );
      }) || [];
    const challenge =
      petObedienceData.filter((d) => {
        return (
          d.guideline ===
          strapi.config.functions["enum"].OBEDIENCE.GUIDELINE.CHALLENGE
        );
      }) || [];
    return {
      total: instructions.length + generalization.length + challenge.length,
      instructions: instructions.length,
      generalization: generalization.length,
      challenge: challenge.length,
    };
  },
  addGuidelinesCount: (
    guidelines,
    instructionCount = 0,
    generalizationCount = 0,
    challengeCount = 0
  ) => {
    for (const guide of guidelines) {
      switch (guide.__component) {
        default:
        case "guidelines.obedience-instruction":
          guide.executions = instructionCount;
          break;
        case "guidelines.obedience-generalization":
          guide.executions = generalizationCount;
          break;
        case "guidelines.obedience-challenge":
          guide.executions = challengeCount;
          break;
      }
    }
    return guidelines;
  },
};
