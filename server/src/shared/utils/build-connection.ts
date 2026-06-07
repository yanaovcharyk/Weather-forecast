import { encodeCursor } from './encode-cursor';

type ConnectionBuilderParams<TEntity, TNode> = {
  entities: TEntity[];
  limit: number;
  getCursorValue: (entity: TEntity) => unknown;
};

export const buildConnection = <TEntity extends { id: string }, TNode>({
  entities,
  limit,
  getCursorValue,
}: ConnectionBuilderParams<TEntity, TNode>) => {
  const hasNextPage = entities.length > limit;

  const sliced = entities.slice(0, limit);

  const edges = sliced.map((entity) => ({
    node: entity,

    cursor: encodeCursor({
      value: getCursorValue(entity),
      id: entity.id,
    }),
  }));

  return {
    edges,

    pageInfo: {
      hasNextPage,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : undefined,
    },
  };
};
