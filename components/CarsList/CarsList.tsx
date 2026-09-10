import type { Car } from '@/types/cars';
import CarCard from '@/components/CarCard/CarCard';
import css from './CarsList.module.css';

interface CarsListProps {
  cars: Car[];
}

export default function CarsList({ cars }: CarsListProps) {
  return (
    <ul className={css.list}>
      {cars.map(car => (
        <li key={car.id}>
          <CarCard car={car} />
        </li>
      ))}
    </ul>
  );
}
