import * as Joi from 'joi';
import { RecadoCreateDto } from '../dtos/recadoCreate.dto';

export const RecadoCreateSchema = Joi.object<RecadoCreateDto>({
  de: Joi.string().min(2).max(50).required(),
  para: Joi.string().min(2).max(50).required(),
  texto: Joi.string().min(2).max(250).required(),
});
