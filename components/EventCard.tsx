import Link from "next/link"
import Image from "next/image"

interface Props {
    id: string;
    title: string;
    description: string;
    image: string;
    slug: string;
    time: string;
    venue: string;
    date: string;
    capacity: number;
    bookedSeats: number;
}

const EventCard = ({ id, title, description, image, slug, venue, time, date, capacity, bookedSeats }: Props) => {
    const availableSeats = capacity - bookedSeats;
    
    return (
        <Link href={`/events/${id}`} id="event-card">
            <Image src={image} alt={title} width={410} height={300} className="poster" />

            <div className="flex flex-row gap-2">
                <Image src="/icons/pin.svg" alt="location" width={14} height={14}></Image>
                <p>{venue}</p>
            </div>
            <p className="title">{title}</p>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{description}</p>
            <div className="datetime">
                <div className="flex flex-row gap-2">
                    <Image src="/icons/calendar.svg" alt="date" width={14} height={14}></Image>
                    <p>{date}</p>
                </div>
                <div className="flex flex-row gap-2">
                    <Image src="/icons/clock.svg" alt="time" width={14} height={14}></Image>
                    <p>{time}</p>
                </div>
            </div>
            <div className="flex flex-row gap-2 mt-2">
                <Image src="/icons/audience.svg" alt="seats" width={14} height={14}></Image>
                <p className="text-sm">{availableSeats} seats available</p>
            </div>
        </Link>
    )
}

export default EventCard
