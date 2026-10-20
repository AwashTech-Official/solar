import React from 'react';
import { siteConfig } from '@/src/config/site';
import { fetchCompanySettings, fetchSolarSolutions } from '@/src/lib/supabase';

export async function JsonLd() {
  const [settings, solutions] = await Promise.all([
    fetchCompanySettings(),
    fetchSolarSolutions(),
  ]);

  const companyName = settings?.company_name || siteConfig.businessName;
  const tagline = settings?.tagline || siteConfig.tagline;
  const phone = settings?.contact_phone || siteConfig.defaultContact.phone;
  const email = settings?.contact_email || siteConfig.defaultContact.email;
  const address = settings?.address || siteConfig.defaultContact.address;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: companyName,
    alternateName: 'SolEth Commercial Solar EPC Ethiopia',
    description: tagline,
    url: siteConfig.seo.siteUrl,
    telephone: phone,
    email: email,
    logo: `${siteConfig.seo.siteUrl}/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Addis Ababa',
      addressCountry: 'ET',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 9.0108,
      longitude: 38.7613,
    },
    sameAs: [
      siteConfig.defaultContact.telegram,
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Commercial Solar EPC Systems',
      itemListElement: solutions.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.short_description,
          provider: {
            '@type': 'Organization',
            name: companyName,
          },
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
