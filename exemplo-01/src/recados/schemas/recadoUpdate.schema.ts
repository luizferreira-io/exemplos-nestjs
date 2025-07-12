import * as Joi from 'joi';
import { RecadoUpdateDto } from '../dtos/recadoUpdate.dto';

export const RecadoUpdateSchema = Joi.object<RecadoUpdateDto>({
  de: Joi.string().min(2).max(50).optional(),
  para: Joi.string().min(2).max(50).optional(),
  texto: Joi.string().min(2).max(250).optional(),
});
