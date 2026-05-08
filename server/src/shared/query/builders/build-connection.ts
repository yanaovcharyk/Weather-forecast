export function buildConnection<T>({
  entities,
  first,
  encodeCursor,
  mapNode,
  getCursorValue,
}: any) {
  const hasNextPage =
    entities.length > first;

  const sliced =
    entities.slice(0, first);

  const edges = sliced.map(
    (entity: any) => ({
      node: mapNode(entity),

      cursor: encodeCursor({
        value:
          getCursorValue(entity),

        id: entity.id,
      }),
    }),
  );

  return {
    edges,

    pageInfo: {
      hasNextPage,

      endCursor:
        edges.length > 0
          ? edges[
              edges.length - 1
            ].cursor
          : undefined,
    },
  };
}
