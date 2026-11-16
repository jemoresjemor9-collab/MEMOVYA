function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M5.5 22.2h20.2a4.2 4.2 0 0 0 .2-8.4 8.3 8.3 0 0 0-15.7-1.7 5.1 5.1 0 0 0-4.7 10.1Z" stroke="#EAF0FF" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="m11 19.8 2.9-5.1 2.4 3.2 2.4-3.2 2.4 5.1" stroke="#EAF0FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
          <div className="file-tile"><span className="file-icon" style={{background:"#DCE8FF"}}>▧</span><div><strong>Photos</strong><br/><small>Vos souvenirs</small></div></div>
          <div className="file-tile"><span className="file-icon" style={{background:"#E5D9FF"}}>▷</span><div><strong>Vidéos</strong><br/><small>Vos moments</small></div></div>
          <div className="file-tile"><span className="file-icon" style={{background:"#C8F1E3"}}>▤</span><div><strong>Documents</strong><br/><small>Vos fichiers</small></div></div>
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
        <nav className="top-actions" aria-label="Accès au compte">
          <a className="top-link" href="/login">Se connecter</a>
          <a className="top-signup" href="/signup">S'inscrire</a>
        </nav>
      </header>
      <section className="hero">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> VOTRE ESPACE NUMÉRIQUE PERSONNEL</div>
          <h1>Tout ce qui compte, <span className="gradient-text">à portée de main.</span></h1>
          <p className="hero-copy">Vos photos, vidéos et documents réunis dans un espace pensé pour les protéger, les organiser et les retrouver facilement, où que vous soyez.</p>
          <div className="hero-actions">
            <a className="button-primary" href="/signup">Créer mon compte <span aria-hidden="true">→</span></a>
            <a className="button-secondary" href="/login">J'ai déjà un compte</a>
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
        <p style={{maxWidth:600,margin:"0 auto",color:"#718096",lineHeight:1.8,fontSize:14}}>Créez votre compte et préparez votre espace personnel. Les fonctions de stockage seront ouvertes au fur et à mesure de leur validation.</p>
      </section>
      <footer className="footer">© {new Date().getFullYear()} Memovya. Votre espace numérique. Vos souvenirs. Votre avenir.</footer>
    </main>
  );
}
