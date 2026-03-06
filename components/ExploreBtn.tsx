'use client'
import { ArrowDown } from "lucide-react";

const ExploreBtn = () => {
    return (
        <button onClick={() => console.log('Click')} type="button" id="explore-btn" className="mt-7 mx-auto text-center">
            <a href="#events">Explore Events
                <ArrowDown />
            </a>

        </button>
    )
}

export default ExploreBtn