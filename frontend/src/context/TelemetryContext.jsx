import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const TelemetryContext = createContext(undefined);

export const TelemetryProvider = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [metrics, setMetrics] = useState({
    cpu: Array(20).fill(0).map(() => Math.floor(Math.random() * 30) + 10),
    ram: Array(20).fill(0).map(() => Math.floor(Math.random() * 20) + 40),
    network: Array(20).fill(0).map(() => Math.floor(Math.random() * 50) + 5),
    costSaved: 1240.50
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: [...prev.cpu.slice(1), Math.floor(Math.random() * 45) + 5],
        ram: [...prev.ram.slice(1), Math.floor(Math.random() * 15) + 45],
        network: [...prev.network.slice(1), Math.floor(Math.random() * 70) + 10],
        costSaved: prev.costSaved + (Math.random() * 0.05)
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const value = useMemo(() => ({ metrics, mousePos, handleMouseMove }), [metrics, mousePos]);

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error("useTelemetry must be used within TelemetryProvider");
  return context;
};
