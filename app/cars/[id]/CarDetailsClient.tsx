import Image from 'next/image';
import { Car } from '@/types/cars';
import css from './CarDetailsClient.module.css';
import { TfiLocationPin } from 'react-icons/tfi';
import { PiCheckCircle, PiRoadHorizon } from 'react-icons/pi';
import { BsCalendar2Week, BsCarFront, BsFuelPump, BsGear } from 'react-icons/bs';


interface CarDetailsClientProps {
  car: Car;
}

export default async function CarDetailsClient({ car }: CarDetailsClientProps) {
  return (
    <div className={`container ${css.carContainer}`}>
      <div className={css.carImg}>
        <div className={css.carImgWrapper}>
          <Image
            src={car.img}
            alt={`${car.brand} ${car.model}, ${car.year}`}
            fill
            sizes="(min-width: 1232px) 640px, (min-width: 768px) 352px, 343px"
            loading="eager"
            priority
            decoding="async"
          />
        </div>
      </div>
      <div className={css.carInfoCard}>
        <section className={css.headerSection}>
          <div className={css.header}>
            <h1>
              {car.brand} {car.model}, {car.year}
            </h1>
            <span className={css.headerArticle}>
              Article: {car.img.split('/')?.pop()?.split('-')[0]}
            </span>
          </div>
          <p className={css.headerLocation}>
            <TfiLocationPin />
            <span>{`${car.location.city}, ${car.location.country}`}</span>
          </p>
          <p className={css.headerPrice}>${car.rentalPrice}</p>
          <p className={css.headerDescription}>{car.description}</p>
        </section>
        <section className={css.conditionsSection}>
          <h2 className={css.listTitle}>Rental Conditions: </h2>
          <ul className={css.list}>
            {car.rentalConditions.map((condition, index) => (
              <li className={css.listItem} key={index}>
                <PiCheckCircle />
                {condition}
              </li>
            ))}
          </ul>
        </section>
        <section className={css.specificationsSection}>
          <h2 className={css.listTitle}>Car Specifications: </h2>
          <ul className={css.list}>
            <li className={css.listItem}>
              <BsCalendar2Week />
              {car.year}
            </li>
            <li className={css.listItem}>
              <BsCarFront />
              {car.type}
            </li>
            <li className={css.listItem}>
              <BsFuelPump />
              {car.fuelConsumption}
            </li>
            <li className={css.listItem}>
              <BsGear />
              {car.engine}
            </li>
            <li className={css.listItem}>
              <PiRoadHorizon />
              {car.mileage} km
            </li>
          </ul>
        </section>
        <section className={css.featuresSection}>
          <h2 className={css.listTitle}>Features</h2>
          <ul className={css.list}>
            {car.features.map((feature, index) => (
              <li className={css.listItem} key={index}>
                <PiCheckCircle />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className={css.carBookingForm}></div>
    </div>
  );
}
