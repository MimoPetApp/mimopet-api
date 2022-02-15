module.exports = async (ctx, next) => {  
  if (ctx.state.user.current_pet) {
    return await next();
  }
  
  ctx.response.status = 404;
  ctx.response.message = "Usuário precisa ter um pet selecionado";
  return ctx.response;
};