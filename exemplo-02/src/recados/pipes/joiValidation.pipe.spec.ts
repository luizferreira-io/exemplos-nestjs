import { BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';
import { JoiValidationPipe } from './joiValidation.pipe';

describe('JoiValidationPipe', () => {
  let pipe: JoiValidationPipe;
  let schema: Joi.ObjectSchema;

  beforeEach(() => {
    schema = Joi.object({
      texto: Joi.string().required(),
      de: Joi.string().required(),
      para: Joi.string().required(),
    });
    pipe = new JoiValidationPipe(schema);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should return the value when validation passes', () => {
      const validValue = {
        texto: 'Mensagem de teste',
        de: 'João',
        para: 'Maria',
      };

      const result = pipe.transform(validValue);

      expect(result).toEqual(validValue);
    });

    it('should throw BadRequestException when validation fails', () => {
      const invalidValue = {
        texto: '',
        de: 'João',
        // missing 'para' field
      };

      expect(() => pipe.transform(invalidValue)).toThrow(BadRequestException);
    });

    it('should include all validation errors in the exception message', () => {
      const invalidValue = {
        // missing all required fields
      };

      try {
        pipe.transform(invalidValue);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain('texto');
        expect(error.message).toContain('de');
        expect(error.message).toContain('para');
      }
    });

    it('should handle single validation error', () => {
      const invalidValue = {
        texto: 'Mensagem válida',
        de: 'João',
        para: '', // empty string should fail validation
      };

      expect(() => pipe.transform(invalidValue)).toThrow(BadRequestException);
    });

    it('should work with different schemas', () => {
      const updateSchema = Joi.object({
        texto: Joi.string().optional(),
        de: Joi.string().optional(),
        para: Joi.string().optional(),
      }).min(1); // at least one field required

      const updatePipe = new JoiValidationPipe(updateSchema);

      const validPartialValue = {
        texto: 'Apenas texto atualizado',
      };

      const result = updatePipe.transform(validPartialValue);
      expect(result).toEqual(validPartialValue);
    });

    it('should reject empty objects when at least one field is required', () => {
      const updateSchema = Joi.object({
        texto: Joi.string().optional(),
        de: Joi.string().optional(),
        para: Joi.string().optional(),
      }).min(1);

      const updatePipe = new JoiValidationPipe(updateSchema);
      const emptyValue = {};

      expect(() => updatePipe.transform(emptyValue)).toThrow(BadRequestException);
    });

    it('should handle complex validation rules', () => {
      const complexSchema = Joi.object({
        texto: Joi.string().min(2).max(250).required(),
        de: Joi.string().min(2).max(50).required(),
        para: Joi.string().min(2).max(50).required(),
      });

      const complexPipe = new JoiValidationPipe(complexSchema);

      const tooShortValue = {
        texto: 'a', // too short
        de: 'João',
        para: 'Maria',
      };

      expect(() => complexPipe.transform(tooShortValue)).toThrow(BadRequestException);

      const tooLongValue = {
        texto: 'a'.repeat(251), // too long
        de: 'João',
        para: 'Maria',
      };

      expect(() => complexPipe.transform(tooLongValue)).toThrow(BadRequestException);
    });
  });
});
