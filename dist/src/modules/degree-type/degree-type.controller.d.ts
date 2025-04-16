import { DegreeTypeService } from './degree-type.service';
import { CreateDegreeTypeDto } from './dto/create-degree-type.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { UpdateDegreeTypeDto } from './dto/update-degree-type.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
export declare class DegreeTypeController {
    private readonly degreeTypeService;
    constructor(degreeTypeService: DegreeTypeService);
    create(createDegreeTypeDto: CreateDegreeTypeDto): Promise<IResponse>;
    findAll(getAllDto: GetAllDto): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, updateDegreeTypeDto: UpdateDegreeTypeDto): Promise<IResponse>;
}
