import { describe, it, expect } from 'vitest';
import { theme } from '@/styles/theme';

describe('Typography Theme', () => {
  it('should have all required typography variants', () => {
    const requiredVariants = [
      'title1Bold',
      'title1Regular',
      'title2Bold',
      'title2Regular',
      'subtitle1Bold',
      'subtitle1Regular',
      'body1Bold',
      'body1Regular',
      'body2Bold',
      'body2Regular',
      'label1Bold',
      'label1Regular',
      'label2Bold',
      'label2Regular',
    ];

    requiredVariants.forEach(variant => {
      expect(
        theme.typography[variant as keyof typeof theme.typography]
      ).toBeDefined();
    });
  });

  it('should have correct structure for each typography variant', () => {
    const typographyKeys = Object.keys(theme.typography);

    typographyKeys.forEach(key => {
      const variant = theme.typography[key as keyof typeof theme.typography];

      expect(variant).toHaveProperty('fontSize');
      expect(variant).toHaveProperty('fontWeight');
      expect(variant).toHaveProperty('lineHeight');

      expect(typeof variant.fontSize).toBe('string');
      expect(typeof variant.fontWeight).toBe('number');
      expect(typeof variant.lineHeight).toBe('string');
    });
  });

  it('should have valid font sizes', () => {
    const typographyKeys = Object.keys(theme.typography);

    typographyKeys.forEach(key => {
      const variant = theme.typography[key as keyof typeof theme.typography];

      expect(variant.fontSize).toMatch(/^[\d.]+(px|rem|em|%)$/);
    });
  });

  it('should have valid font weights', () => {
    const typographyKeys = Object.keys(theme.typography);
    const validFontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    typographyKeys.forEach(key => {
      const variant = theme.typography[key as keyof typeof theme.typography];

      expect(validFontWeights).toContain(variant.fontWeight);
    });
  });

  it('should have valid line heights', () => {
    const typographyKeys = Object.keys(theme.typography);

    typographyKeys.forEach(key => {
      const variant = theme.typography[key as keyof typeof theme.typography];

      expect(variant.lineHeight).toMatch(/^[\d.]+(px|rem|em|%)?$/);
    });
  });

  it('should have consistent naming convention', () => {
    const typographyKeys = Object.keys(theme.typography);

    typographyKeys.forEach(key => {
      expect(key).toMatch(/^(title|subtitle|body|label)\d(Bold|Regular)$/);
    });
  });

  it('should have appropriate font sizes for different text levels', () => {
    expect(parseFloat(theme.typography.title1Bold.fontSize)).toBeGreaterThan(
      parseFloat(theme.typography.body1Regular.fontSize)
    );

    expect(parseFloat(theme.typography.title2Bold.fontSize)).toBeGreaterThan(
      parseFloat(theme.typography.body2Regular.fontSize)
    );

    expect(parseFloat(theme.typography.body1Regular.fontSize)).toBeGreaterThan(
      parseFloat(theme.typography.label1Regular.fontSize)
    );
  });

  it('should have appropriate font weights for Bold variants', () => {
    const typographyKeys = Object.keys(theme.typography);

    typographyKeys.forEach(key => {
      if (key.includes('Bold')) {
        const variant = theme.typography[key as keyof typeof theme.typography];
        expect(variant.fontWeight).toBeGreaterThanOrEqual(600);
      }
    });
  });

  it('should have appropriate font weights for Regular variants', () => {
    const typographyKeys = Object.keys(theme.typography);

    typographyKeys.forEach(key => {
      if (key.includes('Regular')) {
        const variant = theme.typography[key as keyof typeof theme.typography];
        expect(variant.fontWeight).toBeLessThanOrEqual(500);
      }
    });
  });
});
