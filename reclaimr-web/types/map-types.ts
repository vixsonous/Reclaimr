export interface ICoordinates {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export interface IMapImage {
  id: string;
  s3_key: string;
  url: string;
}

export interface IMapItem extends ICoordinates {
  id: string;
  title: string;
  description: string;
  images?: IMapImage[];
}