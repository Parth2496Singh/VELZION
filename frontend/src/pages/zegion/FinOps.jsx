import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  Server, 
  Cloud, 
  Rocket, 
  DollarSign,
  Calculator,
  ChevronDown,
  Activity
} from 'lucide-react';

export default function FinOpsCalculator() {
  // ==========================================
  // 1. THE 4-SLIDER "AGGRESSIVE TTL" STATE
  // ==========================================
  const [prsPerMonth, setPrsPerMonth] = useState(100);
  const [standardLifespanDays, setStandardLifespanDays] = useState(4); // Drives Competitor Cost
  const [activeHoursPerPr, setActiveHoursPerPr] = useState(2);         // Drives Zegion Spot Compute
  const [strictTtlHours, setStrictTtlHours] = useState(4);             // Drives Zegion EBS Storage

  const [showDetailedAudit, setShowDetailedAudit] = useState(false);

  // ==========================================
  // 2. BULLETPROOF FINOPS MATH
  // ==========================================
  // Base AWS Pricing (us-east-1)
  const odHourly = 0.0104;   // t3.micro On-Demand Compute
  const spotHourly = 0.0043; // t3.micro Spot Compute
  const ebsHourly = 0.0022;  // 20GB gp3 Volume ($0.08/GB/mo)

  // -- 1. Standard CI/CD Math (The Competitor) --
  const standardPrHours = standardLifespanDays * 24;
  const standardComputeCost = prsPerMonth * standardPrHours * odHourly;
  const standardEbsCost = prsPerMonth * standardPrHours * ebsHourly;
  const competitorTotalCost = standardComputeCost + standardEbsCost;

  // -- 2. Zegion Math (Aggressive TTL & Event-Driven) --
  const zegionTotalActiveHours = prsPerMonth * activeHoursPerPr;
  const zegionComputeCost = zegionTotalActiveHours * spotHourly;
  
  const zegionTotalTtlHours = prsPerMonth * strictTtlHours;
  const zegionEbsCost = zegionTotalTtlHours * ebsHourly;
  
  const velzionTotalCost = zegionComputeCost + zegionEbsCost;

  // -- 3. Savings Math --
  const totalSavings = Math.max(0, competitorTotalCost - velzionTotalCost);
  const savingsPercent = competitorTotalCost > 0 
    ? ((totalSavings / competitorTotalCost) * 100).toFixed(1) 
    : "0.0";

  // -- 4. Waste Calculation (For Audit Table) --
  const idleComputeHoursWasted = Math.max(0, (prsPerMonth * standardPrHours) - zegionTotalActiveHours);
  const idleStorageHoursWasted = Math.max(0, (prsPerMonth * standardPrHours) - zegionTotalTtlHours);

  // Visual Bar Chart Math
  const maxBarCost = Math.max(competitorTotalCost, velzionTotalCost, 0.01);
  const competitorWidth = `${(competitorTotalCost / maxBarCost) * 100}%`;
  const velzionWidth = `${(velzionTotalCost / maxBarCost) * 100}%`;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Scoped CSS for Range Sliders & Tooltips 
        Keeping this minimal to avoid React inline-style complexity on psuedo-elements 
      */}
      <style>{`
        .vz-range { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); outline: none; transition: 0.2s; margin-top: 10px;}
        .vz-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; transition: 0.2s; }
        .vz-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
        
        .range-purple::-webkit-slider-thumb { background: var(--zg-purple-core); box-shadow: 0 0 15px var(--zg-purple-glow); }
        .range-red::-webkit-slider-thumb { background: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); }
        .range-emerald::-webkit-slider-thumb { background: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }
        .range-amber::-webkit-slider-thumb { background: #f59e0b; box-shadow: 0 0 15px rgba(245, 158, 11, 0.4); }

        .tooltip-container { position: relative; display: inline-flex; align-items: center; gap: 8px; cursor: help; }
        .tooltip-icon { color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: 0.2s; flex-shrink: 0;}
        .tooltip-container:hover .tooltip-icon { color: var(--zg-purple-core); }
        .tooltip-text { 
          visibility: hidden; width: 280px; background: var(--bg-surface); backdrop-filter: blur(8px); 
          color: var(--text-pure); text-align: left; border-radius: var(--radius-sm); padding: 14px; 
          font-size: 0.85rem; font-weight: 500; line-height: 1.5; position: absolute; z-index: 100; 
          bottom: 130%; left: 0%; opacity: 0; transition: opacity 0.3s; border: var(--border-subtle); 
          box-shadow: var(--shadow-void); 
        }
        .tooltip-container:hover .tooltip-text { visibility: visible; opacity: 1; }
        
        .lifecycle-step { display: flex; gap: 24px; margin-bottom: 30px; position: relative; }
        .lifecycle-step::before { content: ''; position: absolute; left: 24px; top: 50px; bottom: -30px; width: 2px; background: var(--border-subtle); }
        .lifecycle-step:last-child::before { display: none; }
      `}</style>

      {/* ========================================== */}
      {/* HEADER                                     */}
      {/* ========================================== */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--text-pure)', margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Calculator size={36} style={{ color: 'var(--zg-purple-core)' }} />
          FinOps ROI Calculator
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>
          Model the financial impact of adopting Zegion's Strict TTL and Event-Driven Spot Architecture.
        </p>
      </motion.div>

      {/* ========================================== */}
      {/* INTERACTIVE CALCULATOR CARD                */}
      {/* ========================================== */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: '3rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          
          {/* Slider 1: PRs Per Month */}
          <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: '1 / -1', background: 'var(--bg-void)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ color: 'var(--text-pure)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Pull Requests per Month</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Total ephemeral environments provisioned monthly.</p>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: 'var(--zg-purple-core)', background: 'var(--zg-purple-glow)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                {prsPerMonth} PRs
              </span>
            </div>
            <input type="range" min="10" max="500" step="5" value={prsPerMonth} onChange={(e) => setPrsPerMonth(e.target.value)} className="vz-range range-purple" />
          </div>

          {/* Slider 2: Standard CI/CD Lifespan */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-void)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div className="tooltip-container">
                <span style={{ color: 'var(--text-pure)', fontWeight: 700 }}>Standard PR Lifespan</span>
                <span className="tooltip-icon"><Info size={16}/></span>
                <span className="tooltip-text"><strong style={{color: '#ef4444'}}>The Competitor:</strong> Standard CI/CD providers leave instances running 24/7 until the code is actually merged or closed.</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#ef4444' }}>{standardLifespanDays} Days</span>
            </div>
            <input type="range" min="1" max="14" step="1" value={standardLifespanDays} onChange={(e) => setStandardLifespanDays(e.target.value)} className="vz-range range-red" />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '1rem 0 0 0' }}>Drives standard 24/7 On-Demand compute + storage waste.</p>
          </div>

          {/* Slider 3: Zegion Active Time */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-void)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div className="tooltip-container">
                <span style={{ color: 'var(--text-pure)', fontWeight: 700 }}>Zegion Active Testing Time</span>
                <span className="tooltip-icon"><Info size={16}/></span>
                <span className="tooltip-text"><strong style={{color: '#10b981'}}>Zegion Engine:</strong> Thanks to Auto-Sleep, Compute billing is limited ONLY to the hours a developer actively tests the live URL.</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#10b981' }}>{activeHoursPerPr}h</span>
            </div>
            <input type="range" min="0.5" max="12" step="0.5" value={activeHoursPerPr} onChange={(e) => setActiveHoursPerPr(e.target.value)} className="vz-range range-emerald" />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '1rem 0 0 0' }}>Drives active Spot Instance runtime billing.</p>
          </div>

          {/* Slider 4: Zegion Strict TTL */}
          <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: '1 / -1', background: 'var(--bg-void)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div className="tooltip-container">
                <span style={{ color: 'var(--text-pure)', fontWeight: 700 }}>Zegion Strict TTL Teardown</span>
                <span className="tooltip-icon"><Info size={16}/></span>
                <span className="tooltip-text"><strong style={{color: '#f59e0b'}}>Zegion Engine:</strong> To prevent EBS volume waste, Zegion enforces a strict Time-To-Live. After this many hours, the dormant environment is mercilessly destroyed.</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f59e0b' }}>{strictTtlHours}h</span>
            </div>
            <input type="range" min="1" max="48" step="1" value={strictTtlHours} onChange={(e) => setStrictTtlHours(e.target.value)} className="vz-range range-amber" />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '1rem 0 0 0' }}>Drives the maximum lifespan of the dormant EBS Storage volume before destruction.</p>
          </div>
        </div>

        {/* --- RESULTS DASHBOARD --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--bg-void)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="tooltip-container" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>
              Standard CI/CD Cost <span className="tooltip-icon"><Info size={14}/></span>
              <span className="tooltip-text">Calculated as {prsPerMonth} environments running continuously for {standardLifespanDays} days using On-Demand Compute + EBS Pricing.</span>
            </div>
            <h3 style={{ fontFamily: 'monospace', fontSize: '2.5rem', fontWeight: 800, margin: 0, color: '#ef4444' }}>${competitorTotalCost.toFixed(2)}</h3>
          </div>
          
          <div style={{ background: 'var(--bg-void)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="tooltip-container" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>
              Zegion Ephemeral Cost <span className="tooltip-icon"><Info size={14}/></span>
              <span className="tooltip-text"><strong>The Breakdown:</strong><br/><br/>Spot Compute (Active Hrs): ${(zegionComputeCost).toFixed(2)}<br/>EBS Storage (TTL Hrs): ${(zegionEbsCost).toFixed(2)}</span>
            </div>
            <h3 style={{ fontFamily: 'monospace', fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--zg-purple-core)' }}>${velzionTotalCost.toFixed(2)}</h3>
          </div>

          <div style={{ gridColumn: 'span 2', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', padding: '2.5rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: '#10b981', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Total Monthly Savings</span>
            <h2 style={{ color: 'var(--text-pure)', fontSize: '3.5rem', fontWeight: 800, margin: '0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              ${totalSavings.toFixed(2)} 
              <span style={{ fontSize: '1.5rem', opacity: 0.8, fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center' }}>
                <Activity size={24} style={{ marginRight: '0.5rem' }}/> {savingsPercent}% ROI
              </span>
            </h2>
          </div>
        </div>

        {/* --- DETAILED FINOPS AUDIT --- */}
        <button 
          onClick={() => setShowDetailedAudit(!showDetailedAudit)}
          style={{ width: '100%', padding: '1.25rem', marginTop: '2rem', background: showDetailedAudit ? 'var(--bg-void)' : 'transparent', border: '1px dashed var(--border-subtle)', color: showDetailedAudit ? 'var(--text-pure)' : 'var(--text-muted)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, transition: 'all var(--transition-fast)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
          {showDetailedAudit ? 'Hide Detailed FinOps Audit' : 'View Detailed Compute & Storage Waste Analysis'}
          <ChevronDown size={18} style={{ transform: showDetailedAudit ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-smooth)' }} />
        </button>
        
        <AnimatePresence>
          {showDetailedAudit && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ background: 'var(--bg-void)', borderRadius: 'var(--radius-sm)', border: 'var(--border-subtle)', marginTop: '1.5rem', padding: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '1rem', borderBottom: 'var(--border-subtle)', color: 'var(--text-pure)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Billing Line Item</th>
                      <th style={{ padding: '1rem', borderBottom: 'var(--border-subtle)', color: 'var(--text-pure)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Hours</th>
                      <th style={{ padding: '1rem', borderBottom: 'var(--border-subtle)', color: 'var(--text-pure)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Hourly Rate</th>
                      <th style={{ padding: '1rem', borderBottom: 'var(--border-subtle)', color: 'var(--text-pure)', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>Standard CI/CD Compute (On-Demand 24/7)</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>{(prsPerMonth * standardPrHours).toLocaleString()} hrs</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>${odHourly.toFixed(4)}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>${standardComputeCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>Standard CI/CD Storage (EBS 24/7)</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>{(prsPerMonth * standardPrHours).toLocaleString()} hrs</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>${ebsHourly.toFixed(4)}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>${standardEbsCost.toFixed(2)}</td>
                    </tr>
                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-pure)', fontWeight: 700 }}>Total Competitor Run Rate</td>
                      <td style={{ padding: '1rem' }}></td><td style={{ padding: '1rem' }}></td>
                      <td style={{ padding: '1rem', color: '#ef4444', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>${competitorTotalCost.toFixed(2)}</td>
                    </tr>
                    <tr><td colSpan="4" style={{ height: '1rem' }}></td></tr>
                    <tr>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>Zegion Compute (Active Spot Usage)</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>{zegionTotalActiveHours.toLocaleString()} hrs</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--zg-purple-core)' }}>${spotHourly.toFixed(4)}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>${zegionComputeCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>Zegion Storage (EBS Limited by TTL)</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>{zegionTotalTtlHours.toLocaleString()} hrs</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>${ebsHourly.toFixed(4)}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>${zegionEbsCost.toFixed(2)}</td>
                    </tr>
                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-pure)', fontWeight: 700 }}>Total Zegion Run Rate</td>
                      <td style={{ padding: '1rem' }}></td><td style={{ padding: '1rem' }}></td>
                      <td style={{ padding: '1rem', color: 'var(--zg-purple-core)', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>${velzionTotalCost.toFixed(2)}</td>
                    </tr>
                    <tr><td colSpan="4" style={{ height: '1rem' }}></td></tr>
                    <tr style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                      <td colSpan="3" style={{ padding: '1rem', color: '#ef4444', fontWeight: 700 }}>Idle Compute Hours Prevented (Waste vs Actual Use)</td>
                      <td style={{ padding: '1rem', color: '#ef4444', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>-{idleComputeHoursWasted.toLocaleString()} hrs</td>
                    </tr>
                    <tr style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                      <td colSpan="3" style={{ padding: '1rem', color: '#f59e0b', fontWeight: 700 }}>Idle Storage Hours Prevented (Waste vs TTL)</td>
                      <td style={{ padding: '1rem', color: '#f59e0b', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>-{idleStorageHoursWasted.toLocaleString()} hrs</td>
                    </tr>
                    <tr style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                      <td colSpan="3" style={{ padding: '1rem', color: '#10b981', fontWeight: 700 }}>Total Financial Impact</td>
                      <td style={{ padding: '1rem', color: '#10b981', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>-${totalSavings.toFixed(2)}/mo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- VISUAL BAR CHART --- */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: 'var(--border-subtle)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
            <span style={{ width: '160px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Standard CI/CD</span>
            <div style={{ flex: 1, height: '28px', background: 'var(--bg-void)', borderRadius: '14px', border: 'var(--border-subtle)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: competitorWidth }} transition={{ duration: 1, ease: 'easeOut' }} style={{ height: '100%', background: 'linear-gradient(90deg, #7f1d1d, #ef4444)', borderRadius: '14px' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="tooltip-container" style={{ width: '160px', fontSize: '0.8rem', color: 'var(--zg-purple-core)', fontWeight: 600, textTransform: 'uppercase' }}>
              Zegion Engine <span className="tooltip-icon"><Info size={14}/></span>
              <span className="tooltip-text">Visualizes the cost of Ephemeral Spot Compute + TTL Storage relative to standard pipelines.</span>
            </div>
            <div style={{ flex: 1, height: '28px', background: 'var(--bg-void)', borderRadius: '14px', border: 'var(--border-subtle)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: velzionWidth }} transition={{ duration: 1, ease: 'easeOut' }} style={{ height: '100%', background: 'linear-gradient(90deg, #4c1d95, var(--zg-purple-core))', borderRadius: '14px' }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* ARCHITECTURE EVOLUTION CARDS               */}
      {/* ========================================== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '5rem' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--text-pure)', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>The Evolution of Preview Environments</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>Why traditional CI/CD pipelines fail at cost optimization.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #ef4444' }}>
            <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-void)', border: 'var(--border-subtle)', color: 'var(--text-pure)' }}><Server size={24} /></div>
            <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-pure)', fontSize: '1.25rem' }}>1. Legacy Staging</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>The traditional approach. A dedicated staging server shared by the entire team, running on-demand 24/7 regardless of usage.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.5rem' }}><span style={{ color: '#ef4444', fontWeight: 'bold' }}>✗</span> Billed 730 hours per month constantly</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.5rem' }}><span style={{ color: '#ef4444', fontWeight: 'bold' }}>✗</span> Expensive On-Demand pricing tier</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d1d5db' }}><span style={{ color: '#ef4444', fontWeight: 'bold' }}>✗</span> High risk of merge queue conflicts</div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #f59e0b' }}>
            <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-void)', border: 'var(--border-subtle)', color: 'var(--text-pure)' }}><Cloud size={24} /></div>
            <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-pure)', fontSize: '1.25rem' }}>2. Standard Ephemeral</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Modern CI/CD spins up a unique environment for every PR, but abandons them running idle until the PR is merged days later.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.5rem' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Isolated testing environment per PR</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.5rem' }}><span style={{ color: '#ef4444', fontWeight: 'bold' }}>✗</span> Rampant idle cloud waste over weekends</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d1d5db' }}><span style={{ color: '#ef4444', fontWeight: 'bold' }}>✗</span> Often relies on On-Demand nodes</div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--zg-purple-core)', background: 'linear-gradient(180deg, var(--zg-purple-glow) 0%, var(--bg-surface) 100%)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-void)', border: '1px solid var(--zg-purple-border)', color: 'var(--zg-purple-core)' }}><Rocket size={24} /></div>
            <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--zg-purple-core)', fontSize: '1.25rem' }}>3. Zegion Architecture</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>State-aware infrastructure utilizing Strict TTLs, Spot instances, and intelligent auto-hibernation to eliminate idle burn.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.5rem' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>60% Spot Discount</strong> applied natively</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.5rem' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>Strict TTL:</strong> Mercilessly culls dormant EBS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.5rem' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>ChatOps:</strong> /zegion wake via GitHub</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d1d5db' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>Self-Healing:</strong> Auto-replaces dead Spot nodes</div>
          </div>
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* ZEGION LIFECYCLE DEEP DIVE                 */}
      {/* ========================================== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel" style={{ marginTop: '5rem', padding: '3rem', background: 'var(--bg-void)' }}>
        <h3 style={{ color: 'var(--text-pure)', fontSize: '1.75rem', marginTop: 0, marginBottom: '2.5rem', textAlign: 'center', fontWeight: 800 }}>Under the Hood: The Aggressive TTL Lifecycle</h3>
        
        <div className="lifecycle-step">
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-void)', border: '2px solid var(--zg-purple-core)', color: 'var(--zg-purple-core)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, zIndex: 2, flexShrink: 0, boxShadow: '0 0 15px var(--zg-purple-glow)' }}>1</div>
          <div>
            <h4 style={{ color: 'var(--text-pure)', margin: '0 0 0.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              PR Opened & Webhook Triggered 
              <span style={{ background: 'var(--zg-purple-glow)', color: 'var(--zg-purple-core)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid var(--zg-purple-border)', fontWeight: 'bold' }}>n8n Engine</span>
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>When a developer opens a Pull Request, GitHub fires a webhook to the n8n orchestration engine. n8n dynamically creates a Terraform workspace, provisions a fresh AWS Spot Instance (saving 60% instantly), and posts the live URL back to GitHub.</p>
          </div>
        </div>

        <div className="lifecycle-step">
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-void)', border: '2px solid var(--zg-purple-core)', color: 'var(--zg-purple-core)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, zIndex: 2, flexShrink: 0, boxShadow: '0 0 15px var(--zg-purple-glow)' }}>2</div>
          <div>
            <h4 style={{ color: 'var(--text-pure)', margin: '0 0 0.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              State-Aware Idle Hibernation 
              <span style={{ background: 'var(--zg-purple-glow)', color: 'var(--zg-purple-core)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid var(--zg-purple-border)', fontWeight: 'bold' }}>FinOps</span>
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>Once the container finishes building, an invisible 10-minute timer begins. If the developer isn't actively reviewing, a Gatekeeper node verifies the EC2 status via the AWS API. If running, it cleanly hibernates the instance, dropping the Compute Run Rate to $0.00/hr while keeping the EBS disk alive.</p>
          </div>
        </div>

        <div className="lifecycle-step">
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-void)', border: '2px solid var(--zg-purple-core)', color: 'var(--zg-purple-core)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, zIndex: 2, flexShrink: 0, boxShadow: '0 0 15px var(--zg-purple-glow)' }}>3</div>
          <div>
            <h4 style={{ color: 'var(--text-pure)', margin: '0 0 0.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              The Strict TTL Enforcement 
              <span style={{ background: 'var(--zg-purple-glow)', color: 'var(--zg-purple-core)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid var(--zg-purple-border)', fontWeight: 'bold' }}>Architecture</span>
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>Rather than letting sleeping EBS disks accumulate costs for days waiting for a merge, Zegion enforces a Strict Time-To-Live. After the designated TTL window expires, n8n executes a ruthless <code>terraform destroy</code>, guaranteeing zero ghost infrastructure is left behind.</p>
          </div>
        </div>

        <div className="lifecycle-step" style={{ marginBottom: 0 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-void)', border: '2px solid var(--zg-purple-core)', color: 'var(--zg-purple-core)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, zIndex: 2, flexShrink: 0, boxShadow: '0 0 15px var(--zg-purple-glow)' }}>4</div>
          <div>
            <h4 style={{ color: 'var(--text-pure)', margin: '0 0 0.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              ChatOps Resumption & DX Fallback 
              <span style={{ background: 'var(--zg-purple-glow)', color: 'var(--zg-purple-core)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid var(--zg-purple-border)', fontWeight: 'bold' }}>Resilience</span>
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>If a developer returns the next day to a destroyed PR, they simply type <code>/zegion provision</code> to rebuild the environment from scratch. We trade 3 minutes of Developer Experience (DX) wait time for 98% guaranteed cloud savings.</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}