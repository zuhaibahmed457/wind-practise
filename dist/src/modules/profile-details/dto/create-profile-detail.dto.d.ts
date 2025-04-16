import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
declare const CreateProfileDetailDto_base: import("@nestjs/mapped-types").MappedType<Partial<SignUpDto>>;
export declare class CreateProfileDetailDto extends CreateProfileDetailDto_base {
    phone_no: string;
    country?: string;
    city?: string;
    address?: string;
    tagline?: string;
    about?: string;
    linkedin_url?: string;
    facebook_url?: string;
    twitter_url?: string;
    website_url?: string;
}
export {};
