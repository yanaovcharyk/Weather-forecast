import { ObjectType, Field } from '@nestjs/graphql';
import { CityOutput } from './city.output';

@ObjectType()
export class CityEdge {
  @Field(() => CityOutput)
  node!: CityOutput;

  @Field()
  cursor!: string;
}

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage!: boolean;

  @Field({ nullable: true })
  endCursor?: string;
}

@ObjectType()
export class CitiesConnection {
  @Field(() => [CityEdge])
  edges!: CityEdge[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;
}
