import React, { useState, useEffect } from 'react';

const Battery = ({ charge }) => {
    const [batteryLevel, setBatteryLevel] = useState(0);

    useEffect(() => {
        setBatteryLevel(charge);
    }, [charge]);

    return (
        <div className="battery-container">
            <div className="battery-level" style={{ height: `${batteryLevel}%` }}>
                <div className="battery-status">{batteryLevel}%</div>
            </div>
        </div>
    );
};

export default Battery;