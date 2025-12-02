import { BuilderService } from './builder.service';
import { MAIL_SUBJECT, MAIL_TYPE } from './constants/builder.constants';

describe('BuilderService', () => {
  let service: BuilderService;

  beforeEach(() => {
    // mock smtp config
    const mockSmtpConfig = {
      user: 'no-reply@example.com',
      pass: 'password',
      host: 'smtp.example.com',
      port: 465,
    };

    service = new BuilderService(mockSmtpConfig as any);
  });

  describe('build()', () => {
    it('should build a valid FORGOT_PASSWORD email', () => {
      const url = 'https://example.com/reset?token=abc123';
      const result = service.build({ url }, MAIL_TYPE.FORGOT_PASSWORD);

      expect(result.from).toBe('no-reply@example.com');
      expect(result.subject).toBe(MAIL_SUBJECT.FORGOT_PASSWORD);
      expect(result.text).toContain(url);
      expect(result.text).toContain('reset your password');
    });

    it('should throw an error for an unknown mail type', () => {
      expect(() => service.build({}, 'UNKNOWN_TYPE' as MAIL_TYPE)).toThrow(
        'Mail type not found',
      );
    });
  });

  describe('format()', () => {
    it('should replace placeholders with given parameters', () => {
      const template = 'Reset link: {url}';
      const result = (service as any).format(template, {
        url: 'https://test.link',
      });
      expect(result).toBe('Reset link: https://test.link');
    });

    it('should replace multiple placeholders correctly', () => {
      const template = 'Hi {user}, visit {url} now!';
      const result = (service as any).format(template, {
        user: 'Ilya',
        url: 'https://knu.ua',
      });
      expect(result).toBe('Hi Ilya, visit https://knu.ua now!');
    });

    it('should return the original template if parameters are empty', () => {
      const template = 'Text without placeholders';
      const result = (service as any).format(template, {});
      expect(result).toBe(template);
    });
  });
});
