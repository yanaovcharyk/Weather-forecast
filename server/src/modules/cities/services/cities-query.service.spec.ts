import { CitiesQueryService } from './cities-query.service';
import { SortOrder } from '@shared/constants';
import { createLoggerMock } from '@test/mocks/logger.mock';
import { decodeCursor } from '@shared/utils/decode-cursor';
import { buildConnection } from '@shared/utils/build-connection';
import { createCityRepositoryMock } from '../../test/cities/mocks/city-repository.mock';
import { CitySortField } from '../city-query.config';

jest.mock('@shared/utils/decode-cursor', () => ({
  decodeCursor: jest.fn(),
}));

jest.mock('@shared/utils/build-connection', () => ({
  buildConnection: jest.fn(),
}));

describe('CitiesQueryService', () => {
  let service: CitiesQueryService;
  let repo: ReturnType<typeof createCityRepositoryMock>;
  let logger: ReturnType<typeof createLoggerMock>;

  beforeEach(() => {
    repo = createCityRepositoryMock();
    logger = createLoggerMock();
    service = new CitiesQueryService(repo as any, logger as any);
  });

  describe('getCities', () => {
    it('should call repository.find with userId and return cities', async () => {
      const mockCities = [{ id: '1', city: 'Kyiv' }];
      repo.find.mockResolvedValue(mockCities);

      const result = await service.getCities({ userId: 'u1' });

      expect(repo.find).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockCities);
    });
  });

  describe('getCitiesPaginated', () => {
    it('should filter pinned cities when showPinnedOnly=true', async () => {
      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: '1', city: 'Kyiv' }]),
      };
      repo.createQueryBuilder.mockReturnValue(qb);

      (buildConnection as jest.Mock).mockReturnValue({
        edges: [{ node: { id: '1', city: 'Kyiv' }, cursor: 'cursor-1' }],
        pageInfo: { hasNextPage: false, endCursor: 'cursor-1' },
      });

      const result = await service.getCitiesPaginated({
        userId: 'u1',
        query: {
          showPinnedOnly: true,
          pagination: { limit: 1 },
          sorting: { sortBy: CitySortField.CREATED_AT, sortOrder: SortOrder.DESC },
        },
      });

      expect(logger.debug).toHaveBeenCalledWith('Filtering pinned cities only');
      expect(qb.andWhere).toHaveBeenCalledWith('city.isPinned = true');
      expect(result.edges).toHaveLength(1);
    });

    it('should apply cursor when provided', async () => {
      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: '2', city: 'Lviv' }]),
      };
      repo.createQueryBuilder.mockReturnValue(qb);

      (decodeCursor as jest.Mock).mockReturnValue({ value: 'Kyiv', id: 1 });

      (buildConnection as jest.Mock).mockReturnValue({
        edges: [{ node: { id: '2', city: 'Lviv' }, cursor: 'cursor-2' }],
        pageInfo: { hasNextPage: false, endCursor: 'cursor-2' },
      });

      const result = await service.getCitiesPaginated({
        userId: 'u1',
        query: {
          pagination: { limit: 1, cursor: 'encoded-cursor' },
          sorting: { sortBy: CitySortField.CREATED_AT, sortOrder: SortOrder.ASC },
        },
      });

      expect(decodeCursor).toHaveBeenCalledWith('encoded-cursor');
      expect(qb.andWhere).toHaveBeenCalled();
      expect(result.pageInfo.endCursor).toBe('cursor-2');
    });

    it('should apply pagination with limit+1', async () => {
      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: '3', city: 'Odesa' }]),
      };
      repo.createQueryBuilder.mockReturnValue(qb);

      (buildConnection as jest.Mock).mockReturnValue({
        edges: [{ node: { id: '3', city: 'Odesa' }, cursor: 'cursor-3' }],
        pageInfo: { hasNextPage: false, endCursor: 'cursor-3' },
      });

      await service.getCitiesPaginated({
        userId: 'u1',
        query: {
          pagination: { limit: 5 },
          sorting: { sortBy: CitySortField.CREATED_AT, sortOrder: SortOrder.DESC },
        },
      });

      expect(qb.take).toHaveBeenCalledWith(6);
    });
  });
});

