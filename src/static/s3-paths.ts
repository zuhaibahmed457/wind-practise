const USER_BASE_PATH = 'users/';
const EVENT_BASE_PATH = 'events/';
const COMMUNITY_BASE_PATH = 'communities/';
const PRODUCT_BASE_PATH = 'products/';
const SDG_BASE_PATH = 'sdgs/';
const DEAL_BASE_PATH = 'deals/';
const CERTIFICATE_BASE_PATH = 'certificates/';

export enum UserS3Paths {
  BANNER_IMAGE = `${USER_BASE_PATH}bannerImages`,
  PROFILE_IMAGE = `${USER_BASE_PATH}profileImages`,
  CSR_POLICY_DOC = `${USER_BASE_PATH}csrPolicyDoc`,
  CERTIFICATE_OF_REGISTRATION = `${USER_BASE_PATH}certificateOfReg`,
  PORTFOLIO_IMAGE = `${USER_BASE_PATH}portfolio`,
  PORTFOLIO_VIDEO = `${USER_BASE_PATH}video`,
}

export enum EventS3Paths {
  BANNER_IMAGES = `${EVENT_BASE_PATH}bannerImages`,
}

export enum CommunityS3Paths {
  BANNER_IMAGES = `${COMMUNITY_BASE_PATH}bannerImages`,
}

export enum ProductS3Paths {
  IMAGES = `${PRODUCT_BASE_PATH}images`,
}

export enum SdgS3Paths {
  IMAGES = `${SDG_BASE_PATH}images`,
}

export enum DealS3Paths {
  BANNER_IMAGES = `${DEAL_BASE_PATH}bannerImages`,
}

export enum CertificateS3Paths {
  TECHNICIAN = `${CERTIFICATE_BASE_PATH}technicians`,
  ORGANIZATION = `${CERTIFICATE_BASE_PATH}organizations`,
}
