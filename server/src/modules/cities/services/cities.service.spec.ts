import { NotFoundException } from '@nestjs/common';

import { CitiesService } from './cities.service';

import {
  CitiesServiceTestContext,
  createCitiesServiceContext,
} from '@cities/testing/contexts/cities-service.context';

import {
  KyivCity,
  LvivCity,
  OdesaCity,
  KharkivCity,
  DniproCity,
  PinnedDniproCity,
} from '@cities/testing/fixtures/city.fixture';

describe('CitiesService', () => {
  let service: CitiesService;
  let ctx: CitiesServiceTestContext;

  beforeEach(async () => {
    ctx = await createCitiesServiceContext();
    service = ctx.service;
  });

  describe('getCityById', () => {
    it('should return city when found', async () => {
      ctx.repo.findOne.mockResolvedValue(KyivCity);

      const result = await service.getCityById({
        id: '1',
        userId: 'u1',
      });

      expect(result).toEqual(KyivCity);
    });

    it('should throw NotFoundException when not found', async () => {
      ctx.repo.findOne.mockResolvedValue(null);

      await expect(
        service.getCityById({
          id: '1',
          userId: 'u1',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(ctx.logger.warn).toHaveBeenCalledWith('City not found', {
        id: '1',
      });
    });
  });

  describe('addCity', () => {
    it('should return existing city if found', async () => {
      ctx.repo.findOne.mockResolvedValue(KyivCity);

      const result = await service.addCity({
        userId: 'u1',
        input: {
          cityName: 'Kyiv',
          lat: 50,
          lon: 30,
        },
      });

      expect(result).toBe(KyivCity);
      expect(ctx.repo.create).not.toHaveBeenCalled();
    });

    it('should create and save new city if not found', async () => {
      ctx.repo.findOne.mockResolvedValue(null);

      ctx.repo.create.mockReturnValue(LvivCity);
      ctx.repo.save.mockResolvedValue(LvivCity);

      const result = await service.addCity({
        userId: 'u1',
        input: {
          cityName: 'Lviv',
          lat: 49,
          lon: 24,
        },
      });

      expect(ctx.repo.create).toHaveBeenCalledWith({
        userId: 'u1',
        cityName: 'Lviv',
        lat: 49,
        lon: 24,
      });

      expect(ctx.repo.save).toHaveBeenCalledWith(LvivCity);
      expect(result).toBe(LvivCity);
    });
  });

  describe('getCityByName', () => {
    it('should return city when found', async () => {
      ctx.repo.findOne.mockResolvedValue(OdesaCity);

      const result = await service.getCityByName({
        userId: 'u1',
        cityName: 'Odesa',
      });

      expect(result).toEqual(OdesaCity);
    });

    it('should return null when not found', async () => {
      ctx.repo.findOne.mockResolvedValue(null);

      const result = await service.getCityByName({
        userId: 'u1',
        cityName: 'Dnipro',
      });

      expect(result).toBeNull();
    });
  });

  describe('removeCity', () => {
    it('should remove city when found', async () => {
      ctx.repo.findOne.mockResolvedValue(KharkivCity);
      ctx.repo.remove.mockResolvedValue(KharkivCity);

      const result = await service.removeCity({
        id: '4',
        userId: 'u1',
      });

      expect(ctx.repo.remove).toHaveBeenCalledWith(KharkivCity);
      expect(result).toEqual(KharkivCity);
    });

    it('should throw NotFoundException when not found', async () => {
      ctx.repo.findOne.mockResolvedValue(null);

      await expect(
        service.removeCity({
          id: '99',
          userId: 'u1',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeAllCities', () => {
    it('should call delete and log affected count', async () => {
      ctx.repo.delete.mockResolvedValue({
        affected: 2,
      });

      await service.removeAllCities({
        userId: 'u1',
      });

      expect(ctx.repo.delete).toHaveBeenCalledWith({
        userId: 'u1',
      });

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'removeAllCities: cities removed',
        {
          affected: 2,
        },
      );
    });

    it('should log 0 when affected is undefined', async () => {
      ctx.repo.delete.mockResolvedValue({
        affected: undefined,
      });

      await service.removeAllCities({
        userId: 'u1',
      });

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'removeAllCities: cities removed',
        {
          affected: 0,
        },
      );
    });
  });

  describe('togglePinned', () => {
    it('should toggle pinned state and save', async () => {
      ctx.repo.findOne.mockResolvedValue(DniproCity);
      ctx.repo.save.mockResolvedValue(PinnedDniproCity);

      const result = await service.togglePinnedCity({
        id: '5',
        userId: 'u1',
      });

      expect(ctx.repo.save).toHaveBeenCalledWith(DniproCity);

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'togglePinned: pinned state updated',
        {
          id: PinnedDniproCity.id,
          previous: false,
          current: true,
        },
      );

      expect(result.isPinned).toBe(true);
    });

    it('should unpin city when city is already pinned', async () => {
      const pinnedCity = {
        ...PinnedDniproCity,
      };

      const unpinnedCity = {
        ...PinnedDniproCity,
        isPinned: false,
      };

      ctx.repo.findOne.mockResolvedValue(pinnedCity);
      ctx.repo.save.mockResolvedValue(unpinnedCity);

      const result = await service.togglePinnedCity({
        id: String(pinnedCity.id),
        userId: pinnedCity.userId,
      });

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'togglePinned: pinned state updated',
        {
          id: pinnedCity.id,
          previous: true,
          current: false,
        },
      );

      expect(result.isPinned).toBe(false);
    });

    it('should throw NotFoundException when city does not exist', async () => {
      ctx.repo.findOne.mockResolvedValue(null);

      await expect(
        service.togglePinnedCity({
          id: '999',
          userId: 'u1',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(ctx.repo.save).not.toHaveBeenCalled();
    });
  });
});
