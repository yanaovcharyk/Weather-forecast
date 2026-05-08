import { Field, ObjectType } from "@nestjs/graphql";
import { CityOutput } from "./city.output";

@ObjectType()
export class AddCityResult {
  @Field()
  ok!: boolean;

  @Field(() => String, { nullable: true })
  code?: string | null;

  @Field(() => CityOutput, { nullable: true })
  city?: CityOutput | null;

  @Field(() => CityOutput, { nullable: true })
  existingCity?: CityOutput | null;
}
