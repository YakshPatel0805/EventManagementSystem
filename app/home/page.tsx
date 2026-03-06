'use client';

import { useEffect, useState } from 'react';
import EventCard from "@/components/EventCard";
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEventsRequest, loadMoreEventsSuccess } from '@/store/slices/eventsSlice';

const HomePage = () => {
    const { user, loading: authLoading } = useAuth();
    const dispatch = useAppDispatch();
    const { events, loading, pagination } = useAppSelector(state => state.events);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const pageSize = 9;

    useEffect(() => {
        if (!authLoading && user) {
            dispatch(fetchEventsRequest({ limit: pageSize }));
        }
    }, [user, authLoading, dispatch, pageSize]);

    const loadMore = async () => {
        if (!pagination.hasMore || !pagination.nextCursor) return;

        try {
            const response = await fetch(`/api/events/with-pending?limit=${pageSize}&cursor=${pagination.nextCursor}`);
            const data = await response.json();
            if (data.success) {
                dispatch(loadMoreEventsSuccess({
                    events: data.data,
                    pagination: data.pagination
                }));
            }
        } catch (error) {
            console.error('Failed to load more events:', error);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await fetch(`/api/events/search?q=${encodeURIComponent(query)}&limit=20`);
            const data = await response.json();
            if (data.success) {
                setSearchResults(data.data);
            }
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const displayEvents = searchQuery.trim() ? searchResults : events;
    const isSearching = searchQuery.trim().length > 0;

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <section>
            <h1 className="text-center">The Place for every Individuals</h1>
            <p className="text-center mt-5">Connect with each-other, share knowledge, and grow together.</p>

            <div className="mt-20 space-y-7">
                <div className="flex items-center justify-between mt-12 mb-8">

                    {/* Left Side */}
                    <div>
                        <p className="text-4xl font-semibold">Events For Individuals</p>
                    </div>

                    {/* Right Side */}
                    <div className="max-w-md w-full">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search events by name, description, or venue..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full px-6 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none text-gray-100 placeholder-gray-100"
                            />

                            {searchLoading && (
                                <div className="absolute right-4 top-3.5">
                                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                                </div>
                            )}

                            {!searchLoading && (
                                <svg
                                    className="absolute right-4 top-3.5 w-5 h-5 text-gray-100"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>

                </div>

                {displayEvents.length === 0 ? (
                    <p className="text-center text-gray-100">
                        {isSearching ? 'No events found matching your search.' : 'No events available at the moment.'}
                    </p>
                ) : (
                    <>
                        <ul className="events">
                            {displayEvents.map((event) => (
                                <li key={event._id}>
                                    <EventCard
                                        id={event._id}
                                        title={event.title}
                                        description={event.description}
                                        image={event.image || ''}
                                        time={event.time || ''}
                                        venue={event.venue || ''}
                                        date={new Date(event.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        capacity={event.capacity}
                                        bookedSeats={event.bookedSeats}
                                        pendingSeats={event.pendingSeats}
                                    />
                                </li>
                            ))}
                        </ul>
                        {!isSearching && pagination.hasMore && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={loadMore}
                                    className="bg-primary hover:bg-primary/90 text-black font-semibold py-2 px-6 rounded-lg transition"
                                >
                                    Load More Events
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default HomePage;
