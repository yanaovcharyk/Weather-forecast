import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PageInfo } from './dto/page-info.dto';

export function EdgeType<T>(classRef: Type<T>) {
  @ObjectType(`${classRef.name}Edge`)
  abstract class Edge {
    @Field(() => classRef)
    node!: T;

    @Field()
    cursor!: string;
  }

  return Edge;
}

export function ConnectionType<T>(classRef: Type<T>) {
  const EdgeClass = EdgeType(classRef);

  @ObjectType(`${classRef.name}Connection`)
  abstract class Connection {
    @Field(() => [EdgeClass])
    edges!: InstanceType<typeof EdgeClass>[];

    @Field(() => PageInfo)
    pageInfo!: PageInfo;
  }

  return Connection;
}
