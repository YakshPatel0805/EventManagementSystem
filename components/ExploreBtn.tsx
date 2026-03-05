'use client'
import Image from "next/image"
import { IoArrowDownSharp } from "react-icons/io5";

const ExploreBtn = () => {
    return (
        <button onClick={() => console.log('Click')} type="button" id="explore-btn" className="mt-7 mx-auto text-center">
            <a href="#events">Explore Events
                <Image src="/icons/arrow-down.svg" alt="arrow-down" width={20} height={20} />
                <IoArrowDownSharp />
            </a>

        </button>
    )
}

export default ExploreBtn