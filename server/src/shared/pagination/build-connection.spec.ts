import { buildConnection } from './build-connection';

jest.mock('./encode-cursor', () => ({
  encodeCursor: jest.fn(({ value, id }) => `cursor-${value}-${id}`),
}));

describe('buildConnection', () => {
  it('should build connection with edges and pageInfo', () => {
    const entities = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
      { id: '3', name: 'C' },
    ];

    const result = buildConnection({
      entities,
      limit: 2,
      getCursorValue: (e) => e.name,
    });

    expect(result.edges).toHaveLength(2);
    expect(result.edges[0]).toEqual({
      node: entities[0],
      cursor: 'cursor-A-1',
    });
    expect(result.edges[1]).toEqual({
      node: entities[1],
      cursor: 'cursor-B-2',
    });

    expect(result.pageInfo.hasNextPage).toBe(true);
    expect(result.pageInfo.endCursor).toBe('cursor-B-2');
  });

  it('should set hasNextPage=false when entities <= limit', () => {
    const entities = [{ id: '1', name: 'A' }];

    const result = buildConnection({
      entities,
      limit: 2,
      getCursorValue: (e) => e.name,
    });

    expect(result.pageInfo.hasNextPage).toBe(false);
    expect(result.pageInfo.endCursor).toBe('cursor-A-1');
  });

  it('should set endCursor=undefined when no entities', () => {
    const result = buildConnection({
      entities: [],
      limit: 2,
      getCursorValue: (e) => e,
    });

    expect(result.edges).toEqual([]);
    expect(result.pageInfo.hasNextPage).toBe(false);
    expect(result.pageInfo.endCursor).toBeUndefined();
  });
});
