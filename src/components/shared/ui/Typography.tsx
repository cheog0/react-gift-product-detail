import React from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

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

interface TypographyProps {
  variant: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

const getTypographyStyles = (variant: TypographyVariant) => {
  const typography = theme.typography[variant];
  return {
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
  };
};

const StyledTypography = styled.div<{
  styles: { fontSize: string; fontWeight: number; lineHeight: string };
  color: string;
  align: string;
}>`
  font-size: ${props => props.styles.fontSize};
  font-weight: ${props => props.styles.fontWeight};
  line-height: ${props => props.styles.lineHeight};
  color: ${props => props.color};
  text-align: ${props => props.align};
  margin: 0;
`;

const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className,
  as = 'div',
  color,
  align = 'left',
}) => {
  const styles = getTypographyStyles(variant);
  const finalColor = color || theme.colors.textDefault;

  return (
    <StyledTypography
      as={as}
      className={className}
      styles={styles}
      color={finalColor}
      align={align}
    >
      {children}
    </StyledTypography>
  );
};

export default Typography;
