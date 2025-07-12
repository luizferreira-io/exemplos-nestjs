import * as Joi from 'joi';
import { RecadoUpdateFullDto } from '../dtos/recadoUpdateFull.dto';

export const RecadoUpdateFullSchema = Joi.object<RecadoUpdateFullDto>({
  de: Joi.string().min(2).max(50).required(),
  para: Joi.string().min(2).max(50).required(),
  texto: Joi.string().min(2).max(250).required(),
});
