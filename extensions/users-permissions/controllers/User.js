'use strict';
const crypto = require('crypto');
var jwt = require('jsonwebtoken');

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const { sanitizeEntity } = require('strapi-utils');
const { VariableContext } = require("twilio/lib/rest/serverless/v1/service/environment/variable");

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

module.exports = {
  async verifyUser(ctx) {
    const { email } = ctx.request.body;
    var user = await strapi
      .query("user", "users-permissions")
      .findOne({ email });
    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    const confirmationToken = (
      `${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}`
    );
    strapi.config.functions['notification'].sendEmail(
      'noreply@mimopetapp.com',
      user.email,
      'Bem vindo',
      `Seu código de confirmação de conta é: ${confirmationToken}`
    );
    user = await strapi
      .query("user", "users-permissions")
      .update({ id: user.id }, { confirmationToken: confirmationToken, confirmed: false });
    ctx.body = sanitizeUser(user);
  },
  async confirmVerifyUser(ctx) {
    const { email, code } = ctx.request.body;
    var user = await strapi
      .query("user", "users-permissions")
      .findOne({ email });

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    if (code == user.confirmationToken) {
      user = await strapi
      .query("user", "users-permissions")
      .update(
        { id: user.id },
        {
          confirmed: true,
          confirmationToken: "",
          firstAccess: true
        }
      );
    } else {
      ctx.response.status = 403;
      return ctx.badRequest(null, [{ messages: [{ id: 'Invalid code' }] }]);
    }
    ctx.body = sanitizeUser(user);
  },
  async completeFirstAccess(ctx) {
    var user = ctx.state.user;
    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    user = await strapi
      .query("user", "users-permissions")
      .update({ id: user.id }, { firstAccess: false });
    ctx.body = sanitizeUser(user);
  },
  async createResetPasswordCode(ctx) {
    const { email } = ctx.request.body;
    var user = await strapi
      .query("user", "users-permissions")
      .findOne({ email });

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    const resetPasswordToken = (
      `${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}`
    );
    strapi.config.functions['notification'].sendEmail(
      'noreply@mimopetapp.com',
      user.email,
      'Reset de senha',
      `Seu código de reset de senha é: ${resetPasswordToken}`
    );
    user = await strapi
      .query("user", "users-permissions")
      .update(
        { id: user.id },
        {
          verifiedResetPasswordToken: false,
          resetPasswordToken: resetPasswordToken,
        }
      );

    ctx.body = sanitizeUser(user);
  },
  async confirmResetPasswordCode(ctx) {
    const { email, code } = ctx.request.body;
    var user = await strapi
      .query("user", "users-permissions")
      .findOne({ email });

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    if (code == user.resetPasswordToken) {
      user = await strapi
      .query("user", "users-permissions")
      .update(
        { id: user.id },
        {
          verifiedResetPasswordToken: true,
          resetPasswordToken: ""
        }
      );
      const token = jwt.sign(email, process.env.JWT_SECRET);
      ctx.body = {
        token: token
      }
    } else {
      ctx.response.status = 403;
      return ctx.badRequest(null, [{ messages: [{ id: 'Invalid code' }] }]);
    }
  },
  async updatePassword(ctx) {
    const { token, password } = ctx.request.body;
    const email = jwt.verify(token, process.env.JWT_SECRET);
    var user = await strapi
      .query("user", "users-permissions")
      .findOne({ email: email });

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    user = await strapi
      .query("user", "users-permissions")
      .update(
        { id: user.id },
        {
          password: password
        }
      );
    ctx.body = sanitizeUser(user);
  },
};
