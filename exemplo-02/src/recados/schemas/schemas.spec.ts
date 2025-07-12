import { RecadoCreateSchema } from './recadoCreate.schema';
import { RecadoUpdateSchema } from './recadoUpdate.schema';
import { RecadoUpdateFullSchema } from './recadoUpdateFull.schema';

describe('Joi Schemas', () => {
  describe('RecadoCreateSchema', () => {
    it('should validate valid create data', () => {
      const validData = {
        texto: 'Mensagem de teste',
        de: 'João',
        para: 'Maria',
      };

      const { error, value } = RecadoCreateSchema.validate(validData);

      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });

    it('should reject data with missing required fields', () => {
      const invalidData = {
        texto: 'Mensagem de teste',
        // missing 'de' and 'para'
      };

      const { error } = RecadoCreateSchema.validate(invalidData, { abortEarly: false });

      expect(error).toBeDefined();
      expect(error?.details).toHaveLength(2);
    });

    it('should reject data with empty strings', () => {
      const invalidData = {
        texto: '',
        de: '',
        para: '',
      };

      const { error } = RecadoCreateSchema.validate(invalidData);

      expect(error).toBeDefined();
    });

    it('should reject data with strings too short', () => {
      const invalidData = {
        texto: 'a',
        de: 'b',
        para: 'c',
      };

      const { error } = RecadoCreateSchema.validate(invalidData, { abortEarly: false });

      expect(error).toBeDefined();
      expect(error?.details).toHaveLength(3);
    });

    it('should reject data with strings too long', () => {
      const invalidData = {
        texto: 'a'.repeat(251),
        de: 'b'.repeat(51),
        para: 'c'.repeat(51),
      };

      const { error } = RecadoCreateSchema.validate(invalidData, { abortEarly: false });

      expect(error).toBeDefined();
      expect(error?.details).toHaveLength(3);
    });

    it('should accept data with maximum allowed length', () => {
      const validData = {
        texto: 'a'.repeat(250),
        de: 'b'.repeat(50),
        para: 'c'.repeat(50),
      };

      const { error } = RecadoCreateSchema.validate(validData);

      expect(error).toBeUndefined();
    });

    it('should accept data with minimum allowed length', () => {
      const validData = {
        texto: 'ab',
        de: 'cd',
        para: 'ef',
      };

      const { error } = RecadoCreateSchema.validate(validData);

      expect(error).toBeUndefined();
    });
  });

  describe('RecadoUpdateSchema', () => {
    it('should validate partial update data', () => {
      const validData = {
        texto: 'Mensagem atualizada',
      };

      const { error, value } = RecadoUpdateSchema.validate(validData);

      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });

    it('should allow updating only one field', () => {
      const updateTexto = { texto: 'Novo texto' };
      const updateDe = { de: 'Novo remetente' };
      const updatePara = { para: 'Novo destinatário' };

      expect(RecadoUpdateSchema.validate(updateTexto).error).toBeUndefined();
      expect(RecadoUpdateSchema.validate(updateDe).error).toBeUndefined();
      expect(RecadoUpdateSchema.validate(updatePara).error).toBeUndefined();
    });

    it('should allow updating all fields', () => {
      const validData = {
        texto: 'Mensagem completamente nova',
        de: 'Novo João',
        para: 'Nova Maria',
      };

      const { error } = RecadoUpdateSchema.validate(validData);

      expect(error).toBeUndefined();
    });

    it('should allow empty object (all fields are optional)', () => {
      const emptyData = {};

      const { error } = RecadoUpdateSchema.validate(emptyData);

      expect(error).toBeUndefined();
    });

    it('should respect field length constraints', () => {
      const tooShort = { texto: 'a' };
      const tooLong = { texto: 'a'.repeat(251) };

      expect(RecadoUpdateSchema.validate(tooShort).error).toBeDefined();
      expect(RecadoUpdateSchema.validate(tooLong).error).toBeDefined();
    });
  });

  describe('RecadoUpdateFullSchema', () => {
    it('should validate complete update data', () => {
      const validData = {
        texto: 'Mensagem completa atualizada',
        de: 'João Atualizado',
        para: 'Maria Atualizada',
      };

      const { error, value } = RecadoUpdateFullSchema.validate(validData);

      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });

    it('should require all fields', () => {
      const incompleteData = {
        texto: 'Mensagem completa',
        de: 'João',
        // missing 'para'
      };

      const { error } = RecadoUpdateFullSchema.validate(incompleteData);

      expect(error).toBeDefined();
      expect(error?.details).toHaveLength(1);
    });

    it('should reject empty fields', () => {
      const invalidData = {
        texto: '',
        de: 'João',
        para: 'Maria',
      };

      const { error } = RecadoUpdateFullSchema.validate(invalidData);

      expect(error).toBeDefined();
    });

    it('should respect all field length constraints', () => {
      const invalidData = {
        texto: 'a',
        de: 'b',
        para: 'c',
      };

      const { error } = RecadoUpdateFullSchema.validate(invalidData, { abortEarly: false });

      expect(error).toBeDefined();
      expect(error?.details).toHaveLength(3);
    });
  });
});
