import React, { useState } from 'react';

const FinOpsCalculator = () => {
  // --- STATE FOR SLIDERS ---
  const [staticServers, setStaticServers] = useState(5);
  const [prsPerMonth, setPrsPerMonth] = useState(100);
  const [hoursPerPr, setHoursPerPr] = useState(2);

  // --- CONSTANTS ---
  const hoursInMonth = 730;
  const odHourly = 0.0104; // $0.0104/hr for t3.micro On-Demand
  const spotHourly = 0.0043; // $0.0043/hr for t3.micro Spot

  // --- MATH CALCS ---
  const traditionalCost = staticServers * hoursInMonth * odHourly;
  const velzionCost = prsPerMonth * hoursPerPr * spotHourly;
  const totalSavings = traditionalCost - velzionCost;
  const savingsPercent = ((totalSavings / traditionalCost) * 100).toFixed(1);

  // --- INLINE STYLES (Clean & Modern) ---
  const styles = {
    container: { maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', color: '#e2e8f0' },
    card: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
    header: { textAlign: 'center', marginBottom: '30px', color: '#f8fafc' },
    sliderGroup: { marginBottom: '25px' },
    label: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '10px' },
    input: { width: '100%', cursor: 'pointer', accentColor: '#3b82f6' },
    resultsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' },
    resultBox: { backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #334155' },
    heroBox: { backgroundColor: '#10b981', padding: '20px', borderRadius: '8px', textAlign: 'center', color: '#fff', gridColumn: 'span 2' },
    money: { fontSize: '2rem', fontWeight: 'bold', margin: '10px 0 0 0' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.header}>💰 Velzion FinOps ROI Calculator</h1>
        <p style={{textAlign: 'center', marginBottom: '30px', color: '#94a3b8'}}>
          Compare traditional 24/7 staging environments to Velzion's ephemeral Zero-CI Spot architecture.
        </p>

        {/* --- SLIDERS --- */}
        <div style={styles.sliderGroup}>
          <div style={styles.label}>
            <span>Static Staging Servers (Running 24/7)</span>
            <span style={{color: '#ef4444'}}>{staticServers} Servers</span>
          </div>
          <input type="range" min="1" max="50" value={staticServers} onChange={(e) => setStaticServers(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.sliderGroup}>
          <div style={styles.label}>
            <span>Pull Requests Reviewed per Month</span>
            <span style={{color: '#3b82f6'}}>{prsPerMonth} PRs</span>
          </div>
          <input type="range" min="10" max="1000" value={prsPerMonth} onChange={(e) => setPrsPerMonth(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.sliderGroup}>
          <div style={styles.label}>
            <span>Avg. Hours per PR Preview (Before Teardown)</span>
            <span style={{color: '#8b5cf6'}}>{hoursPerPr} Hours</span>
          </div>
          <input type="range" min="1" max="24" value={hoursPerPr} onChange={(e) => setHoursPerPr(e.target.value)} style={styles.input} />
        </div>

        {/* --- RESULTS DASHBOARD --- */}
        <div style={styles.resultsGrid}>
          <div style={styles.resultBox}>
            <div style={{color: '#94a3b8', fontSize: '0.9rem'}}>Traditional Monthly Cost</div>
            <h3 style={{...styles.money, color: '#ef4444'}}>${traditionalCost.toFixed(2)}</h3>
          </div>
          
          <div style={styles.resultBox}>
            <div style={{color: '#94a3b8', fontSize: '0.9rem'}}>Velzion Monthly Cost</div>
            <h3 style={{...styles.money, color: '#3b82f6'}}>${velzionCost.toFixed(2)}</h3>
          </div>

          <div style={styles.heroBox}>
            <div style={{fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Total Monthly Savings</div>
            <h2 style={{fontSize: '3rem', margin: '10px 0'}}>
              ${totalSavings.toFixed(2)} <span style={{fontSize: '1.5rem'}}>({savingsPercent}%)</span>
            </h2>
            <p style={{margin: 0, fontSize: '0.9rem', opacity: 0.9}}>By eliminating idle zombie servers and leveraging AWS Spot pricing.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinOpsCalculator;