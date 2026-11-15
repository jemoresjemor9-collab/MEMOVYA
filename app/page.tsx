function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M5.5 22.2h20.2a4.2 4.2 0 0 0 .2-8.4 8.3 8.3 0 0 0-15.7-1.7 5.1 5.1 0 0 0-4.7 10.1Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="m11 19.8 2.9-5.1 2.4 3.2 2.4-3.2 2.4 5.1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

function StoragePreview() {
  return (
    <div className="preview-wrap" aria-label="Aperçu illustratif de l'espace Memovya">
      <div className="preview-glow" />
      <div className="preview-card">
        <div className="preview-head">
          <div>
            <div className="preview-label">VOTRE ESPACE PERSONNEL</div>
            <strong style={{fontFamily:"Manrope",fontSize:17}}>Bonjour, bienvenue</strong>
          </div>
          <div className="avatar">M</div>
        </div>
        <div className="storage-card">
          <div className="storage-top"><span>Stockage disponible</span><span>✦</span></div>
          <div className="storage-number">2 Go</div>
          <div className="storage-sub">Votre espace gratuit de départ</div>
          <div className="storage-track"><span /></div>
        </div>
        <div className="preview-section-title"><span>Accès rapide</span><span style={{color:"#2563EB",fontSize:11}}>Voir tout</span></div>
        <div className="file-grid">
          <div className="file-tile"><span className="file-icon" style={{background:"#EAF1FF"}}>▧</span><div><strong>Photos</strong><br/><small>Vos souvenirs</small></div></div>
          <div className="file-tile"><span className="file-icon" style={{background:"#F0EAFE"}}>▷</span><div><strong>Vidéos</strong><br/><small>Vos moments</small></div></div>
          <div className="file-tile"><span className="file-icon" style={{background:"#E7F7F1"}}>▤</span><div><strong>Documents</strong><br/><small>Vos fichiers</small></div></div>
        </div>
        <div className="preview-foot"><span>✓</span><span><b>Vos fichiers, votre espace.</b> Un accès organisé depuis vos appareils.</span></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Memovya accueil"><BrandMark /> MEMOVYA</a>
        <a className="top-link" href="mailto:contact@memovya.com">Nous contacter ↗</a>
      </header>
      <section className="hero">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> VOTRE ESPACE NUMÉRIQUE PERSONNEL</div>
          <h1>Tout ce qui compte, <span className="gradient-text">à portée de main.</span></h1>
          <p className="hero-copy">Vos photos, vidéos et documents réunis dans un espace pensé pour les protéger, les organiser et les retrouver facilement, où que vous soyez.</p>
          <div className="hero-actions">
            <a className="button-primary" href="/login">Accéder à mon espace <span aria-hidden="true">→</span></a>
            <a className="button-secondary" href="#decouvrir">Découvrir Memovya</a>
          </div>
          <div className="trust-row">
            <span><b className="check">✓</b> Espace privé</span>
            <span><b className="check">✓</b> Accès multi-appareils</span>
            <span><b className="check">✓</b> 2 Go gratuits au lancement</span>
          </div>
        </div>
        <StoragePreview />
      </section>
      <section id="decouvrir" style={{padding:"18px 0 52px",textAlign:"center"}}>
        <div className="eyebrow">UNE ORGANISATION PLUS SIMPLE</div>
        <h2 style={{fontFamily:"Manrope",fontSize:"clamp(24px,3vw,34px)",letterSpacing:"-.04em",margin:"18px 0 10px"}}>Votre vie numérique, mieux organisée.</h2>
        <p style={{maxWidth:600,margin:"0 auto",color:"#718096",lineHeight:1.8,fontSize:14}}>Memovya est en cours de construction. Les espaces de stockage et les fonctionnalités seront activés progressivement, après validation de leur sécurité et de leur fonctionnement.</p>
      </section>
      <footer className="footer">© {new Date().getFullYear()} Memovya. Votre espace numérique. Vos souvenirs. Votre avenir.</footer>
    </main>
  );
}
