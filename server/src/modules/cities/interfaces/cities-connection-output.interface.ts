import { ICityOutput } from './city.output.interface';

export interface ICityEdgeOutput {
  node: ICityOutput;
  cursor: string;
}

export interface ICitiesConnectionOutput {
  edges: ICityEdgeOutput[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string;
  };
}
