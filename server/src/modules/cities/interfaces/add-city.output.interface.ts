import { ICityOutput } from "./city.output.interface";

export interface IAddCityOutput {
  ok: boolean;
  code?: string | null;
  city?: ICityOutput | null;
  existingCity?: ICityOutput | null;
}