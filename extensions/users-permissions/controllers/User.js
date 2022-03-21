'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

module.exports = {
  async verifyUser(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    const resetCode = `${1234}`;

    strapi.config.functions['notification'].sendEmail(
      'noreply@mimopetapp.com',
      user.email,
      'Welcome 2',
      `Seu código de reset é : ${resetCode}`
    );
    ctx.body = sanitizeUser(user);
  },
  async confirmVerifyUser(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    // Confirm user

    ctx.body = sanitizeUser(user);
  },
  async resetPassword(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    // send email with code

    ctx.body = sanitizeUser(user);
  },
  async confirmResetPassword(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    // Confirm user

    ctx.body = sanitizeUser(user);
  },
};
