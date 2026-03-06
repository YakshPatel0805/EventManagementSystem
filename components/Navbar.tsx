'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header>
            <nav>
                <Link href="/" className='logo'>
                    <Image src="/images/logo.png" alt='logo' width={70} height={60} />
                    <p>DevEvent</p>
                </Link>

                <ul>
                    {user && (
                        <>
                            <Link href="/home">Home</Link>
                            {user.role === 'user' && (
                                <Link href="/users">My Bookings</Link>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <Link href="/admin/home">Dashboard</Link>
                                    <Link href="/admin/create">Create Event</Link>
                                </>
                            )}
                            <span>|</span>
                            <span>{user.name}</span>
                            <button 
                                onClick={logout}
                                className="text-red-400 hover:text-red-300 transition"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
