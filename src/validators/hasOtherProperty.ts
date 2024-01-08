/* eslint-disable prettier/prettier */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'hasOtherProperty', async: false })
export class HasOtherProperty implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    console.log('args are ', args);
    return text.length > 1 && text.length < 10; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    console.log('args are ', args);

    // here you can provide default error message if validation failed
    return 'Text ($value) is too short or too long!';
  }
}
