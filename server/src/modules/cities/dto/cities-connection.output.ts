import { ObjectType, Field } from '@nestjs/graphql';
import { CityOutput } from './city.output';
import { PageInfo } from '@shared/graphql/dto';

@ObjectType()
export class CityEdge {
  @Field(() => CityOutput)
  node!: CityOutput;

  @Field()
  cursor!: string;
}

@ObjectType()
export class CitiesConnection {
  @Field(() => [CityEdge])
  edges!: CityEdge[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;
}
