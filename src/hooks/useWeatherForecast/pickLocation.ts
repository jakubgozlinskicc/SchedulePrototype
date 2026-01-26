export interface CityCoordinates {
  name: string;
  latitude: number;
  longitude: number;
}

export const CITIES: CityCoordinates[] = [
  { name: "Katowice", latitude: 50.2649, longitude: 19.0238 },
  { name: "Gliwice", latitude: 50.2941, longitude: 18.6762 },
  { name: "Warszawa", latitude: 52.2297, longitude: 21.0122 },
  { name: "Kraków", latitude: 50.0647, longitude: 19.945 },
  { name: "Gdańsk", latitude: 54.352, longitude: 18.6466 },
  { name: "Wrocław", latitude: 51.1079, longitude: 17.0385 },
  { name: "Poznań", latitude: 52.4064, longitude: 16.9252 },
  { name: "Łódź", latitude: 51.7592, longitude: 19.456 },
  { name: "Szczecin", latitude: 53.4285, longitude: 14.5528 },
  { name: "Bydgoszcz", latitude: 53.1235, longitude: 18.0084 },
  { name: "Lublin", latitude: 51.2465, longitude: 22.5684 },
];

export const pickLocation = (cityName: string): CityCoordinates | undefined => {
  return CITIES.find((c) => c.name === cityName);
};
