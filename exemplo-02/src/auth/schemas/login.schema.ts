import * as Joi from 'joi';
import { LoginDto } from '../dtos/auth.dto';

export const LoginSchema = Joi.object<LoginDto>({
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Username deve ter no mínimo 3 caracteres',
    'string.max': 'Username deve ter no máximo 30 caracteres',
    'any.required': 'Username é obrigatório',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.min': 'Password deve ter no mínimo 6 caracteres',
    'string.max': 'Password deve ter no máximo 100 caracteres',
    'any.required': 'Password é obrigatório',
  }),
});
