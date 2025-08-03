import countriesAndCities from './countries-and-cities.json' assert { type: 'json' };

export type CityData = {
  name: string;
  lat: number;
  lng: number;
  population: number;
};

export const majorCities = countriesAndCities.flatMap(country => country.cities);
// Function to get a random city
export function getRandomCity(): CityData {
  return majorCities[Math.floor(Math.random() * majorCities.length)];
}

// Function to get cities by country
export function getCitiesByCountry(iso2: string): CityData[] {
  return countriesAndCities.filter(country => country.iso2 === iso2).flatMap(country => country.cities);
}

// Function to get a random city from a specific country
export function getRandomCityByCountry(country: string): CityData | null {
  const cities = getCitiesByCountry(country);
  return cities.length > 0 ? cities[Math.floor(Math.random() * cities.length)] : null;
}

// Function to get all unique countries
export function getUniqueCountries(): string[] {
  return [...new Set(countriesAndCities.map(country => country.iso2 as string))];
} 