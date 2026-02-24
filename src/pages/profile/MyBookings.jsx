import React from 'react';
import { useNavigate } from 'react-router-dom';
import MyApplications from '../../components/profile/MyApplications';

const MyBookings = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif text-[#2C3E30] mb-8">My Bookings</h2>
            <MyApplications navigate={navigate} />
        </div>
    );
};

export default MyBookings;
