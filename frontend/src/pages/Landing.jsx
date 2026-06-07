import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Server, Shield, Terminal, Hexagon } from 'lucide-react';

// Framer Motion Variants for Staggered Animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Landing() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '2rem'
    }}>
<div className="aurora-bg">
  <div className="aurora-purple" />
  <div className="aurora-gold" />
  <div className="aurora-purple-small" />
  <div className="aurora-gold-small" />
</div> 
      <motion.div
  animate={{
    backgroundPosition: ["0px 0px", "120px 120px"]
  }}
  transition={{
    repeat: Infinity,
    duration: 20,
    ease: "linear"
  }}
  style={{
    position: "absolute",
    inset: 0,
    opacity: 0.05,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
    `,
    backgroundSize: "80px 80px",
    pointerEvents: "none"
  }}
/>
      
      {/* Minimal Public Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '1rem 0',
          zIndex: 10
        }}
      >
        <div className="flex-center" style={{ gap: '0.75rem' }}>
          <Hexagon size={28} style={{ color: 'var(--text-pure)' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em' }}>
            VELZION
          </span>
        </div>
        
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/docs" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            Documentation
          </Link>
          <Link to="/about" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            About
          </Link>
          <Link to="/login" className="glass-panel flex-center" style={{ 
            padding: '0.5rem 1.25rem', 
            borderRadius: 'var(--radius-pill)',
            gap: '0.5rem',
            color: 'var(--text-pure)',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            Access Console <ArrowRight size={16} />
          </Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '1000px',
          margin: '0 auto',
          zIndex: 10,
          paddingTop: '4rem'
        }}
      >
        <motion.div variants={itemVariants} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-pill)',
          border: 'var(--border-subtle)',
          backgroundColor: 'var(--bg-glass)',
          marginBottom: '2rem'
        }}>
          <span style={{ display: 'flex', height: '8px', width: '8px', borderRadius: '50%', backgroundColor: 'var(--vz-gold-core)', boxShadow: '0 0 10px var(--vz-gold-core)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Velzion Platform v2.0 is Live
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} style={{
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem'
        }}>
Your Cloud.<br />

<span style={{
  color: "var(--text-muted)"
}}>
  Your AWS Account.
</span>

<br />

<span className="text-gradient-velzard">
  Zero Vendor Markups.
</span>
        </motion.h1>

        <motion.p variants={itemVariants} style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: '600px',
          lineHeight: 1.6,
          marginBottom: '3.5rem'
        }}>
          Velzion delivers ephemeral preview environments and high-availability production clusters on a single, unified Obsidian Canvas.
        </motion.p>

        <motion.div
  variants={itemVariants}
  style={{
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "3rem"
  }}
>

  <Link to="/login">
    <motion.button
      whileHover={{
        scale: 1.05,
        y: -2
      }}
      whileTap={{
        scale: 0.97
      }}
      style={{
        padding: "1rem 1.8rem",
        borderRadius: "999px",
        background:
          "linear-gradient(135deg,var(--vz-gold-core),#ffffff)",
        color: "#000",
        fontWeight: 800,
        boxShadow:
          "0 0 30px rgba(245,203,92,.25)"
      }}
    >
      Launch Control Plane
    </motion.button>
  </Link>

  <Link to="/docs">
    <motion.button
      whileHover={{
        scale: 1.05
      }}
      whileTap={{
        scale: 0.97
      }}
      className="glass-panel"
      style={{
        padding: "1rem 1.8rem",
        borderRadius: "999px",
        color: "white",
        fontWeight: 700
      }}
    >
      View Documentation
    </motion.button>
  </Link>

</motion.div>

        {/* Engine Feature Cards */}
        <motion.div variants={containerVariants} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '800px'
        }}>
          

          
          {/* Zegion Engine Card */}
          
<Link
  to="/zegion"
  style={{
    textDecoration: "none",
    color: "inherit"
  }}
>
  <motion.div
    variants={itemVariants}
    whileHover={{
      y: -8,
      scale: 1.02
    }}
    whileTap={{
      scale: 0.98
    }}
    className="glass-panel"
    style={{
      padding: '2rem',
      textAlign: 'left',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer'
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '150px',
        height: '150px',
        background:
          'radial-gradient(circle, var(--zg-purple-glow) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: 0
      }}
    />

    <div
      style={{
        position: 'relative',
        zIndex: 1
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(157, 78, 221, 0.1)',
          border: '1px solid var(--zg-purple-border)',
          color: 'var(--zg-purple-core)',
          marginBottom: '1.5rem'
        }}
      >
        ⚡
      </div>

      <h3
        className="text-gradient-zegion"
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}
      >
        Zegion Engine
      </h3>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '1.25rem'
        }}
      >
        Deploy ephemeral, isolated preview environments in milliseconds.
        Perfect for PR reviews and staging branches.
      </p>

      <motion.div
        whileHover={{ x: 6 }}
        style={{
          color: 'var(--zg-purple-core)',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        Launch Zegion →
      </motion.div>
    </div>
  </motion.div>
</Link>

          
          {/* Velzard Engine Card */}

<Link
  to="/velzard"
  style={{
    textDecoration: "none",
    color: "inherit"
  }}
>
  <motion.div
    variants={itemVariants}
    whileHover={{
      y: -8,
      scale: 1.02
    }}
    whileTap={{
      scale: 0.98
    }}
    className="glass-panel"
    style={{
      padding: '2rem',
      textAlign: 'left',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer'
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '150px',
        height: '150px',
        background:
          'radial-gradient(circle, var(--vz-gold-glow) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: 0
      }}
    />

    <div
      style={{
        position: 'relative',
        zIndex: 1
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(245, 203, 92, 0.1)',
          border: '1px solid var(--vz-gold-border)',
          color: 'var(--vz-gold-core)',
          marginBottom: '1.5rem'
        }}
      >
        ⚙️
      </div>

      <h3
        className="text-gradient-velzard"
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}
      >
        Velzard Engine
      </h3>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '1.25rem'
        }}
      >
        High-availability production clusters designed for
        zero-downtime deployments, infinite scaling and
        enterprise-grade reliability.
      </p>

      <motion.div
        whileHover={{ x: 6 }}
        style={{
          color: 'var(--vz-gold-core)',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        Launch Velzard →
      </motion.div>
    </div>
  </motion.div>
</Link>


        </motion.div>
        <motion.section
  variants={containerVariants}
  style={{
    width: "100%",
    maxWidth: "1100px",
    marginTop: "5rem"
  }}
>
  <motion.div
    variants={itemVariants}
    style={{
      textAlign: "center",
      marginBottom: "3rem"
    }}
  >
    <h2
      style={{
        fontSize: "clamp(2rem,4vw,3rem)",
        fontWeight: 800,
        marginBottom: "1rem"
      }}
    >
      Why Teams Choose
      <span className="text-gradient-velzard">
        {" "}Velzion
      </span>
    </h2>

    <p
      style={{
        color: "var(--text-muted)",
        maxWidth: "700px",
        margin: "0 auto",
        lineHeight: 1.7
      }}
    >
      Modern platforms simplify deployment.
      Velzion focuses on infrastructure ownership,
      cloud transparency, FinOps visibility and
      enterprise scalability.
    </p>
  </motion.div>
  <motion.div
  variants={itemVariants}
  className="glass-panel"
  style={{
    width: "100%",
    maxWidth: "1100px",
    marginTop: "2rem",
    overflowX: "auto",
    padding: "2rem"
  }}
>
  <h3
    style={{
      fontSize: "1.5rem",
      fontWeight: 700,
      marginBottom: "1.5rem"
    }}
  >
    Platform Comparison
  </h3>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "700px"
    }}
  >
    <thead>
      <tr>
        <th
          style={{
            textAlign: "left",
            padding: "1rem",
            color: "var(--text-muted)",
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          Capability
        </th>

        <th
          style={{
            textAlign: "center",
            padding: "1rem",
            color: "var(--vz-gold-core)",
            borderBottom: "1px solid var(--vz-gold-border)"
          }}
        >
          Velzion
        </th>

        <th
          style={{
            textAlign: "center",
            padding: "1rem",
            color: "var(--text-muted)",
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          Traditional Platforms
        </th>
      </tr>
    </thead>

    <tbody>

      <tr>
        <td style={{ padding: "1rem" }}>
          Preview Environments
        </td>
        <td style={{ textAlign: "center", color: "#22c55e" }}>
          ✓
        </td>
        <td style={{ textAlign: "center" }}>
          Limited
        </td>
      </tr>

      <tr>
        <td style={{ padding: "1rem" }}>
          Production Clusters
        </td>
        <td style={{ textAlign: "center", color: "#22c55e" }}>
          ✓
        </td>
        <td style={{ textAlign: "center" }}>
          Basic
        </td>
      </tr>

      <tr>
        <td style={{ padding: "1rem" }}>
          FinOps Visibility
        </td>
        <td style={{ textAlign: "center", color: "#22c55e" }}>
          ✓
        </td>
        <td style={{ textAlign: "center" }}>
          Limited
        </td>
      </tr>

      <tr>
        <td style={{ padding: "1rem" }}>
          Infrastructure Ownership
        </td>
        <td style={{ textAlign: "center", color: "#22c55e" }}>
          ✓
        </td>
        <td style={{ textAlign: "center" }}>
          ✕
        </td>
      </tr>

      <tr>
        <td style={{ padding: "1rem" }}>
          Operational Transparency
        </td>
        <td style={{ textAlign: "center", color: "#22c55e" }}>
          ✓
        </td>
        <td style={{ textAlign: "center" }}>
          Partial
        </td>
      </tr>

      <tr>
        <td style={{ padding: "1rem" }}>
          Ephemeral PR Environments
        </td>
        <td style={{ textAlign: "center", color: "#22c55e" }}>
          ✓
        </td>
        <td style={{ textAlign: "center" }}>
          Limited
        </td>
      </tr>

    </tbody>
  </table>
</motion.div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(260px,1fr))",
      gap: "1.5rem"
    }}
  >
    <motion.div
      variants={itemVariants}
      className="glass-panel"
      style={{ padding: "2rem" }}
    >
      <h3
        style={{
          marginBottom: "1rem",
          color: "var(--vz-gold-core)"
        }}
      >
        Your Cloud Account
      </h3>

      <p
        style={{
          color: "var(--text-muted)",
          lineHeight: 1.6
        }}
      >
        Deploy directly into your own AWS account.
        Maintain full ownership of networking,
        IAM, security and cloud resources.
      </p>
    </motion.div>

    <motion.div
      variants={itemVariants}
      className="glass-panel"
      style={{ padding: "2rem" }}
    >
      <h3
        style={{
          marginBottom: "1rem",
          color: "var(--zg-purple-core)"
        }}
      >
        Preview Environments
      </h3>

      <p
        style={{
          color: "var(--text-muted)",
          lineHeight: 1.6
        }}
      >
        Every pull request gets an isolated
        environment for realistic testing
        before merge.
      </p>
    </motion.div>

    <motion.div
      variants={itemVariants}
      className="glass-panel"
      style={{ padding: "2rem" }}
    >
      <h3
        style={{
          marginBottom: "1rem",
          color: "var(--vz-gold-core)"
        }}
      >
        Infrastructure Transparency
      </h3>

      <p
        style={{
          color: "var(--text-muted)",
          lineHeight: 1.6
        }}
      >
        Monitor deployments, clusters,
        workloads and cloud costs from
        a unified control plane.
      </p>
    </motion.div>

    <motion.div
      variants={itemVariants}
      className="glass-panel"
      style={{ padding: "2rem" }}
    >
      <h3
        style={{
          marginBottom: "1rem",
          color: "var(--zg-purple-core)"
        }}
      >
        On-Demand Infrastructure
      </h3>

      <p
        style={{
          color: "var(--text-muted)",
          lineHeight: 1.6
        }}
      >
        Designed around predictable,
        production-grade infrastructure
        and enterprise workloads.
      </p>

      
    </motion.div>
  </div>
</motion.section>

      </motion.main>
    </div>
  );
}




