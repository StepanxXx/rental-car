import { Car } from "@/types/cars";

interface CarDetailsClientProps {
    car: Car;
}

export default async function CarDetailsClient({ car }: CarDetailsClientProps) {
    return (
        <div>
            <h1>Car: {car.brand} {car.model}, {car.year}</h1>
            <p>{car.description}</p>
        </div>
    )
}
    