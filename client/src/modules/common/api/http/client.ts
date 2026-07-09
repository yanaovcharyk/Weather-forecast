import { config } from '@/common/config';
import type { GraphQLResponse } from '@/common/api/apollo';

export type GraphQLRequestBody<TVariables = Record<string, unknown>> = {
  query: string;
  variables?: TVariables;
};

type JsonRequestInit = Omit<RequestInit, 'body' | 'headers' | 'method'> & {
  headers?: HeadersInit;
};

const JSON_CONTENT_TYPE = 'application/json';

const createJsonHeaders = (headers?: HeadersInit) => {
  const jsonHeaders = new Headers(headers);

  if (!jsonHeaders.has('Content-Type')) {
    jsonHeaders.set('Content-Type', JSON_CONTENT_TYPE);
  }

  return jsonHeaders;
};

export const createApiUrl = (path: string) => `${config.apiBaseUrl}${path}`;

export const postJson = (
  url: string,
  body: unknown,
  init: JsonRequestInit = {},
) => {
  const { headers, ...requestInit } = init;

  return fetch(url, {
    ...requestInit,
    method: 'POST',
    credentials: requestInit.credentials ?? 'include',
    headers: createJsonHeaders(headers),
    body: JSON.stringify(body),
  });
};

export const postGraphQL = async <TData, TVariables = Record<string, unknown>>(
  url: string,
  body: GraphQLRequestBody<TVariables>,
  init?: JsonRequestInit,
): Promise<GraphQLResponse<TData>> => {
  const response = await postJson(url, body, init);

  return response.json();
};

export const sendJsonBeacon = (url: string, body: unknown) => {
  return navigator.sendBeacon(url, JSON.stringify(body));
};
