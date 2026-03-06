import Link from "next/link"
import Image from "next/image"
import { Clock, Calendar, MapPinned, Users } from 'lucide-react'

interface Props {
    id: string;
    title: string;
    description: string;
    image: string;
    time: string;
    venue: string;
    date: string;
    capacity: number;
    bookedSeats: number;
    pendingSeats?: number;
}

const EventCard = ({ id, title, description, image, venue, time, date, capacity, bookedSeats, pendingSeats = 0 }: Props) => {
    const availableSeats = capacity - bookedSeats;

    return (
        <Link href={`/events/${id}`} id="event-card">
            <Image src={image} alt={title} width={410} height={300} className="poster" />

            <div className="flex text-gray-100 flex-row gap-2">
                < MapPinned />
                <p>{venue}</p>
            </div>
            <p className="title text-gray-100">{title}</p>
            <p className="text-sm text-gray-100 line-clamp-2 mt-1">{description}</p>
            <div className="datetime text-gray-100">
                <div className="flex flex-row text-gray-100 gap-2">
                    < Calendar />
                    <p>{date}</p>
                </div>
                <div className="flex text-gray-100 flex-row gap-2">
                    <Clock />
                    <p>{time}</p>
                </div>
            </div>
            <div className="flex text-gray-100 flex-row gap-2 mt-2">
                < Users />
                <p className="text-sm text-gray-100">
                    {availableSeats} seats available{pendingSeats > 0 ? ` and ${pendingSeats} on hold` : ''}
                </p>
            </div>
        </Link>
    )
}

export default EventCard
