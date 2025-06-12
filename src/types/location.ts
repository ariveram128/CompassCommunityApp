export interface Coordinates {
  latitude: number;
  longitude: number;
  timestamp?: number;
  accuracy?: number;
}

export interface LocationData extends Coordinates {
  timestamp: number;
  accuracy: number;
} 