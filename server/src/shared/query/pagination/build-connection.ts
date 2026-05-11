import { encodeCursor } from './cursor/encode-cursor';

type ConnectionBuilderParams<TEntity, TNode> = {
  entities: TEntity[];
  limit: number;
  mapEntityToNode: (entity: TEntity) => TNode;
  getCursorValue: (entity: TEntity) => unknown;
};

export const buildConnection = <TEntity extends { id: number }, TNode>({
  entities,
  limit,
  mapEntityToNode: mapNode,
  getCursorValue,
}: ConnectionBuilderParams<TEntity, TNode>) => {
  const hasNextPage = entities.length > limit;

  const sliced = entities.slice(0, limit);

  const edges = sliced.map((entity) => ({
    node: mapNode(entity),

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
