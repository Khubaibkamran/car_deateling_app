// Dropdown choices for the Add Vehicle form. Replace with API data once the backend serves them.

const MODELS_BY_MAKE: Record<string, string[]> = {
  bmw: ['M4 Series', '3 Series', '5 Series', 'X3', 'X5', 'M3'],
  hyundai: ['Creta', 'Elantra', 'Tucson', 'Santa Fe', 'i20', 'Venue'],
  toyota: ['Corolla', 'Camry', 'Supra', 'RAV4', 'Land Cruiser', 'Yaris'],
  honda: ['Civic', 'Accord', 'CR-V', 'City', 'HR-V'],
  volvo: ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60'],
  mercedes: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class'],
  audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
  ford: ['Focus', 'Mustang', 'Explorer', 'F-150', 'Fiesta'],
  kia: ['Seltos', 'Sportage', 'Sorento', 'Rio', 'Carnival'],
  nissan: ['Altima', 'Sentra', 'Rogue', 'X-Trail', 'Patrol'],
};

const GENERIC_MODELS = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Pickup Truck', 'Van', 'Other'];

export function modelsForMake(make: string): string[] {
  const key = make.trim().toLowerCase().replace(/[-\s]*benz$/, '');
  return MODELS_BY_MAKE[key] ?? GENERIC_MODELS;
}

export function yearOptions(): string[] {
  const now = new Date().getFullYear() + 1;
  return Array.from({ length: now - 1989 }, (_, i) => String(now - i));
}

export const COLOR_OPTIONS = [
  'Black',
  'White',
  'Silver',
  'Grey',
  'Red',
  'Blue',
  'Green',
  'Orange',
  'Yellow',
  'Brown',
  'Beige',
  'Other',
];
