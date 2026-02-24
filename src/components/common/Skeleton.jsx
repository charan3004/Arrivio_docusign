import React from 'react';

/**
 * Skeleton shimmer block with sweeping light reflector animation.
 * Usage: <Skeleton className="h-6 w-32" />
 */
const Skeleton = ({ className = '' }) => (
    <div
        className={`relative overflow-hidden bg-[#2C3E30]/[0.07] rounded-lg ${className}`}
    >
        <div className="absolute inset-0 skeleton-shimmer" />
    </div>
);

export default Skeleton;
