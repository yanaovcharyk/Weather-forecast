import { CitiesService } from './cities.service';
import { NotFoundException } from '@nestjs/common';
import { createLoggerMock } from '@test/mocks/logger.mock';
import { createCityRepositoryMock } from '../../test/cities/mocks/city-repository.mock';

describe('CitiesService', () => {
  let service: CitiesService;
  let repo: ReturnType<typeof createCityRepositoryMock>;
  let logger: ReturnType<typeof createLoggerMock>;

  beforeEach(() => {
    repo = createCityRepositoryMock();
    logger = createLoggerMock();
    service = new CitiesService(repo as any, logger as any);
  });

  describe('getCityById', () => {
    it('should return city when found', async () => {
      const city = { id: 1, userId: 'u1', city: 'Kyiv' };
      repo.findOne.mockResolvedValue(city);

      const result = await service.getCityById({ id: '1', userId: 'u1' });

      expect(result).toEqual(city);
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.getCityById({ id: '1', userId: 'u1' }))
        .rejects.toThrow(NotFoundException);
      expect(logger.warn).toHaveBeenCalledWith('City not found', { id: '1'});
    });
  });

  describe('addCity', () => {
    it('should return existing city if found', async () => {
      const existing = { id: 1, city: 'Kyiv', userId: 'u1' };
      repo.findOne.mockResolvedValue(existing);

      const result = await service.addCity({
        userId: 'u1',
        input: { city: 'Kyiv', lat: 50, lon: 30 },
      });

      expect(result).toBe(existing);
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('should create and save new city if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      const created = { id: 2, city: 'Lviv', userId: 'u1' };
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.addCity({
        userId: 'u1',
        input: { city: 'Lviv', lat: 49, lon: 24 },
      });

      expect(repo.create).toHaveBeenCalledWith({
        userId: 'u1',
        city: 'Lviv',
        lat: 49,
        lon: 24,
      });
      expect(repo.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });
  });

  describe('getCityByName', () => {
    it('should return city when found', async () => {
      const city = { id: 3, city: 'Odesa', userId: 'u1' };
      repo.findOne.mockResolvedValue(city);

      const result = await service.getCityByName({ userId: 'u1', city: 'Odesa' });

      expect(result).toEqual(city);
    });

    it('should return null when not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.getCityByName({ userId: 'u1', city: 'Dnipro' });

      expect(result).toBeNull();
    });
  });

  describe('removeCity', () => {
    it('should remove city when found', async () => {
      const city = { id: 4, city: 'Kharkiv', userId: 'u1' };
      repo.findOne.mockResolvedValue(city);
      repo.remove.mockResolvedValue(city);

      const result = await service.removeCity({ id: '4', userId: 'u1' });

      expect(repo.remove).toHaveBeenCalledWith(city);
      expect(result).toEqual(city);
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.removeCity({ id: '99', userId: 'u1' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('removeAllCities', () => {
    it('should call delete and log affected count', async () => {
      repo.delete.mockResolvedValue({ affected: 2 });

      await service.removeAllCities({ userId: 'u1' });

      expect(repo.delete).toHaveBeenCalledWith({ userId: 'u1' });
      expect(logger.info).toHaveBeenCalledWith(
        'removeAllCities: cities removed',
        { affected: 2 },
      );
    });
  });

  describe('togglePinned', () => {
    it('should toggle pinned state and save', async () => {
      const city = { id: 5, city: 'Dnipro', userId: 'u1', isPinned: false };
      repo.findOne.mockResolvedValue(city);
      const saved = { ...city, isPinned: true };
      repo.save.mockResolvedValue(saved);

      const result = await service.togglePinned({ id: '5', userId: 'u1' });

      expect(repo.save).toHaveBeenCalledWith(city);
      expect(logger.info).toHaveBeenCalledWith(
        'togglePinned: pinned state updated',
        { id: saved.id, previous: false, current: true },
      );
      expect(result.isPinned).toBe(true);
    });
  });
});

