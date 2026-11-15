import Link from "next/link";

export const metadata = {
  title: "Connexion",
};

function BrandMark() {
  return (
    <span aria-hidden="true" style={{
      display:"grid",placeItems:"center",width:44,height:44,borderRadius:15,
      color:"white",background:"linear-gradient(140deg,#2563EB,#885CF6 62%,#10B981)",
      boxShadow:"0 8px 20px rgba(37,99,235,.2)",fontSize:22,fontWeight:800
    }}>M</span>
  );
}

export default function LoginPage() {
  return (
    <main style={{
      minHeight:"100vh",display:"grid",placeItems:"center",padding:24,
      background:"radial-gradient(ellipse at 15% 10%,rgba(37,99,235,.10),transparent 35%),radial-gradient(ellipse at 90% 90%,rgba(136,92,246,.09),transparent 35%),#F8FAFC"
    }}>
      <section style={{
        width:"min(100%,460px)",padding:"clamp(26px,6vw,44px)",borderRadius:28,
        border:"1px solid #E8EDF5",background:"rgba(255,255,255,.94)",
        boxShadow:"0 24px 70px rgba(29,55,100,.09)"
      }}>
        <Link href="/" style={{display:"inline-flex",alignItems:"center",gap:12,textDecoration:"none",color:"#172033",fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:21}}>
          <BrandMark /> MEMOVYA
        </Link>
        <div style={{marginTop:36}}>
          <p style={{margin:"0 0 9px",color:"#2563EB",fontSize:11,fontWeight:800,letterSpacing:".12em"}}>VOTRE ESPACE PERSONNEL</p>
          <h1 style={{margin:"0 0 12px",color:"#172033",fontSize:32,lineHeight:1.15,letterSpacing:"-.04em"}}>Heureux de vous retrouver.</h1>
          <p style={{margin:0,color:"#718096",fontSize:14,lineHeight:1.7}}>Connectez-vous pour retrouver votre espace numérique et vos fichiers.</p>
        </div>
        <div role="status" style={{
          marginTop:28,padding:16,borderRadius:16,border:"1px solid #DCE8FF",
          background:"#F3F7FF",color:"#36517E",fontSize:13,lineHeight:1.65
        }}>
          <strong style={{display:"block",marginBottom:4,color:"#2457B8"}}>Ouverture des comptes en préparation</strong>
          L'authentification sécurisée n'est pas encore activée. Nous la mettons en place avant d'accepter les inscriptions et les connexions, afin de protéger correctement les comptes et les fichiers.
        </div>
        <div style={{display:"grid",gap:13,marginTop:27}}>
          <label style={{display:"grid",gap:7,color:"#43516A",fontSize:12,fontWeight:700}}>
            Adresse e-mail
            <input disabled type="email" placeholder="vous@exemple.com" style={{height:49,padding:"0 14px",border:"1px solid #E4EAF2",borderRadius:12,background:"#F8FAFC",color:"#718096"}} />
          </label>
          <label style={{display:"grid",gap:7,color:"#43516A",fontSize:12,fontWeight:700}}>
            Mot de passe
            <input disabled type="password" placeholder="Votre mot de passe" style={{height:49,padding:"0 14px",border:"1px solid #E4EAF2",borderRadius:12,background:"#F8FAFC",color:"#718096"}} />
          </label>
          <button disabled style={{height:51,border:0,borderRadius:13,color:"white",background:"#9BB8F5",fontWeight:800,cursor:"not-allowed"}}>Connexion bientôt disponible</button>
        </div>
        <p style={{margin:"25px 0 0",textAlign:"center",color:"#8A95A7",fontSize:11,lineHeight:1.6}}>
          Memovya n'accepte pas encore de données personnelles. Ne téléversez aucun fichier avant l'ouverture officielle.
        </p>
        <div style={{marginTop:25,textAlign:"center"}}>
          <Link href="/" style={{color:"#2563EB",fontSize:13,fontWeight:700,textDecoration:"none"}}>← Retour à l'accueil</Link>
        </div>
      </section>
    </main>
  );
}
