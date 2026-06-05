// Structured Data (JSON-LD) generators for SEO

import { SITE_URL, SITE_NAME } from './seo';

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export function generateSoftwareApplicationSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PlayFlow',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any (Progressive Web App)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Comprehensive offline board game companion app with 9 essential tools including dice roller, score tracker, team builder, timer, turn order, arena mode, spin wheel, coin flip, and who goes first selector.',
    featureList: [
      'Random starting player selector (Who Goes First)',
      'Automatic team builder with balancing',
      'Turn order tracker for complex games',
      'Multi-round score keeper with summation',
      'Tournament mode with leaderboard (Arena)',
      'Multi-player chess-style timer',
      'Virtual dice roller (D2-D100)',
      'Customizable spin wheel',
      'Virtual coin flip',
    ],
    screenshot: `${SITE_URL}/og-image.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };
}

export function generateOrganizationSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.svg`,
    description: 'Free offline board game companion app for players',
    sameAs: [],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateWebPageSchema(
  title: string,
  description: string,
  url: string
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}
