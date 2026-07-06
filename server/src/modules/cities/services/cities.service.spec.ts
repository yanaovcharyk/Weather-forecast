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
  NewDniproCityName,
  UnpinnedDniproCity,
  UpdatedDniproCity,
  UpdateDniproCityParams,
  UpdatePinnedDniproCityParams,
} from '@cities/testing/fixtures';

describe('CitiesService', () => {
  let service: CitiesService;
  let ctx: CitiesServiceTestContext;

  const mockCityUpdateSuccess = (city = UpdatedDniproCity) => {
    ctx.repo.update.mockResolvedValue({
      affected: 1,
    });
    ctx.repo.findOne.mockResolvedValue(city);
  };

  const expectCityUpdate = (
    params: { id: string; userId: string },
    updates: Record<string, unknown>,
  ) => {
    expect(ctx.repo.update).toHaveBeenCalledWith(
      {
        id: params.id,
        userId: params.userId,
      },
      updates,
    );
  };

  beforeEach(async () => {
    ctx = await createCitiesServiceContext();
    service = ctx.service;
  });

  describe('getSavedCity', () => {
    it('should return city by id when found', async () => {
      ctx.repo.findOne.mockResolvedValue(KyivCity);

      const result = await service.getSavedCity({
        id: '1',
        userId: 'u1',
      });

      expect(ctx.repo.findOne).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: 'u1',
        },
      });
      expect(result).toEqual(KyivCity);
    });

    it('should return city by name when found', async () => {
      ctx.repo.findOne.mockResolvedValue(OdesaCity);

      const result = await service.getSavedCity({
        userId: 'u1',
        cityName: 'Odesa',
      });

      expect(ctx.repo.findOne).toHaveBeenCalledWith({
        where: {
          userId: 'u1',
          cityName: 'Odesa',
        },
      });
      expect(result).toEqual(OdesaCity);
    });

    it('should return null when not found', async () => {
      ctx.repo.findOne.mockResolvedValue(null);

      const result = await service.getSavedCity({
        userId: 'u1',
        cityName: 'Dnipro',
      });

      expect(result).toBeNull();
    });
  });

  describe('addSavedCity', () => {
    it('should return existing city if found', async () => {
      ctx.repo.findOne.mockResolvedValue(KyivCity);

      const result = await service.addSavedCity({
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

      const result = await service.addSavedCity({
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

  describe('removeSavedCity', () => {
    it('should remove city when found', async () => {
      ctx.repo.findOne.mockResolvedValue(KharkivCity);
      ctx.repo.remove.mockResolvedValue(KharkivCity);

      const result = await service.removeSavedCity({
        id: '4',
        userId: 'u1',
      });

      expect(ctx.repo.remove).toHaveBeenCalledWith(KharkivCity);
      expect(result).toEqual(KharkivCity);
    });

    it('should throw NotFoundException when not found', async () => {
      ctx.repo.findOne.mockResolvedValue(null);

      await expect(
        service.removeSavedCity({
          id: '99',
          userId: 'u1',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeAllSavedCities', () => {
    it('should call delete and log affected count', async () => {
      ctx.repo.delete.mockResolvedValue({
        affected: 2,
      });

      await service.removeAllSavedCities({
        userId: 'u1',
      });

      expect(ctx.repo.delete).toHaveBeenCalledWith({
        userId: 'u1',
      });

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'removeAllSavedCities: cities removed',
        {
          affected: 2,
        },
      );
    });

    it('should log 0 when affected is undefined', async () => {
      ctx.repo.delete.mockResolvedValue({
        affected: undefined,
      });

      await service.removeAllSavedCities({
        userId: 'u1',
      });

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'removeAllSavedCities: cities removed',
        {
          affected: 0,
        },
      );
    });
  });

  describe('updateSavedCity', () => {
    it('should update provided city fields and return updated city', async () => {
      mockCityUpdateSuccess();

      const result = await service.updateSavedCity(UpdateDniproCityParams);

      expectCityUpdate(UpdateDniproCityParams, UpdateDniproCityParams.input);

      expect(ctx.repo.findOne).toHaveBeenCalledWith({
        where: {
          id: UpdateDniproCityParams.id,
          userId: UpdateDniproCityParams.userId,
        },
      });

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'updateSavedCity: city updated',
        {
          id: UpdateDniproCityParams.id,
          fields: ['cityName', 'isPinned'],
          current: UpdateDniproCityParams.input,
        },
      );

      expect(result).toEqual(UpdatedDniproCity);
    });

    it('should update isPinned to false when false is provided', async () => {
      mockCityUpdateSuccess(UnpinnedDniproCity);

      const result = await service.updateSavedCity(
        UpdatePinnedDniproCityParams,
      );

      expectCityUpdate(
        UpdatePinnedDniproCityParams,
        UpdatePinnedDniproCityParams.input,
      );

      expect(ctx.logger.info).toHaveBeenCalledWith(
        'updateSavedCity: city updated',
        {
          id: UpdatePinnedDniproCityParams.id,
          fields: ['isPinned'],
          current: UpdatePinnedDniproCityParams.input,
        },
      );

      expect(result.isPinned).toBe(false);
    });

    it('should remove undefined fields before update', async () => {
      mockCityUpdateSuccess({
        ...DniproCity,
        cityName: NewDniproCityName,
      });

      await service.updateSavedCity({
        id: DniproCity.id,
        userId: DniproCity.userId,
        input: {
          cityName: NewDniproCityName,
          isPinned: undefined,
        },
      });

      expectCityUpdate(DniproCity, {
        cityName: NewDniproCityName,
      });
    });

    it('should throw BadRequestException when no fields are provided', async () => {
      await expect(
        service.updateSavedCity({
          id: '5',
          userId: 'u1',
          input: {},
        }),
      ).rejects.toThrow(BadRequestException);

      expect(ctx.repo.update).not.toHaveBeenCalled();
      expect(ctx.repo.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when city does not exist', async () => {
      ctx.repo.update.mockResolvedValue({
        affected: 0,
      });

      await expect(
        service.updateSavedCity({
          id: '999',
          userId: DniproCity.userId,
          input: {
            isPinned: true,
          },
        }),
      ).rejects.toThrow(NotFoundException);

      expect(ctx.repo.update).toHaveBeenCalledWith(
        {
          id: '999',
          userId: DniproCity.userId,
        },
        {
          isPinned: true,
        },
      );

      expect(ctx.repo.findOne).not.toHaveBeenCalled();
      expect(ctx.repo.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when updated city cannot be reloaded', async () => {
      ctx.repo.update.mockResolvedValue({
        affected: 1,
      });
      ctx.repo.findOne.mockResolvedValue(null);

      await expect(
        service.updateSavedCity({
          id: DniproCity.id,
          userId: DniproCity.userId,
          input: {
            isPinned: true,
          },
        }),
      ).rejects.toThrow(NotFoundException);

      expect(ctx.repo.findOne).toHaveBeenCalledWith({
        where: {
          id: DniproCity.id,
          userId: DniproCity.userId,
        },
      });
      expect(ctx.logger.warn).toHaveBeenCalledWith('City not found', {
        id: DniproCity.id,
      });
    });
  });
});
