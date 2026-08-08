import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    adminPermissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::permission'
    >;
    adminUserOwner: Schema.Attribute.Relation<'manyToOne', 'admin::user'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    kind: Schema.Attribute.Enumeration<['content-api', 'admin']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'content-api'>;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    apiToken: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    apiTokens: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAboutEnAboutEn extends Struct.SingleTypeSchema {
  collectionName: 'about_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'About En';
    pluralName: 'about-en-entries';
    singularName: 'about-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contact: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::about-en.about-en'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    team: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    werkbank: Schema.Attribute.JSON;
  };
}

export interface ApiAboutAbout extends Struct.SingleTypeSchema {
  collectionName: 'about_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'About';
    pluralName: 'about-entries';
    singularName: 'about';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contact: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::about.about'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    team: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    werkbank: Schema.Attribute.JSON;
  };
}

export interface ApiAuditSlaStatusEnAuditSlaStatusEn
  extends Struct.SingleTypeSchema {
  collectionName: 'audit_sla_status_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Audit Sla Status En';
    pluralName: 'audit-sla-status-en-entries';
    singularName: 'audit-sla-status-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eyebrow: Schema.Attribute.JSON;
    heading: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::audit-sla-status-en.audit-sla-status-en'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sectionAriaLabel: Schema.Attribute.String;
    steps: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAuditSlaStatusAuditSlaStatus
  extends Struct.SingleTypeSchema {
  collectionName: 'audit_sla_status_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Audit Sla Status';
    pluralName: 'audit-sla-status-entries';
    singularName: 'audit-sla-status';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eyebrow: Schema.Attribute.JSON;
    heading: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::audit-sla-status.audit-sla-status'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sectionAriaLabel: Schema.Attribute.String;
    steps: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBrandAssetsEnBrandAssetsEn extends Struct.SingleTypeSchema {
  collectionName: 'brand_assets_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Brand Assets En';
    pluralName: 'brand-assets-en-entries';
    singularName: 'brand-assets-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    consultAvatar: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    loadingLogo: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::brand-assets-en.brand-assets-en'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBrandAssetsBrandAssets extends Struct.SingleTypeSchema {
  collectionName: 'brand_assets_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Brand Assets';
    pluralName: 'brand-assets-entries';
    singularName: 'brand-assets';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    consultAvatar: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    loadingLogo: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::brand-assets.brand-assets'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCareersEnCareersEn extends Struct.SingleTypeSchema {
  collectionName: 'careers_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Careers En';
    pluralName: 'careers-en-entries';
    singularName: 'careers-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    about: Schema.Attribute.JSON;
    calendly: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::careers-en.careers-en'
    > &
      Schema.Attribute.Private;
    positions: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    why: Schema.Attribute.JSON;
  };
}

export interface ApiCareersCareers extends Struct.SingleTypeSchema {
  collectionName: 'careers_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Careers';
    pluralName: 'careers-entries';
    singularName: 'careers';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    about: Schema.Attribute.JSON;
    calendly: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::careers.careers'
    > &
      Schema.Attribute.Private;
    positions: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    why: Schema.Attribute.JSON;
  };
}

export interface ApiCaseSpotlightEnCaseSpotlightEn
  extends Struct.SingleTypeSchema {
  collectionName: 'case_spotlight_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Case Spotlight En';
    pluralName: 'case-spotlight-en-entries';
    singularName: 'case-spotlight-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    authorInitials: Schema.Attribute.String;
    authorName: Schema.Attribute.String;
    authorRole: Schema.Attribute.String;
    caseId: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaLabel: Schema.Attribute.String;
    headlineClient: Schema.Attribute.String;
    headlinePrefix: Schema.Attribute.String;
    headlineSuffix: Schema.Attribute.String;
    href: Schema.Attribute.String;
    image: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::case-spotlight-en.case-spotlight-en'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    painPointSlug: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    quote: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCaseSpotlightCaseSpotlight extends Struct.SingleTypeSchema {
  collectionName: 'case_spotlight_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Case Spotlight';
    pluralName: 'case-spotlight-entries';
    singularName: 'case-spotlight';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    authorInitials: Schema.Attribute.String;
    authorName: Schema.Attribute.String;
    authorRole: Schema.Attribute.String;
    caseId: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaLabel: Schema.Attribute.String;
    headlineClient: Schema.Attribute.String;
    headlinePrefix: Schema.Attribute.String;
    headlineSuffix: Schema.Attribute.String;
    href: Schema.Attribute.String;
    image: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::case-spotlight.case-spotlight'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    painPointSlug: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    quote: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactFormModalEnContactFormModalEn
  extends Struct.SingleTypeSchema {
  collectionName: 'contact_form_modal_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Contact Form Modal En';
    pluralName: 'contact-form-modal-en-entries';
    singularName: 'contact-form-modal-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    consent: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    fields: Schema.Attribute.JSON;
    header: Schema.Attribute.JSON;
    honeypot: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-form-modal-en.contact-form-modal-en'
    > &
      Schema.Attribute.Private;
    messages: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    submit: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactFormModalContactFormModal
  extends Struct.SingleTypeSchema {
  collectionName: 'contact_form_modal_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Contact Form Modal';
    pluralName: 'contact-form-modal-entries';
    singularName: 'contact-form-modal';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    consent: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    fields: Schema.Attribute.JSON;
    header: Schema.Attribute.JSON;
    honeypot: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-form-modal.contact-form-modal'
    > &
      Schema.Attribute.Private;
    messages: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    submit: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCookieConsentEnCookieConsentEn
  extends Struct.SingleTypeSchema {
  collectionName: 'cookie_consent_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Cookie Consent En';
    pluralName: 'cookie-consent-en-entries';
    singularName: 'cookie-consent-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    actions: Schema.Attribute.JSON;
    banner: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cookie-consent-en.cookie-consent-en'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    settings: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCookieConsentCookieConsent extends Struct.SingleTypeSchema {
  collectionName: 'cookie_consent_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Cookie Consent';
    pluralName: 'cookie-consent-entries';
    singularName: 'cookie-consent';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    actions: Schema.Attribute.JSON;
    banner: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cookie-consent.cookie-consent'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    settings: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCortexPageEnCortexPageEn extends Struct.SingleTypeSchema {
  collectionName: 'cortex_page_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Cortex Page En';
    pluralName: 'cortex-page-en-entries';
    singularName: 'cortex-page-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ablauf: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    faq: Schema.Attribute.JSON;
    fit: Schema.Attribute.JSON;
    garantie: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cortex-page-en.cortex-page-en'
    > &
      Schema.Attribute.Private;
    problem: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    solution: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warum: Schema.Attribute.JSON;
  };
}

export interface ApiCortexPageCortexPage extends Struct.SingleTypeSchema {
  collectionName: 'cortex_page_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Cortex Page';
    pluralName: 'cortex-page-entries';
    singularName: 'cortex-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ablauf: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    faq: Schema.Attribute.JSON;
    fit: Schema.Attribute.JSON;
    garantie: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cortex-page.cortex-page'
    > &
      Schema.Attribute.Private;
    problem: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    solution: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warum: Schema.Attribute.JSON;
  };
}

export interface ApiFooterEnFooterEn extends Struct.SingleTypeSchema {
  collectionName: 'footer_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Footer En';
    pluralName: 'footer-en-entries';
    singularName: 'footer-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    columns: Schema.Attribute.JSON;
    copyrightTemplate: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    legalLinks: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::footer-en.footer-en'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.JSON;
    meta: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    rebrush: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFooterFooter extends Struct.SingleTypeSchema {
  collectionName: 'footer_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Footer';
    pluralName: 'footer-entries';
    singularName: 'footer';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    columns: Schema.Attribute.JSON;
    copyrightTemplate: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    legalLinks: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::footer.footer'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.JSON;
    meta: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    rebrush: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHomeEnHomeEn extends Struct.SingleTypeSchema {
  collectionName: 'home_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Home En';
    pluralName: 'home-en-entries';
    singularName: 'home-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    clients: Schema.Attribute.JSON;
    contact: Schema.Attribute.JSON;
    cortex: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    derSchnitt: Schema.Attribute.JSON;
    embeddedAI: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    horizontalScroll: Schema.Attribute.JSON;
    impactCounter: Schema.Attribute.JSON;
    loadingAlt: Schema.Attribute.String;
    loadingLogo: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::home-en.home-en'
    > &
      Schema.Attribute.Private;
    positionedForImpact: Schema.Attribute.JSON;
    problemJourney: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    structuredData: Schema.Attribute.JSON;
    testimonialsSection: Schema.Attribute.JSON;
    threeStepsCTA: Schema.Attribute.JSON;
    tickerScroll: Schema.Attribute.JSON;
    toast: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHomeHome extends Struct.SingleTypeSchema {
  collectionName: 'home_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Home';
    pluralName: 'home-entries';
    singularName: 'home';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    clients: Schema.Attribute.JSON;
    contact: Schema.Attribute.JSON;
    cortex: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    derSchnitt: Schema.Attribute.JSON;
    embeddedAI: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    horizontalScroll: Schema.Attribute.JSON;
    impactCounter: Schema.Attribute.JSON;
    loadingAlt: Schema.Attribute.String;
    loadingLogo: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::home.home'> &
      Schema.Attribute.Private;
    positionedForImpact: Schema.Attribute.JSON;
    problemJourney: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    structuredData: Schema.Attribute.JSON;
    testimonialsSection: Schema.Attribute.JSON;
    threeStepsCTA: Schema.Attribute.JSON;
    tickerScroll: Schema.Attribute.JSON;
    toast: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiImageOverrideImageOverride
  extends Struct.CollectionTypeSchema {
  collectionName: 'image_overrides';
  info: {
    description: 'Ein Eintrag pro Bild der Website. Datei hochladen = Bild wird ersetzt. Feld leer lassen = eingebautes Bild bleibt.';
    displayName: 'Bild austauschen';
    pluralName: 'image-overrides';
    singularName: 'image-override';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    category: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    file: Schema.Attribute.Media<'images' | 'videos'>;
    imageKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    label: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::image-override.image-override'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiImpressumEnImpressumEn extends Struct.SingleTypeSchema {
  collectionName: 'impressum_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Impressum En';
    pluralName: 'impressum-en-entries';
    singularName: 'impressum-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    datenschutzSection: Schema.Attribute.JSON;
    impressumSection: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::impressum-en.impressum-en'
    > &
      Schema.Attribute.Private;
    page: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiImpressumImpressum extends Struct.SingleTypeSchema {
  collectionName: 'impressum_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Impressum';
    pluralName: 'impressum-entries';
    singularName: 'impressum';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    datenschutzSection: Schema.Attribute.JSON;
    impressumSection: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::impressum.impressum'
    > &
      Schema.Attribute.Private;
    page: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiJobJob extends Struct.CollectionTypeSchema {
  collectionName: 'jobs';
  info: {
    description: 'Offene Positionen (frei anlegbar)';
    displayName: 'Job';
    pluralName: 'jobs';
    singularName: 'job';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::job.job'> &
      Schema.Attribute.Private;
    mailto: Schema.Attribute.String;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.Component<'shared.job-section', true>;
    slug: Schema.Attribute.UID<'title'>;
    tags: Schema.Attribute.Component<'shared.tag', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiKiAuditEnKiAuditEn extends Struct.SingleTypeSchema {
  collectionName: 'ki_audit_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Ki Audit En';
    pluralName: 'ki-audit-en-entries';
    singularName: 'ki-audit-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ablauf: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    faq: Schema.Attribute.JSON;
    fit: Schema.Attribute.JSON;
    garantie: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::ki-audit-en.ki-audit-en'
    > &
      Schema.Attribute.Private;
    problem: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    solution: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warum: Schema.Attribute.JSON;
  };
}

export interface ApiKiAuditKiAudit extends Struct.SingleTypeSchema {
  collectionName: 'ki_audit_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Ki Audit';
    pluralName: 'ki-audit-entries';
    singularName: 'ki-audit';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ablauf: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    faq: Schema.Attribute.JSON;
    fit: Schema.Attribute.JSON;
    garantie: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::ki-audit.ki-audit'
    > &
      Schema.Attribute.Private;
    problem: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    solution: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warum: Schema.Attribute.JSON;
  };
}

export interface ApiKiGlossarEnKiGlossarEn extends Struct.SingleTypeSchema {
  collectionName: 'ki_glossar_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Ki Glossar En';
    pluralName: 'ki-glossar-en-entries';
    singularName: 'ki-glossar-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    calendlyUrl: Schema.Attribute.String;
    countLabel: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    emptyTemplate: Schema.Attribute.String;
    glossary: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::ki-glossar-en.ki-glossar-en'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    toolbar: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiKiGlossarKiGlossar extends Struct.SingleTypeSchema {
  collectionName: 'ki_glossar_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Ki Glossar';
    pluralName: 'ki-glossar-entries';
    singularName: 'ki-glossar';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    calendlyUrl: Schema.Attribute.String;
    countLabel: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    emptyTemplate: Schema.Attribute.String;
    glossary: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::ki-glossar.ki-glossar'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    toolbar: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiKontaktEnKontaktEn extends Struct.SingleTypeSchema {
  collectionName: 'kontakt_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Kontakt En';
    pluralName: 'kontakt-en-entries';
    singularName: 'kontakt-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::kontakt-en.kontakt-en'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    video: Schema.Attribute.JSON;
  };
}

export interface ApiKontaktKontakt extends Struct.SingleTypeSchema {
  collectionName: 'kontakt_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Kontakt';
    pluralName: 'kontakt-entries';
    singularName: 'kontakt';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::kontakt.kontakt'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    video: Schema.Attribute.JSON;
  };
}

export interface ApiLeadLead extends Struct.CollectionTypeSchema {
  collectionName: 'leads';
  info: {
    description: 'Eingegangene Leads aus ROI-Rechner (quelle: "roi") und Kontaktformular (quelle: "kontakt"). Wird vom Lead-Service (FastAPI) per API-Token bef\u00FCllt \u2014 data/leads.jsonl und data/contacts.jsonl bleiben die Prim\u00E4rablage. ACHTUNG: personenbezogene Daten, KEINE \u00F6ffentlichen Leserechte vergeben.';
    displayName: 'Lead';
    pluralName: 'leads';
    singularName: 'lead';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eingegangenAm: Schema.Attribute.DateTime;
    email: Schema.Attribute.String;
    firma: Schema.Attribute.String;
    leadId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::lead.lead'> &
      Schema.Attribute.Private;
    nachricht: Schema.Attribute.Text;
    name: Schema.Attribute.String;
    payloadJson: Schema.Attribute.JSON;
    position: Schema.Attribute.String;
    potenzialEur: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    quelle: Schema.Attribute.String & Schema.Attribute.Required;
    telefon: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMaschinenraumTickerEnMaschinenraumTickerEn
  extends Struct.SingleTypeSchema {
  collectionName: 'maschinenraum_ticker_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Maschinenraum Ticker En';
    pluralName: 'maschinenraum-ticker-en-entries';
    singularName: 'maschinenraum-ticker-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ariaLabel: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    events: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::maschinenraum-ticker-en.maschinenraum-ticker-en'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMaschinenraumTickerMaschinenraumTicker
  extends Struct.SingleTypeSchema {
  collectionName: 'maschinenraum_ticker_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Maschinenraum Ticker';
    pluralName: 'maschinenraum-ticker-entries';
    singularName: 'maschinenraum-ticker';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ariaLabel: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    events: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::maschinenraum-ticker.maschinenraum-ticker'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMethodikEnMethodikEn extends Struct.SingleTypeSchema {
  collectionName: 'methodik_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Methodik En';
    pluralName: 'methodik-en-entries';
    singularName: 'methodik-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contact: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::methodik-en.methodik-en'
    > &
      Schema.Attribute.Private;
    manifest: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    stufen: Schema.Attribute.JSON;
    stufenSection: Schema.Attribute.JSON;
    toast: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ziel: Schema.Attribute.JSON;
  };
}

export interface ApiMethodikMethodik extends Struct.SingleTypeSchema {
  collectionName: 'methodik_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Methodik';
    pluralName: 'methodik-entries';
    singularName: 'methodik';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contact: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::methodik.methodik'
    > &
      Schema.Attribute.Private;
    manifest: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    stufen: Schema.Attribute.JSON;
    stufenSection: Schema.Attribute.JSON;
    toast: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ziel: Schema.Attribute.JSON;
  };
}

export interface ApiMiniCaseDetailEnMiniCaseDetailEn
  extends Struct.SingleTypeSchema {
  collectionName: 'mini_case_detail_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Mini Case Detail En';
    pluralName: 'mini-case-detail-en-entries';
    singularName: 'mini-case-detail-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    backLink: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    exampleBadge: Schema.Attribute.String;
    labels: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::mini-case-detail-en.mini-case-detail-en'
    > &
      Schema.Attribute.Private;
    notFound: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMiniCaseDetailMiniCaseDetail
  extends Struct.SingleTypeSchema {
  collectionName: 'mini_case_detail_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Mini Case Detail';
    pluralName: 'mini-case-detail-entries';
    singularName: 'mini-case-detail';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    backLink: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    exampleBadge: Schema.Attribute.String;
    labels: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::mini-case-detail.mini-case-detail'
    > &
      Schema.Attribute.Private;
    notFound: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNavEnNavEn extends Struct.SingleTypeSchema {
  collectionName: 'nav_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Nav En';
    pluralName: 'nav-en-entries';
    singularName: 'nav-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    company: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    featured: Schema.Attribute.JSON;
    filterButtons: Schema.Attribute.JSON;
    industrien: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::nav-en.nav-en'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.JSON;
    megaMenu: Schema.Attribute.JSON;
    mobile: Schema.Attribute.JSON;
    painPoints: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNavNav extends Struct.SingleTypeSchema {
  collectionName: 'nav_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Nav';
    pluralName: 'nav-entries';
    singularName: 'nav';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    company: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    featured: Schema.Attribute.JSON;
    filterButtons: Schema.Attribute.JSON;
    industrien: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::nav.nav'> &
      Schema.Attribute.Private;
    logo: Schema.Attribute.JSON;
    megaMenu: Schema.Attribute.JSON;
    mobile: Schema.Attribute.JSON;
    painPoints: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewEdgeSystemEnNewEdgeSystemEn
  extends Struct.SingleTypeSchema {
  collectionName: 'new_edge_system_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'New Edge System En';
    pluralName: 'new-edge-system-en-entries';
    singularName: 'new-edge-system-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cards: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eyebrow: Schema.Attribute.String;
    footer: Schema.Attribute.JSON;
    headingLines: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::new-edge-system-en.new-edge-system-en'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subline: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewEdgeSystemNewEdgeSystem extends Struct.SingleTypeSchema {
  collectionName: 'new_edge_system_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'New Edge System';
    pluralName: 'new-edge-system-entries';
    singularName: 'new-edge-system';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cards: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eyebrow: Schema.Attribute.String;
    footer: Schema.Attribute.JSON;
    headingLines: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::new-edge-system.new-edge-system'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subline: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNotFoundEnNotFoundEn extends Struct.SingleTypeSchema {
  collectionName: 'not_found_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Not Found En';
    pluralName: 'not-found-en-entries';
    singularName: 'not-found-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::not-found-en.not-found-en'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNotFoundNotFound extends Struct.SingleTypeSchema {
  collectionName: 'not_found_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Not Found';
    pluralName: 'not-found-entries';
    singularName: 'not-found';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::not-found.not-found'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPainPointEnPainPointEn extends Struct.CollectionTypeSchema {
  collectionName: 'pain_point_ens';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Pain Point (EN)';
    pluralName: 'pain-point-ens';
    singularName: 'pain-point-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    aliases: Schema.Attribute.JSON;
    closingCta: Schema.Attribute.JSON;
    compare: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    definition: Schema.Attribute.JSON;
    faq: Schema.Attribute.JSON;
    feature1: Schema.Attribute.JSON;
    feature2: Schema.Attribute.JSON;
    feature3: Schema.Attribute.JSON;
    featureCards: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    howTo: Schema.Attribute.JSON;
    integrations: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pain-point-en.pain-point-en'
    > &
      Schema.Attribute.Private;
    miniCases: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    slug: Schema.Attribute.UID;
    testimonialHero: Schema.Attribute.JSON;
    trustBar: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPainPointPageEnPainPointPageEn
  extends Struct.SingleTypeSchema {
  collectionName: 'pain_point_page_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Pain Point Page En';
    pluralName: 'pain-point-page-en-entries';
    singularName: 'pain-point-page-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    compare: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    datensouveraenitaet: Schema.Attribute.JSON;
    faq: Schema.Attribute.JSON;
    images: Schema.Attribute.JSON;
    integrationsLogosSrc: Schema.Attribute.String;
    labels: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pain-point-page-en.pain-point-page-en'
    > &
      Schema.Attribute.Private;
    miniCases: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPainPointPagePainPointPage extends Struct.SingleTypeSchema {
  collectionName: 'pain_point_page_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Pain Point Page';
    pluralName: 'pain-point-page-entries';
    singularName: 'pain-point-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    compare: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cta: Schema.Attribute.JSON;
    datensouveraenitaet: Schema.Attribute.JSON;
    faq: Schema.Attribute.JSON;
    images: Schema.Attribute.JSON;
    integrationsLogosSrc: Schema.Attribute.String;
    labels: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pain-point-page.pain-point-page'
    > &
      Schema.Attribute.Private;
    miniCases: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPainPointPainPoint extends Struct.CollectionTypeSchema {
  collectionName: 'pain_points';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Pain Point';
    pluralName: 'pain-points';
    singularName: 'pain-point';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    aliases: Schema.Attribute.JSON;
    closingCta: Schema.Attribute.JSON;
    compare: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    definition: Schema.Attribute.JSON;
    faq: Schema.Attribute.JSON;
    feature1: Schema.Attribute.JSON;
    feature2: Schema.Attribute.JSON;
    feature3: Schema.Attribute.JSON;
    featureCards: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    howTo: Schema.Attribute.JSON;
    integrations: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pain-point.pain-point'
    > &
      Schema.Attribute.Private;
    miniCases: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    slug: Schema.Attribute.UID;
    testimonialHero: Schema.Attribute.JSON;
    trustBar: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTestimonialTestimonial extends Struct.CollectionTypeSchema {
  collectionName: 'testimonials';
  info: {
    description: 'Kundenstimmen (Custom Post \u2014 frei anlegbar)';
    displayName: 'Testimonial';
    pluralName: 'testimonials';
    singularName: 'testimonial';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUnsubscribeEnUnsubscribeEn extends Struct.SingleTypeSchema {
  collectionName: 'unsubscribe_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Unsubscribe En';
    pluralName: 'unsubscribe-en-entries';
    singularName: 'unsubscribe-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    confirmButton: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::unsubscribe-en.unsubscribe-en'
    > &
      Schema.Attribute.Private;
    messages: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUnsubscribeUnsubscribe extends Struct.SingleTypeSchema {
  collectionName: 'unsubscribe_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Unsubscribe';
    pluralName: 'unsubscribe-entries';
    singularName: 'unsubscribe';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    confirmButton: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::unsubscribe.unsubscribe'
    > &
      Schema.Attribute.Private;
    messages: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiVideoShowcaseEnVideoShowcaseEn
  extends Struct.SingleTypeSchema {
  collectionName: 'video_showcase_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Video Showcase En';
    pluralName: 'video-showcase-en-entries';
    singularName: 'video-showcase-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaPrimary: Schema.Attribute.JSON;
    ctaSecondary: Schema.Attribute.JSON;
    heading: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::video-showcase-en.video-showcase-en'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sub: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiVideoShowcaseVideoShowcase extends Struct.SingleTypeSchema {
  collectionName: 'video_showcase_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Video Showcase';
    pluralName: 'video-showcase-entries';
    singularName: 'video-showcase';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaPrimary: Schema.Attribute.JSON;
    ctaSecondary: Schema.Attribute.JSON;
    heading: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::video-showcase.video-showcase'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sub: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiWebDesignEnWebDesignEn extends Struct.SingleTypeSchema {
  collectionName: 'web_design_en_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Web Design En';
    pluralName: 'web-design-en-entries';
    singularName: 'web-design-en';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cases: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    finalCta: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-design-en.web-design-en'
    > &
      Schema.Attribute.Private;
    prozess: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    showreel: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiWebDesignWebDesign extends Struct.SingleTypeSchema {
  collectionName: 'web_design_entries';
  info: {
    description: 'Generiert aus src/content (Website-Content-Layer)';
    displayName: 'Web Design';
    pluralName: 'web-design-entries';
    singularName: 'web-design';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cases: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    finalCta: Schema.Attribute.JSON;
    hero: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::web-design.web-design'
    > &
      Schema.Attribute.Private;
    prozess: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.JSON;
    showreel: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    focalPoint: Schema.Attribute.JSON;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.Text;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.Text & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::about-en.about-en': ApiAboutEnAboutEn;
      'api::about.about': ApiAboutAbout;
      'api::audit-sla-status-en.audit-sla-status-en': ApiAuditSlaStatusEnAuditSlaStatusEn;
      'api::audit-sla-status.audit-sla-status': ApiAuditSlaStatusAuditSlaStatus;
      'api::brand-assets-en.brand-assets-en': ApiBrandAssetsEnBrandAssetsEn;
      'api::brand-assets.brand-assets': ApiBrandAssetsBrandAssets;
      'api::careers-en.careers-en': ApiCareersEnCareersEn;
      'api::careers.careers': ApiCareersCareers;
      'api::case-spotlight-en.case-spotlight-en': ApiCaseSpotlightEnCaseSpotlightEn;
      'api::case-spotlight.case-spotlight': ApiCaseSpotlightCaseSpotlight;
      'api::contact-form-modal-en.contact-form-modal-en': ApiContactFormModalEnContactFormModalEn;
      'api::contact-form-modal.contact-form-modal': ApiContactFormModalContactFormModal;
      'api::cookie-consent-en.cookie-consent-en': ApiCookieConsentEnCookieConsentEn;
      'api::cookie-consent.cookie-consent': ApiCookieConsentCookieConsent;
      'api::cortex-page-en.cortex-page-en': ApiCortexPageEnCortexPageEn;
      'api::cortex-page.cortex-page': ApiCortexPageCortexPage;
      'api::footer-en.footer-en': ApiFooterEnFooterEn;
      'api::footer.footer': ApiFooterFooter;
      'api::home-en.home-en': ApiHomeEnHomeEn;
      'api::home.home': ApiHomeHome;
      'api::image-override.image-override': ApiImageOverrideImageOverride;
      'api::impressum-en.impressum-en': ApiImpressumEnImpressumEn;
      'api::impressum.impressum': ApiImpressumImpressum;
      'api::job.job': ApiJobJob;
      'api::ki-audit-en.ki-audit-en': ApiKiAuditEnKiAuditEn;
      'api::ki-audit.ki-audit': ApiKiAuditKiAudit;
      'api::ki-glossar-en.ki-glossar-en': ApiKiGlossarEnKiGlossarEn;
      'api::ki-glossar.ki-glossar': ApiKiGlossarKiGlossar;
      'api::kontakt-en.kontakt-en': ApiKontaktEnKontaktEn;
      'api::kontakt.kontakt': ApiKontaktKontakt;
      'api::lead.lead': ApiLeadLead;
      'api::maschinenraum-ticker-en.maschinenraum-ticker-en': ApiMaschinenraumTickerEnMaschinenraumTickerEn;
      'api::maschinenraum-ticker.maschinenraum-ticker': ApiMaschinenraumTickerMaschinenraumTicker;
      'api::methodik-en.methodik-en': ApiMethodikEnMethodikEn;
      'api::methodik.methodik': ApiMethodikMethodik;
      'api::mini-case-detail-en.mini-case-detail-en': ApiMiniCaseDetailEnMiniCaseDetailEn;
      'api::mini-case-detail.mini-case-detail': ApiMiniCaseDetailMiniCaseDetail;
      'api::nav-en.nav-en': ApiNavEnNavEn;
      'api::nav.nav': ApiNavNav;
      'api::new-edge-system-en.new-edge-system-en': ApiNewEdgeSystemEnNewEdgeSystemEn;
      'api::new-edge-system.new-edge-system': ApiNewEdgeSystemNewEdgeSystem;
      'api::not-found-en.not-found-en': ApiNotFoundEnNotFoundEn;
      'api::not-found.not-found': ApiNotFoundNotFound;
      'api::pain-point-en.pain-point-en': ApiPainPointEnPainPointEn;
      'api::pain-point-page-en.pain-point-page-en': ApiPainPointPageEnPainPointPageEn;
      'api::pain-point-page.pain-point-page': ApiPainPointPagePainPointPage;
      'api::pain-point.pain-point': ApiPainPointPainPoint;
      'api::testimonial.testimonial': ApiTestimonialTestimonial;
      'api::unsubscribe-en.unsubscribe-en': ApiUnsubscribeEnUnsubscribeEn;
      'api::unsubscribe.unsubscribe': ApiUnsubscribeUnsubscribe;
      'api::video-showcase-en.video-showcase-en': ApiVideoShowcaseEnVideoShowcaseEn;
      'api::video-showcase.video-showcase': ApiVideoShowcaseVideoShowcase;
      'api::web-design-en.web-design-en': ApiWebDesignEnWebDesignEn;
      'api::web-design.web-design': ApiWebDesignWebDesign;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
