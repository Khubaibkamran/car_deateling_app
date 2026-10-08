import { Vehicle } from '../types/vehicle';

// Sample vehicles from the design. Replace with data from the backend once it exists.
export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'creta',
    name: 'Hyundai Creta',
    year: '2021',
    color: 'Green',
    plate: 'ABC1234',
    image: require('../../assets/images/home/vehicle-creta.png'),
    imageBox: { left: 5, top: 8, width: 172, height: 94 },
  },
  {
    id: 'bmw',
    name: 'BMW M4 Series',
    year: '2023',
    color: 'Black',
    plate: 'ABC1234',
    image: require('../../assets/images/home/vehicle-bmw.png'),
    imageBox: { left: 0, top: 13, width: 175, height: 94 },
  },
  {
    id: 'corolla',
    name: 'Toyota Corolla',
    year: '2016',
    color: 'Blue',
    plate: 'ABC1234',
    image: require('../../assets/images/home/service-auto.png'),
    imageBox: { left: 6, top: 15, width: 180, height: 77 },
    stretch: true,
  },
];
