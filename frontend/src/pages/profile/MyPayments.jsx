import React from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentHistory from '../../components/profile/PaymentHistory'; // Updated path

const MyPayments = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif text-[#2C3E30] mb-8">Payment History</h2>
            <PaymentHistory />
        </div>
    );
};

export default MyPayments;
