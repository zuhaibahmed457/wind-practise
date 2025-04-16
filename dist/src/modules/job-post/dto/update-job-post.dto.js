"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJobPostDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_job_post_dto_1 = require("./create-job-post.dto");
class UpdateJobPostDto extends (0, mapped_types_1.PartialType)(create_job_post_dto_1.CreateJobPostDto) {
}
exports.UpdateJobPostDto = UpdateJobPostDto;
//# sourceMappingURL=update-job-post.dto.js.map