import type { Schema, Struct } from '@strapi/strapi';

export interface SharedBullet extends Struct.ComponentSchema {
  collectionName: 'components_shared_bullets';
  info: {
    description: 'Einzelner Stichpunkt';
    displayName: 'Bullet';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    description: 'Call-to-Action / Link mit Beschriftung';
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedJobSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_job_sections';
  info: {
    description: 'Inhaltlicher Abschnitt einer Stelle (z. B. "Deine Aufgaben") mit Stichpunkten';
    displayName: 'Job Section';
    icon: 'layer';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.bullet', true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO-Kopfdaten einer Seite (Title, Description, Canonical, OG-Image)';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonical: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    ogImage: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    description: 'Kurz-Tag (inkl. optionalem Emoji-Pr\u00E4fix), z. B. "\uD83D\uDCCD Remote/M\u00FCnchen"';
    displayName: 'Tag';
    icon: 'priceTag';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.bullet': SharedBullet;
      'shared.cta': SharedCta;
      'shared.job-section': SharedJobSection;
      'shared.seo': SharedSeo;
      'shared.tag': SharedTag;
    }
  }
}
