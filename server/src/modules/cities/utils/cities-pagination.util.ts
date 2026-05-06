import { SelectQueryBuilder } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { CitiesConnection } from '../dto/cities-connection.output';
import { SortableCityField, SortOrder } from '../dto/cities-sorting.input';
import { mapToOutput } from '../mappers/city.mapper';

export function applyCursorPagination(
  citiesQueryBuilder: SelectQueryBuilder<CityEntity>,
  cursor: string | undefined,
  sortBy: SortableCityField,
  sortOrder: SortOrder,
) {
  if (!cursor) return;

  const { value, id } = JSON.parse(
    Buffer.from(cursor, 'base64').toString(),
  );

  citiesQueryBuilder.andWhere(
    `(city.${sortBy}, city.id) ${
      sortOrder === 'DESC' ? '<' : '>'
    } (:value, :id)`,
    { value, id },
  );
}

export function buildPaginatedResponse(
  entities: CityEntity[],
  limit: number,
  sortBy: SortableCityField,
): CitiesConnection {
  const hasNextPage = entities.length > limit;
  const sliced = entities.slice(0, limit);

  return {
    edges: sliced.map((city) => ({
      node: mapToOutput(city),
      cursor: encodeCursor(city, sortBy),
    })),
    pageInfo: {
      hasNextPage,
      endCursor: sliced.length
        ? encodeCursor(sliced[sliced.length - 1], sortBy)
        : undefined,
    },
  };
}

function encodeCursor(
  city: CityEntity,
  sortBy: SortableCityField,
): string {
  return Buffer.from(
    JSON.stringify({
      value: city[sortBy],
      id: city.id,
    }),
  ).toString('base64');
}
