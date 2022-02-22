import { useState, useEffect, useCallback } from 'react';

const useAlertNotification = (countAlerts) => {
  const [alerts, setAlerts] = useState(0);
  const [active, setActive] = useState(false);
  const [soundStatus, setSoundStatus] = useState('STOPPED');
  const [color, setColor] = useState('blue');
  const [colorInterval, setColorInterval] = useState();
  const [soundInterval, setSoundInterval] = useState();

  const handleActive = () => {
    let interval = setInterval(() => {
      setColor((prev) => (prev === 'blue' ? 'red' : 'blue'));
    }, 500);
    setColorInterval(interval);
    setSoundStatus('PLAYING'); //play when alerts triggers then repeat every min
    const interval2 = setInterval(() => {
      setSoundStatus('PLAYING');
    }, 60000);
    setSoundInterval(interval2);
  };

  const handleDeactive = useCallback(() => {
    setColor('blue');
    clearInterval(colorInterval);
    clearInterval(soundInterval);
  }, [colorInterval, soundInterval]);

  const onFinish = () => {
    setSoundStatus('STOPPED');
  };

  useEffect(() => {
    if (countAlerts > 0) {
      setActive(true);
      if (!active) {
        handleActive();
      }
    } else {
      setActive(false);
    }
    setAlerts(countAlerts);
  }, [alerts, countAlerts, active]);

  useEffect(() => {
    if (!active) {
      handleDeactive();
    }
  }, [active, handleDeactive]);

  return {
    active,
    color,
    soundStatus,
    onFinish,
  };
};

export default useAlertNotification;
