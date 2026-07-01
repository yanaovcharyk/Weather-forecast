import { BadRequestException, NotFoundException } from '@nestjs/common';

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

  describe('updateCity', () => {
    it('should update provided city fields and save', async () => {
      const city = {
        ...DniproCity,
      };
      const previousCityName = city.cityName;

      ctx.repo.findOne.mockResolvedValue(city);
      ctx.repo.save.mockResolvedValue({
        ...city,
        cityName: 'New Dnipro',
        isPinned: true,
      });

      const result = await service.updateCity({
        id: '5',
        userId: 'u1',
        input: {
          cityName: 'New Dnipro',
          isPinned: true,
        },
      });

      expect(ctx.repo.save).toHaveBeenCalledWith({
        ...city,
        cityName: 'New Dnipro',
        isPinned: true,
      });

      expect(ctx.logger.info).toHaveBeenCalledWith('updateCity: city updated', {
        id: city.id,
        fields: ['cityName', 'isPinned'],
        previous: {
          cityName: previousCityName,
          isPinned: false,
        },
        current: {
          cityName: 'New Dnipro',
          isPinned: true,
        },
      });

      expect(result.cityName).toBe('New Dnipro');
      expect(result.isPinned).toBe(true);
    });

    it('should update isPinned to false when false is provided', async () => {
      const pinnedCity = {
        ...PinnedDniproCity,
      };

      const unpinnedCity = {
        ...PinnedDniproCity,
        isPinned: false,
      };

      ctx.repo.findOne.mockResolvedValue(pinnedCity);
      ctx.repo.save.mockResolvedValue(unpinnedCity);

      const result = await service.updateCity({
        id: String(pinnedCity.id),
        userId: pinnedCity.userId,
        input: {
          isPinned: false,
        },
      });

      expect(ctx.logger.info).toHaveBeenCalledWith('updateCity: city updated', {
        id: pinnedCity.id,
        fields: ['isPinned'],
        previous: {
          isPinned: true,
        },
        current: {
          isPinned: false,
        },
      });

      expect(result.isPinned).toBe(false);
    });

    it('should throw BadRequestException when no fields are provided', async () => {
      ctx.repo.findOne.mockResolvedValue(DniproCity);

      await expect(
        service.updateCity({
          id: '5',
          userId: 'u1',
          input: {},
        }),
      ).rejects.toThrow(BadRequestException);

      expect(ctx.repo.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when city does not exist', async () => {
      ctx.repo.findOne.mockResolvedValue(null);

      await expect(
        service.updateCity({
          id: '999',
          userId: 'u1',
          input: {
            isPinned: true,
          },
        }),
      ).rejects.toThrow(NotFoundException);

      expect(ctx.repo.save).not.toHaveBeenCalled();
    });
  });
});
