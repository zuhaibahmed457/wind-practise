export declare class CreateJobPostDto {
    title: string;
    address: string;
    city: string;
    country: string;
    min_salary?: number;
    max_salary?: number;
    min_experience?: number;
    max_experience?: number;
    qualification: string[];
    description: string;
    job_type_id: string[];
    designation_id: string[];
}
