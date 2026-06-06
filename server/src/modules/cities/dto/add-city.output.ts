import { Field, ObjectType } from '@nestjs/graphql';
import { CityOutput } from './city.output';
import { IAddCityOutput } from '../interfaces/add-city.output.interface';

@ObjectType()
export class AddCityOutput implements IAddCityOutput {
  @Field()
  ok!: boolean;

  @Field(() => String, { nullable: true })
  code?: string | null;

  @Field(() => CityOutput, { nullable: true })
  city?: CityOutput | null;

  @Field(() => CityOutput, { nullable: true })
  existingCity?: CityOutput | null;
}
