"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateS3Paths = exports.DealS3Paths = exports.SdgS3Paths = exports.ProductS3Paths = exports.CommunityS3Paths = exports.EventS3Paths = exports.UserS3Paths = void 0;
const USER_BASE_PATH = 'users/';
const EVENT_BASE_PATH = 'events/';
const COMMUNITY_BASE_PATH = 'communities/';
const PRODUCT_BASE_PATH = 'products/';
const SDG_BASE_PATH = 'sdgs/';
const DEAL_BASE_PATH = 'deals/';
const CERTIFICATE_BASE_PATH = 'certificates/';
var UserS3Paths;
(function (UserS3Paths) {
    UserS3Paths["BANNER_IMAGE"] = "users/bannerImages";
    UserS3Paths["PROFILE_IMAGE"] = "users/profileImages";
    UserS3Paths["CSR_POLICY_DOC"] = "users/csrPolicyDoc";
    UserS3Paths["CERTIFICATE_OF_REGISTRATION"] = "users/certificateOfReg";
    UserS3Paths["PORTFOLIO_IMAGE"] = "users/portfolio";
    UserS3Paths["PORTFOLIO_VIDEO"] = "users/video";
})(UserS3Paths || (exports.UserS3Paths = UserS3Paths = {}));
var EventS3Paths;
(function (EventS3Paths) {
    EventS3Paths["BANNER_IMAGES"] = "events/bannerImages";
})(EventS3Paths || (exports.EventS3Paths = EventS3Paths = {}));
var CommunityS3Paths;
(function (CommunityS3Paths) {
    CommunityS3Paths["BANNER_IMAGES"] = "communities/bannerImages";
})(CommunityS3Paths || (exports.CommunityS3Paths = CommunityS3Paths = {}));
var ProductS3Paths;
(function (ProductS3Paths) {
    ProductS3Paths["IMAGES"] = "products/images";
})(ProductS3Paths || (exports.ProductS3Paths = ProductS3Paths = {}));
var SdgS3Paths;
(function (SdgS3Paths) {
    SdgS3Paths["IMAGES"] = "sdgs/images";
})(SdgS3Paths || (exports.SdgS3Paths = SdgS3Paths = {}));
var DealS3Paths;
(function (DealS3Paths) {
    DealS3Paths["BANNER_IMAGES"] = "deals/bannerImages";
})(DealS3Paths || (exports.DealS3Paths = DealS3Paths = {}));
var CertificateS3Paths;
(function (CertificateS3Paths) {
    CertificateS3Paths["TECHNICIAN"] = "certificates/technicians";
    CertificateS3Paths["ORGANIZATION"] = "certificates/organizations";
})(CertificateS3Paths || (exports.CertificateS3Paths = CertificateS3Paths = {}));
//# sourceMappingURL=s3-paths.js.map