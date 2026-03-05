'use client'
import Image from "next/image"

const ExploreBtn = () => {
    return (
        <button onClick={ () => console.log('Click')} type="button" id="explore-btn" className="mt-7 mx-auto text-center">
            <a href="#events">Explore Events
                <Image src="/icons/arrow-down.svg" alt="arrow-down" width={20} height={20} />
            </a>

        </button>
    )
}

export default ExploreBtn