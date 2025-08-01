import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Typography from './Typography';

type TypographyVariant =
  | 'title1Bold'
  | 'title1Regular'
  | 'title2Bold'
  | 'title2Regular'
  | 'subtitle1Bold'
  | 'subtitle1Regular'
  | 'body1Bold'
  | 'body1Regular'
  | 'body2Bold'
  | 'body2Regular'
  | 'label1Bold'
  | 'label1Regular'
  | 'label2Bold'
  | 'label2Regular';

describe('Typography', () => {
  it('should render children correctly', () => {
    render(<Typography variant="body1Regular">Test content</Typography>);

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render with different variants', () => {
    const { rerender } = render(
      <Typography variant="title1Bold">Title Text</Typography>
    );

    expect(screen.getByText('Title Text')).toBeInTheDocument();

    rerender(<Typography variant="body2Regular">Body Text</Typography>);

    expect(screen.getByText('Body Text')).toBeInTheDocument();
  });

  it('should render with custom color', () => {
    render(
      <Typography variant="body1Regular" color="#ff0000">
        Red Text
      </Typography>
    );

    const element = screen.getByText('Red Text');
    expect(element).toHaveStyle('color: rgb(255, 0, 0)');
  });

  it('should render with different text alignment', () => {
    const { rerender } = render(
      <Typography variant="body1Regular" align="center">
        Centered Text
      </Typography>
    );

    expect(screen.getByText('Centered Text')).toHaveStyle('text-align: center');

    rerender(
      <Typography variant="body1Regular" align="right">
        Right Aligned Text
      </Typography>
    );

    expect(screen.getByText('Right Aligned Text')).toHaveStyle(
      'text-align: right'
    );
  });

  it('should render with custom HTML element', () => {
    render(
      <Typography variant="title1Bold" as="h1">
        Heading Text
      </Typography>
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading Text');
  });

  it('should apply custom className', () => {
    render(
      <Typography variant="body1Regular" className="custom-class">
        Custom Class Text
      </Typography>
    );

    expect(screen.getByText('Custom Class Text')).toHaveClass('custom-class');
  });

  it('should render with all typography variants', () => {
    const variants = [
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

    variants.forEach(variant => {
      const { unmount } = render(
        <Typography variant={variant as TypographyVariant}>
          {variant} Text
        </Typography>
      );

      expect(screen.getByText(`${variant} Text`)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render complex content', () => {
    render(
      <Typography variant="body1Regular">
        <span>Complex</span> content with <strong>bold</strong> and{' '}
        <em>italic</em> text
      </Typography>
    );

    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('bold')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
  });

  it('should have default text color when no color is provided', () => {
    render(<Typography variant="body1Regular">Default Color Text</Typography>);

    const element = screen.getByText('Default Color Text');
    expect(element).toHaveStyle('color: rgb(42, 48, 56)');
  });

  it('should have left alignment by default', () => {
    render(
      <Typography variant="body1Regular">Default Alignment Text</Typography>
    );

    expect(screen.getByText('Default Alignment Text')).toHaveStyle(
      'text-align: left'
    );
  });
});
