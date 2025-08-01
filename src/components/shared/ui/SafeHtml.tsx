import DOMPurify from 'dompurify';
import { useMemo } from 'react';

interface SafeHtmlProps {
  html: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

export function SafeHtml({
  html,
  className,
  allowedTags = [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'img',
  ],
  allowedAttributes = ['src', 'alt', 'class', 'style'],
}: SafeHtmlProps) {
  const sanitizedHtml = useMemo(() => {
    if (!html) return '';

    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
    });
  }, [html, allowedTags, allowedAttributes]);

  if (!sanitizedHtml) {
    return <div className={className}>상품 설명이 없습니다.</div>;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
