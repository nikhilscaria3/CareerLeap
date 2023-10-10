import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [daysRemaining, setDaysRemaining] = useState(7);

  useEffect(() => {
    const calculateDaysRemaining = () => {
      // Get the current date
      const currentDate = new Date();

      // // Convert the endDate string to a Date object
      // const endDate = new Date('2023-07-31T12:00:00');
      
      
      const endDate = new Date();
      endDate.setDate(currentDate.getDate() + 7);

    
      // Get the number of days remaining until the end date
      const daysDiff = (endDate - currentDate) / (1000 * 60 * 60 * 24);
      const daysRemaining = Math.floor(daysDiff);

      // Update the daysRemaining state if it's not 0 yet
      if (daysRemaining > 0) {
        setDaysRemaining(daysRemaining);
      }
    };

    // Call the calculateDaysRemaining function initially
    calculateDaysRemaining();

    // Update the countdown every minute
    const interval = setInterval(calculateDaysRemaining, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      Day: {daysRemaining > 0 ? <p>{daysRemaining}</p> : <p>Timer ended!</p>}
    </div>
  );
};

export default CountdownTimer;
