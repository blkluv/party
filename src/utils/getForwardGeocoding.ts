import { env } from "~/config/env";

export interface ForwardGeocodingResponse {
  type: string;
  query: string[];
  features: Feature[];
  attribution: string;
}

export interface Feature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Properties;
  text: string;
  place_name: string;
  center: number[];
  geometry: Geometry;
  address?: string;
  context: Context[];
}

export interface Context {
  id: string;
  mapbox_id?: string;
  text: string;
  wikidata?: string;
  short_code?: string;
}

export interface Geometry {
  type: string;
  coordinates: number[];
  interpolated?: boolean;
  omitted?: boolean;
}

export interface Properties {
  accuracy: string;
  mapbox_id: string;
}

export const getForwardGeocoding = async (location: string) => {
  return (await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`
  ).then((r) => r.json())) as ForwardGeocodingResponse;
};
