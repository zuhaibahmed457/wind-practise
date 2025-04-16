import { ValidatorConstraintInterface } from 'class-validator';
export declare class IsUrlOrEmpty implements ValidatorConstraintInterface {
    validate(value: any): boolean;
    defaultMessage(): string;
}
