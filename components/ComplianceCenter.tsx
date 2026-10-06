'use client';
export default function ComplianceCenter({lang}:{lang:'mn'|'en'}){
 const mn=lang==='mn';
 const cards=[
   {icon:'✓',title:mn?'Demo орчин':'Demo environment',status:mn?'ИДЭВХТЭЙ':'ACTIVE',tone:'ok',text:mn?'Бодит мөнгө ашиглахгүй local simulation.':'Local simulation with no real-money processing.'},
   {icon:'⌁',title:mn?'Real-money лиценз':'Real-money licence',status:mn?'ХОЛБОГДООГҮЙ':'NOT CONNECTED',tone:'pending',text:mn?'Баталгаажсан regulator лиценз одоогоор сайттай холбогдоогүй.':'No verified regulator licence is currently connected to this site.'},
   {icon:'◉',title:'KYC / AML',status:mn?'PRODUCTION-Д ШААРДЛАГАТАЙ':'REQUIRED FOR PRODUCTION',tone:'pending',text:mn?'Бодит мөнгө асаахаас өмнө identity, AML, sanctions controls шаардлагатай.':'Identity, AML and sanctions controls are required before real-money launch.'},
   {icon:'◇',title:mn?'RNG сертификат':'RNG certification',status:mn?'DEMO ENGINE':'DEMO ENGINE',tone:'pending',text:mn?'Одоогийн RNG нь simulation тул lab-certified биш.':'The current simulation RNG is not lab-certified.'},
   {icon:'₿',title:mn?'Төлбөр':'Payments',status:'SANDBOX ONLY',tone:'pending',text:mn?'Visa/Mastercard/Crypto нь зөвхөн UI sandbox.':'Visa/Mastercard/Crypto are UI sandbox flows only.'}
 ];
 return <section id="trust-compliance" className="compliance2026">
   <div className="complianceHead2026"><div><span className="eyebrow">TRUST CENTER</span><h2>{mn?'Лиценз & Баталгаажуулалт':'Licensing & Verification'}</h2><p>{mn?'Зөвхөн бодитоор баталгаажсан лиценз, сертификатыг энд харуулна. Хуурамч badge эсвэл license number ашиглахгүй.':'Only independently verified licences and certifications will be displayed here. No fabricated badges or licence numbers.'}</p></div><div className="trustSeal2026"><span>18+</span><b>DEMO</b><small>TRANSPARENT MODE</small></div></div>
   <div className="complianceGrid2026">{cards.map(c=><article key={c.title}><div className="complianceIcon2026">{c.icon}</div><div><b>{c.title}</b><span className={c.tone}>{c.status}</span><p>{c.text}</p></div></article>)}</div>
   <div className="licenceNotice2026"><b>{mn?'Production gate':'Production gate'}</b><span>{mn?'Real-money mode нь gaming licence + provider contract + KYC/AML + certified RNG + approved payment acquiring бүгд баталгаажсаны дараа л нээгдэнэ.':'Real-money mode stays locked until a gaming licence, provider contracts, KYC/AML, certified RNG and approved payment acquiring are all verified.'}</span></div>
 </section>
}
