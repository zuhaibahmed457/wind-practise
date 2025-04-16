import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../users/entities/user.entity';
import { GetAllEmployeeDto } from './dto/get-all-employee.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageEmployeeStatusDto } from './dto/manage-employee-status.dto';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    create(createProfileDetailsDto: CreateEmployeeDto, currentUser: User): Promise<IResponse>;
    findAll(getAllEmployeeDto: GetAllEmployeeDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, updateEmployeeDto: UpdateEmployeeDto, currentUser: User): Promise<IResponse>;
    manage_status(paramDto: ParamIdDto, manageEmployeeStatusDto: ManageEmployeeStatusDto, user: User): Promise<IResponse>;
    delete(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
}
