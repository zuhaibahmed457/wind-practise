import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SelectSrTopicDto {
  @IsString({ each: true, message: 'invalid topic id' })
  @ArrayMinSize(1, { message: 'select at least one topic' })
  @IsArray()
  @IsNotEmpty()
  topic_ids: string[];
}
