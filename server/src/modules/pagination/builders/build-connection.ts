export function buildConnection<T extends { id: number }>({
  entities,
  limit,
  mapNode,
  getCursorValue,
  encodeCursor,
}: {
  entities: T[];

  limit: number;

  mapNode: (entity: T) => unknown;

  getCursorValue: (
    entity: T,
  ) => unknown;

  encodeCursor: (
    payload: unknown,
  ) => string;
}) {
  const hasNextPage =
    entities.length > limit;

  const sliced =
    entities.slice(0, limit);

  return {
    edges: sliced.map((entity: any) => ({
      node: mapNode(entity),

      cursor: encodeCursor({
        value: getCursorValue(entity),
        id: entity.id,
      }),
    })),

    pageInfo: {
      hasNextPage,

      endCursor: sliced.length
        ? encodeCursor({
            value: getCursorValue(
              sliced[sliced.length - 1],
            ),

            id:
              sliced[sliced.length - 1].id,
          })
        : undefined,
    },
  };
}
