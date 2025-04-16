import {IsNotEmpty } from 'class-validator';
import { ToBoolean } from 'src/utils/to-boolean';

export class ToggleArchiveDto {
  @ToBoolean()
  @IsNotEmpty()
  is_archive: boolean;
}
