import Joi from 'joi';
import { ROLES } from '../../../config/constants';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid(...Object.values(ROLES)).required(),
  // Company fields
  companyName: Joi.when('role', {
    is: ROLES.COMPANY,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  cif: Joi.when('role', {
    is: ROLES.COMPANY,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  sector: Joi.when('role', {
    is: ROLES.COMPANY,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  // Employee fields
  firstName: Joi.when('role', {
    is: ROLES.EMPLOYEE,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  lastName: Joi.when('role', {
    is: ROLES.EMPLOYEE,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  community: Joi.when('role', {
    is: ROLES.EMPLOYEE,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});