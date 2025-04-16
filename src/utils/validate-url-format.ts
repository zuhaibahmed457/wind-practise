import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUrlOrEmpty', async: false })
export class IsUrlOrEmpty implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value === '' || value === null || value === undefined) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return 'Invalid URL. It should be a valid URL or an empty string.';
  }
}
