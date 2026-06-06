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
  Activity,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

// ----------------------------------------------------------------------
// FRAMER MOTION: Abstract Ambient Background
// ----------------------------------------------------------------------
const AmbientGlowBackground = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundColor: '#030303' }} />
    <motion.div 
      animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: 'absolute', top: '10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(157, 78, 221, 0.1) 0%, transparent 60%)', filter: 'blur(80px)' }}
    />
    <motion.div 
      animate={{ opacity: [0.15, 0.3, 0.15] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)', filter: 'blur(100px)' }}
    />
  </div>
);

export default function FinOpsCalculator() {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [prsPerMonth, setPrsPerMonth] = useState(100);
  const [standardLifespanDays, setStandardLifespanDays] = useState(4); 
  const [activeHoursPerPr, setActiveHoursPerPr] = useState(2);         
  const [strictTtlHours, setStrictTtlHours] = useState(4);             
  const [showDetailedAudit, setShowDetailedAudit] = useState(false);

  // ==========================================
  // 2. FINOPS MATH ENGINE
  // ==========================================
  const odHourly = 0.0104;   // t3.micro On-Demand Compute
  const spotHourly = 0.0043; // t3.micro Spot Compute
  const ebsHourly = 0.0022;  // 20GB gp3 Volume ($0.08/GB/mo)

  const standardPrHours = standardLifespanDays * 24;
  const standardComputeCost = prsPerMonth * standardPrHours * odHourly;
  const standardEbsCost = prsPerMonth * standardPrHours * ebsHourly;
  const competitorTotalCost = standardComputeCost + standardEbsCost;

  const zegionTotalActiveHours = prsPerMonth * activeHoursPerPr;
  const zegionComputeCost = zegionTotalActiveHours * spotHourly;
  
  const zegionTotalTtlHours = prsPerMonth * strictTtlHours;
  const zegionEbsCost = zegionTotalTtlHours * ebsHourly;
  
  const velzionTotalCost = zegionComputeCost + zegionEbsCost;

  const totalSavings = Math.max(0, competitorTotalCost - velzionTotalCost);
  const savingsPercent = competitorTotalCost > 0 ? ((totalSavings / competitorTotalCost) * 100).toFixed(1) : "0.0";

  const idleComputeHoursWasted = Math.max(0, (prsPerMonth * standardPrHours) - zegionTotalActiveHours);
  const idleStorageHoursWasted = Math.max(0, (prsPerMonth * standardPrHours) - zegionTotalTtlHours);

  const maxBarCost = Math.max(competitorTotalCost, velzionTotalCost, 0.01);
  const competitorWidth = `${(competitorTotalCost / maxBarCost) * 100}%`;
  const velzionWidth = `${(velzionTotalCost / maxBarCost) * 100}%`;

  return (
    <div style={{ position: 'relative', minHeight: '100%', paddingBottom: '4rem' }}>
      <AmbientGlowBackground />
      
      {/* Dynamic CSS Injection for native input styling & tooltips */}
      <style>{`
        .vz-range { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); outline: none; transition: 0.2s; margin-top: 10px;}
        .vz-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; transition: 0.2s; border: 2px solid #fff; }
        .vz-range::-webkit-slider-thumb:hover { transform: scale(1.15); }
        
        .range-purple::-webkit-slider-thumb { background: #e879f9; box-shadow: 0 0 15px rgba(217, 70, 239, 0.5); }
        .range-red::-webkit-slider-thumb { background: #f87171; box-shadow: 0 0 15px rgba(248, 113, 113, 0.5); }
        .range-emerald::-webkit-slider-thumb { background: #34d399; box-shadow: 0 0 15px rgba(52, 211, 153, 0.5); }
        .range-amber::-webkit-slider-thumb { background: #fbbf24; box-shadow: 0 0 15px rgba(251, 191, 36, 0.5); }

        .tooltip-container { position: relative; display: inline-flex; align-items: center; gap: 8px; cursor: help; }
        .tooltip-icon { color: rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; transition: 0.2s; flex-shrink: 0;}
        .tooltip-container:hover .tooltip-icon { color: var(--text-pure); }
        .tooltip-text { 
          visibility: hidden; width: 300px; background: rgba(8, 3, 16, 0.95); backdrop-filter: blur(10px); 
          color: var(--text-pure); text-align: left; border-radius: var(--radius-sm); padding: 16px; 
          font-size: 0.85rem; font-weight: 500; line-height: 1.6; position: absolute; z-index: 100; 
          bottom: 130%; left: 0%; opacity: 0; transition: opacity 0.3s; border: 1px solid rgba(255,255,255,0.1); 
          box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
        }
        .tooltip-container:hover .tooltip-text { visibility: visible; opacity: 1; }
        
        .lifecycle-step { display: flex; gap: 24px; margin-bottom: 30px; position: relative; }
        .lifecycle-step::before { content: ''; position: absolute; left: 24px; top: 50px; bottom: -30px; width: 2px; background: rgba(255,255,255,0.1); }
        .lifecycle-step:last-child::before { display: none; }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* ========================================== */}
        {/* HEADER                                     */}
        {/* ========================================== */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
          <h1 style={{ color: 'var(--text-pure)', margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Calculator size={36} style={{ color: '#e879f9' }} />
            FinOps Analysis
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1.1rem', maxWidth: '700px', lineHeight: 1.6 }}>
            Model the financial impact of adopting event-driven Spot architecture and aggressive resource culling compared to traditional continuous-integration workflows.
          </p>
        </motion.div>

        {/* ========================================== */}
        {/* INTERACTIVE CALCULATOR DASHBOARD           */}
        {/* ========================================== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} 
          style={{ background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', padding: '3rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            
            {/* Slider 1: PRs Per Month */}
            <div style={{ padding: '1.5rem', gridColumn: '1 / -1', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text-pure)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Pull Requests per Month</div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Total ephemeral environments provisioned monthly.</p>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: '#e879f9', background: 'rgba(217, 70, 239, 0.1)', border: '1px solid rgba(217, 70, 239, 0.3)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  {prsPerMonth} PRs
                </span>
              </div>
              <input type="range" min="10" max="500" step="5" value={prsPerMonth} onChange={(e) => setPrsPerMonth(e.target.value)} className="vz-range range-purple" />
            </div>

            {/* Slider 2: Standard CI/CD Lifespan */}
            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="tooltip-container">
                  <span style={{ color: 'var(--text-pure)', fontWeight: 700 }}>Standard PR Lifespan</span>
                  <span className="tooltip-icon"><Info size={16}/></span>
                  <span className="tooltip-text"><strong style={{color: '#f87171'}}>The Competitor:</strong> Standard CI/CD providers leave instances running 24/7 until the code is actually merged or closed.</span>
                </div>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#f87171', background: 'rgba(248, 113, 113, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>{standardLifespanDays} Days</span>
              </div>
              <input type="range" min="1" max="14" step="1" value={standardLifespanDays} onChange={(e) => setStandardLifespanDays(e.target.value)} className="vz-range range-red" />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '1rem 0 0 0' }}>Drives standard 24/7 On-Demand compute waste.</p>
            </div>

            {/* Slider 3: Zegion Active Time */}
            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="tooltip-container">
                  <span style={{ color: 'var(--text-pure)', fontWeight: 700 }}>Zegion Active Testing Time</span>
                  <span className="tooltip-icon"><Info size={16}/></span>
                  <span className="tooltip-text"><strong style={{color: '#34d399'}}>Zegion Engine:</strong> Thanks to Auto-Sleep, Compute billing is limited ONLY to the hours a developer actively tests the live URL.</span>
                </div>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>{activeHoursPerPr}h</span>
              </div>
              <input type="range" min="0.5" max="12" step="0.5" value={activeHoursPerPr} onChange={(e) => setActiveHoursPerPr(e.target.value)} className="vz-range range-emerald" />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '1rem 0 0 0' }}>Drives active Spot Instance runtime billing.</p>
            </div>

            {/* Slider 4: Zegion Strict TTL */}
            <div style={{ padding: '1.5rem', gridColumn: '1 / -1', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="tooltip-container">
                  <span style={{ color: 'var(--text-pure)', fontWeight: 700 }}>Zegion Strict TTL Culling</span>
                  <span className="tooltip-icon"><Info size={16}/></span>
                  <span className="tooltip-text"><strong style={{color: '#fbbf24'}}>Zegion Engine:</strong> To prevent EBS volume waste, Zegion enforces a strict Time-To-Live. After this many hours, the dormant environment is destroyed.</span>
                </div>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>{strictTtlHours}h</span>
              </div>
              <input type="range" min="1" max="48" step="1" value={strictTtlHours} onChange={(e) => setStrictTtlHours(e.target.value)} className="vz-range range-amber" />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '1rem 0 0 0' }}>Drives maximum lifespan of dormant EBS volumes before destruction.</p>
            </div>
          </div>

          {/* --- RESULTS DASHBOARD --- */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="tooltip-container" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.75rem' }}>
                Standard CI/CD Run Rate <span className="tooltip-icon"><Info size={14}/></span>
                <span className="tooltip-text">Calculated as {prsPerMonth} environments running continuously for {standardLifespanDays} days using On-Demand Compute + EBS Pricing.</span>
              </div>
              <h3 style={{ fontFamily: 'monospace', fontSize: '3rem', fontWeight: 800, margin: 0, color: '#f87171' }}>${competitorTotalCost.toFixed(2)}</h3>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="tooltip-container" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.75rem' }}>
                Zegion Infrastructure Cost <span className="tooltip-icon"><Info size={14}/></span>
                <span className="tooltip-text"><strong>The Breakdown:</strong><br/><br/>Spot Compute (Active Hrs): ${(zegionComputeCost).toFixed(2)}<br/>EBS Storage (TTL Hrs): ${(zegionEbsCost).toFixed(2)}</span>
              </div>
              <h3 style={{ fontFamily: 'monospace', fontSize: '3rem', fontWeight: 800, margin: 0, color: '#e879f9', textShadow: '0 0 20px rgba(217, 70, 239, 0.4)' }}>${velzionTotalCost.toFixed(2)}</h3>
            </div>

            <div style={{ gridColumn: 'span 2', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', padding: '3rem', borderRadius: 'var(--radius-md)', boxShadow: 'inset 0 0 30px rgba(16, 185, 129, 0.05)' }}>
              <span style={{ color: '#34d399', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '2px' }}>Total Monthly Capital Saved</span>
              <h2 style={{ color: 'var(--text-pure)', fontSize: '4rem', fontWeight: 800, margin: '0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textShadow: '0 0 20px rgba(52, 211, 153, 0.3)' }}>
                ${totalSavings.toFixed(2)} 
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', background: 'rgba(52, 211, 153, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                  <TrendingDown size={24} style={{ marginRight: '0.5rem' }}/> {savingsPercent}% ROI
                </span>
              </h2>
            </div>
          </div>

          {/* --- DETAILED FINOPS AUDIT --- */}
          <button 
            onClick={() => setShowDetailedAudit(!showDetailedAudit)}
            style={{ width: '100%', padding: '1.25rem', marginTop: '2.5rem', background: showDetailedAudit ? 'rgba(0,0,0,0.5)' : 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: showDetailedAudit ? 'var(--text-pure)' : 'rgba(255,255,255,0.6)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}
          >
            {showDetailedAudit ? 'Collapse Audit Ledger' : 'View Detailed Telemetry & Waste Analysis'}
            <ChevronDown size={18} style={{ transform: showDetailedAudit ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
          </button>
          
          <AnimatePresence>
            {showDetailedAudit && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)', marginTop: '1.5rem', padding: '1.5rem', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Billing Line Item</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Hours</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Hourly Rate</th>
                        <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Competitor Math */}
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>Standard CI/CD Compute (On-Demand 24/7)</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>{(prsPerMonth * standardPrHours).toLocaleString()} hrs</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>${odHourly.toFixed(4)}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>${standardComputeCost.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>Standard CI/CD Storage (EBS 24/7)</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>{(prsPerMonth * standardPrHours).toLocaleString()} hrs</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>${ebsHourly.toFixed(4)}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>${standardEbsCost.toFixed(2)}</td>
                      </tr>
                      <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '1rem', color: 'var(--text-pure)', fontWeight: 700 }}>Total Legacy Run Rate</td>
                        <td style={{ padding: '1rem' }}></td><td style={{ padding: '1rem' }}></td>
                        <td style={{ padding: '1rem', color: '#f87171', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>${competitorTotalCost.toFixed(2)}</td>
                      </tr>
                      <tr><td colSpan="4" style={{ height: '1.5rem' }}></td></tr>
                      
                      {/* Zegion Math */}
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>Zegion Compute (Active Spot Usage)</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>{zegionTotalActiveHours.toLocaleString()} hrs</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: '#e879f9' }}>${spotHourly.toFixed(4)}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>${zegionComputeCost.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>Zegion Storage (EBS Limited by TTL)</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>{zegionTotalTtlHours.toLocaleString()} hrs</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.7)' }}>${ebsHourly.toFixed(4)}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>${zegionEbsCost.toFixed(2)}</td>
                      </tr>
                      <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '1rem', color: 'var(--text-pure)', fontWeight: 700 }}>Total Zegion Run Rate</td>
                        <td style={{ padding: '1rem' }}></td><td style={{ padding: '1rem' }}></td>
                        <td style={{ padding: '1rem', color: '#e879f9', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>${velzionTotalCost.toFixed(2)}</td>
                      </tr>
                      <tr><td colSpan="4" style={{ height: '1.5rem' }}></td></tr>

                      {/* Waste Reduction */}
                      <tr style={{ background: 'rgba(248, 113, 113, 0.1)' }}>
                        <td colSpan="3" style={{ padding: '1rem', color: '#f87171', fontWeight: 700 }}>Idle Compute Hours Prevented</td>
                        <td style={{ padding: '1rem', color: '#f87171', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>-{idleComputeHoursWasted.toLocaleString()} hrs</td>
                      </tr>
                      <tr style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                        <td colSpan="3" style={{ padding: '1rem', color: '#fbbf24', fontWeight: 700 }}>Idle Storage Hours Prevented</td>
                        <td style={{ padding: '1rem', color: '#fbbf24', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>-{idleStorageHoursWasted.toLocaleString()} hrs</td>
                      </tr>
                      <tr style={{ background: 'rgba(52, 211, 153, 0.15)' }}>
                        <td colSpan="3" style={{ padding: '1rem', color: '#34d399', fontWeight: 800 }}>Total Financial Impact</td>
                        <td style={{ padding: '1rem', color: '#34d399', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>-${totalSavings.toFixed(2)}/mo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- VISUAL BAR CHART --- */}
          <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1.5rem' }}>
              <span style={{ width: '160px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Standard CI/CD</span>
              <div style={{ flex: 1, height: '32px', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: competitorWidth }} transition={{ duration: 1, ease: 'easeOut' }} style={{ height: '100%', background: 'linear-gradient(90deg, #7f1d1d, #ef4444)', borderRadius: '16px' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ width: '160px', fontSize: '0.85rem', color: '#e879f9', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Zegion Platform</span>
              <div style={{ flex: 1, height: '32px', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: velzionWidth }} transition={{ duration: 1, ease: 'easeOut' }} style={{ height: '100%', background: 'linear-gradient(90deg, #6b21a8, #d946ef)', borderRadius: '16px', boxShadow: '0 0 15px rgba(217, 70, 239, 0.4)' }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================== */}
        {/* ARCHITECTURE CARDS (Neon Edged)            */}
        {/* ========================================== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '5rem' }}>
          <h2 style={{ textAlign: 'center', color: 'var(--text-pure)', fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: 800 }}>The Evolution of Ephemeral Infrastructure</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '3.5rem', fontSize: '1.1rem' }}>Why traditional pipelines fail at cost optimization at scale.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            <div style={{ position: 'relative', padding: '2.5rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', borderTop: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#f87171', boxShadow: '0 0 15px #f87171' }} />
              <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }}><Server size={24} /></div>
              <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-pure)', fontSize: '1.35rem', fontWeight: 800 }}>1. Legacy Staging</h3>
              <p style={{ margin: '0 0 1.5rem 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6 }}>A dedicated staging server shared by the entire team, running on-demand 24/7 regardless of actual usage.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}><span style={{ color: '#f87171', fontWeight: 800 }}>✗</span> Billed 730 hours per month constantly</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}><span style={{ color: '#f87171', fontWeight: 800 }}>✗</span> Expensive On-Demand pricing tier</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}><span style={{ color: '#f87171', fontWeight: 800 }}>✗</span> High risk of merge queue conflicts</div>
            </div>

            <div style={{ position: 'relative', padding: '2.5rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', borderTop: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#fbbf24', boxShadow: '0 0 15px #fbbf24' }} />
              <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}><Cloud size={24} /></div>
              <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-pure)', fontSize: '1.35rem', fontWeight: 800 }}>2. Standard Ephemeral</h3>
              <p style={{ margin: '0 0 1.5rem 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6 }}>Spins up a unique environment for every PR, but abandons them running idle until merged days later.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}><span style={{ color: '#34d399', fontWeight: 800 }}>✓</span> Isolated testing environment per PR</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}><span style={{ color: '#f87171', fontWeight: 800 }}>✗</span> Rampant idle cloud waste over weekends</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}><span style={{ color: '#f87171', fontWeight: 800 }}>✗</span> Often relies on On-Demand nodes</div>
            </div>

            <div style={{ position: 'relative', padding: '2.5rem', background: 'linear-gradient(145deg, rgba(8, 3, 16, 0.9), rgba(217, 70, 239, 0.05))', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', borderTop: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#e879f9', boxShadow: '0 0 20px #e879f9' }} />
              <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(217, 70, 239, 0.15)', border: '1px solid rgba(217, 70, 239, 0.3)', color: '#e879f9', boxShadow: 'inset 0 0 15px rgba(217, 70, 239, 0.2)' }}><Rocket size={24} /></div>
              <h3 style={{ margin: '0 0 0.75rem 0', color: '#e879f9', fontSize: '1.35rem', fontWeight: 800, textShadow: '0 0 10px rgba(217, 70, 239, 0.4)' }}>3. Zegion Platform</h3>
              <p style={{ margin: '0 0 1.5rem 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6 }}>State-aware infrastructure utilizing Strict TTLs, Spot instances, and auto-hibernation to eliminate idle burn.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem' }}><span style={{ color: '#34d399', fontWeight: 800 }}>✓</span> <strong>60% Spot Discount</strong> applied natively</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem' }}><span style={{ color: '#34d399', fontWeight: 800 }}>✓</span> <strong>Strict TTL:</strong> Culls dormant EBS volumes</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem' }}><span style={{ color: '#34d399', fontWeight: 800 }}>✓</span> <strong>ChatOps:</strong> Wake instances via GitHub</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}><span style={{ color: '#34d399', fontWeight: 800 }}>✓</span> <strong>Self-Healing:</strong> Auto-replaces dead Spot nodes</div>
            </div>
          </div>
        </motion.div>

        {/* ========================================== */}
        {/* ZEGION LIFECYCLE DEEP DIVE                 */}
        {/* ========================================== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} 
          style={{ marginTop: '5rem', padding: '4rem 3rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <h3 style={{ color: 'var(--text-pure)', fontSize: '2rem', marginTop: 0, marginBottom: '3.5rem', textAlign: 'center', fontWeight: 800 }}>Under the Hood: The Aggressive TTL Lifecycle</h3>
          
          <div className="lifecycle-step">
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '2px solid #e879f9', color: '#e879f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, zIndex: 2, flexShrink: 0, boxShadow: '0 0 20px rgba(217, 70, 239, 0.3)' }}>1</div>
            <div>
              <h4 style={{ color: 'var(--text-pure)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                PR Opened & Webhook Triggered 
                <span style={{ background: 'rgba(217, 70, 239, 0.1)', color: '#e879f9', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(217, 70, 239, 0.3)' }}>n8n Engine</span>
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>When a developer opens a Pull Request, GitHub fires a webhook to the orchestration engine. The system dynamically creates a Terraform workspace, provisions a fresh AWS Spot Instance (saving 60% instantly), and posts the live URL back to GitHub.</p>
            </div>
          </div>

          <div className="lifecycle-step">
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '2px solid #e879f9', color: '#e879f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, zIndex: 2, flexShrink: 0, boxShadow: '0 0 20px rgba(217, 70, 239, 0.3)' }}>2</div>
            <div>
              <h4 style={{ color: 'var(--text-pure)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                State-Aware Idle Hibernation 
                <span style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>FinOps</span>
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>Once the container finishes building, an invisible timer begins. If the developer isn't actively reviewing, the platform verifies the EC2 status via the AWS API. If running, it cleanly hibernates the instance, dropping the Compute Run Rate to $0.00/hr while keeping the EBS disk alive.</p>
            </div>
          </div>

          <div className="lifecycle-step">
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '2px solid #e879f9', color: '#e879f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, zIndex: 2, flexShrink: 0, boxShadow: '0 0 20px rgba(217, 70, 239, 0.3)' }}>3</div>
            <div>
              <h4 style={{ color: 'var(--text-pure)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                Strict TTL Enforcement 
                <span style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>Architecture</span>
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>Rather than letting sleeping EBS disks accumulate costs for days waiting for a merge, the engine enforces a Strict Time-To-Live. After the designated TTL window expires, the system executes a secure teardown, guaranteeing zero orphaned infrastructure.</p>
            </div>
          </div>

          <div className="lifecycle-step" style={{ marginBottom: 0 }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '2px solid #e879f9', color: '#e879f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, zIndex: 2, flexShrink: 0, boxShadow: '0 0 20px rgba(217, 70, 239, 0.3)' }}>4</div>
            <div>
              <h4 style={{ color: 'var(--text-pure)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                ChatOps Resumption Fallback 
                <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>Resilience</span>
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>If a developer returns the next day to a destroyed PR environment, they simply trigger a webhook via GitHub comments to rebuild the environment from scratch. This trades 3 minutes of wait time for 98% guaranteed cloud savings.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}