import { useState, useEffect, useRef } from "react";

const C = {
  bg:"#0A0A08", bg2:"#111110", card:"#141412", border:"#2A2820",
  gold:"#D4A843", gold2:"#F0C865",
  cream:"#F0EDE6", ice:"#B8B4A8", muted:"#6B6860",
  green:"#4CAF82", sky:"#5B9BD5", coral:"#E8604C",
  violet:"#8B5CF6", teal:"#14B8A6",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#0A0A08;color:#F0EDE6;font-family:'DM Sans',sans-serif;overflow-x:hidden}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#D4A84344;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
button,input,textarea,select{font-family:'DM Sans',sans-serif}
input:focus,textarea:focus,select:focus{outline:none}
section{scroll-margin-top:64px}
`;

const PLANS = [
  {
    id:"basic", name:"Basic", emoji:"🌱",
    price:97, usdc:97, usdt:97, eth:"0.027", btc:"0.00098", mo:27, days:3, color:"#4CAF82",
    hook:"Less than a business lunch.",
    tagline:"Get online. Look credible. Start converting.",
    features:["5-page AI-built website","Mobile responsive design","Aria AI chat widget","Basic visitor dashboard","Google Analytics setup","Contact form + click-to-call","3 months free hosting","1 revision round"],
  },
  {
    id:"premium", name:"Premium", emoji:"🍍",
    price:197, usdc:197, usdt:197, eth:"0.055", btc:"0.00197", mo:47, days:5, color:"#D4A843", pop:true,
    hook:"Less than one month of Google Ads.",
    tagline:"A website that sells for you while you sleep.",
    features:["10-page custom website","Aria trained on your business","Real-time sales dashboard","Lead capture + CRM link","SEO optimisation","Reviews section","Booking system","6 months free hosting","3 revision rounds","Monthly performance report"],
  },
  {
    id:"pro", name:"Pro Suite", emoji:"👑",
    price:497, usdc:497, usdt:497, eth:"0.138", btc:"0.00497", mo:97, days:7, color:"#5B9BD5",
    hook:"Less than the cost of one lost customer.",
    tagline:"Full AI transformation. Competitor-crushing results.",
    features:["Unlimited pages + blog","Custom Aria AI personality","Live competitor dashboard","E-commerce or booking engine","Email marketing automation","Google Ads landing pages","12 months free hosting","Unlimited revisions (90 days)","Quarterly strategy calls","White-label option"],
  },
];
const CLIENTS = [
  { name:"Financial Services Firm", industry:"Investment & Finance · UAE", emoji:"🏦", color:"#D4A843",
    result:"Investor enquiries up 340%",
    quote:"Aria answers investor questions at 2am so we don't have to. The dashboard shows exactly which content drives sign-ups.",
    person:"Managing Director",
    stats:[{v:"340%",l:"More enquiries"},{v:"$3M+",l:"Revenue"},{v:"4 days",l:"To live"}] },
  { name:"Specialty Coffee Shop", industry:"Food & Beverage · UK", emoji:"☕", color:"#4CAF82",
    result:"Online orders doubled in 6 weeks",
    quote:"We went from zero online presence to 200+ monthly orders. Aria recommends products based on what customers say.",
    person:"Founder",
    stats:[{v:"2×",l:"Online orders"},{v:"4.9★",l:"Google rating"},{v:"68%",l:"Cart completion"}] },
  { name:"Independent Fashion Boutique", industry:"Retail · UK", emoji:"👗", color:"#5B9BD5",
    result:"$22k revenue in first month",
    quote:"Aria asks what occasion you are dressing for and suggests outfits. It actually sells.",
    person:"Creative Director",
    stats:[{v:"$22k",l:"Month 1"},{v:"3.2min",l:"Avg session"},{v:"22%",l:"Conversion"}] },
  { name:"Local Trades Business", industry:"Plumbing and Heating · UK", emoji:"🔧", color:"#7C9E6B",
    result:"Fully booked 6 weeks ahead",
    quote:"Aria handles all my booking enquiries. I have not answered a cold call in months.",
    person:"Owner",
    stats:[{v:"6 wks",l:"Booked ahead"},{v:"0",l:"Cold calls"},{v:"$84k",l:"Q1 revenue"}] },
];

const MANIFEST = {
  schema_version: "v1",
  name_for_human: "Pineapple Bun AI",
  name_for_model: "pineapple_bun_ai",
  description_for_human: "AI-powered website builder for SMEs. Starting from $97. Submit a brief, pay by card, USDC, USDT, ETH or BTC, get a live website in 3-7 days.",
  description_for_model: "Order AI-powered websites for businesses. Browse plans, submit briefs, get a USDC or ETH payment address on Base network, and track delivery milestones programmatically.",
  auth: { type: "none" },
  api: { type: "openapi", url: "https://pineapplebun.ai/.well-known/openapi.json" },
  contact_email: "hello@pineapplebun.ai",
};

const DEMO_STEPS = [
  { msg:"GET /api/v1/plans", t:"req", delay:700 },
  { msg:"200 OK — basic $97 · premium $197 · pro $497", t:"res", delay:800 },
  { msg:"POST /api/v1/orders  { plan: premium, currency: USDC }", t:"req", delay:1200 },
  { msg:"201 Created", t:"res", delay:900 },
  { msg:"order_id: PBA-2025-0042", t:"body", delay:400 },
  { msg:"payment_address: 0x742d...4567  (Base network)", t:"body", delay:400 },
  { msg:"amount: 197 USDT  |  chain_id: 8453", t:"body", delay:400 },
  { msg:"Agent sends 197 USDT on Base...", t:"crypto", delay:1800 },
  { msg:"Confirmed — block 18,234,721  |  fee: $0.003", t:"success", delay:1400 },
  { msg:"GET /api/v1/orders/PBA-2025-0042", t:"req", delay:900 },
  { msg:"200 OK  |  status: in_production", t:"res", delay:800 },
  { msg:"milestone 1: AI training complete  |  milestone 2: design active", t:"body", delay:500 },
  { msg:"estimated_delivery: 2025-03-26", t:"body", delay:400 },
  { msg:"Website delivered in 5 days. Order complete.", t:"success", delay:2000 },
];

const FORM_SECTIONS = [
  { id:"biz", title:"Your Business", emoji:"🏢", fields:[
    { id:"name",  label:"Business Name",      type:"text",   ph:"e.g. Smith Plumbing",          req:true },
    { id:"owner", label:"Your Name",           type:"text",   ph:"e.g. John Smith",              req:true },
    { id:"email", label:"Email Address",       type:"email",  ph:"hello@yourbusiness.com",       req:true },
    { id:"phone", label:"Phone Number",        type:"text",   ph:"+44 7700 000000" },
    { id:"type",  label:"Type of business",    type:"select", req:true,
      opts:["Select...","Restaurant or Cafe","Tradesperson","Retail","Salon or Beauty","Fitness","Legal or Accounting","Healthcare","Property","Finance or Investment","Tech or SaaS","Other"] },
    { id:"loc",   label:"Where are you based?",type:"text",   ph:"e.g. Dubai, Manchester, New York", req:true },
  ]},
  { id:"site", title:"Your Website", emoji:"🌐", fields:[
    { id:"hasSite", label:"Do you have a website?", type:"select", req:true,
      opts:["Select...","No website yet","Yes — outdated","Yes — not converting","Yes — happy with it"] },
    { id:"url",     label:"Current URL if any",      type:"text",   ph:"https://www.yoursite.com" },
    { id:"problem", label:"Biggest problem with your online presence?", type:"textarea", req:true,
      ph:"e.g. Visitors do not enquire, hard to find on Google..." },
    { id:"usp",     label:"What makes you better than competitors?", type:"textarea", req:true,
      ph:"e.g. 24/7 availability, fixed pricing, 10 years experience..." },
  ]},
  { id:"order", title:"Choose Your Plan", emoji:"💳", fields:[
    { id:"plan",    label:"Which plan interests you?", type:"select", req:true,
      opts:["Select...","Basic — $97 (5 pages, 3 days)","Premium — $197 (10 pages plus AI chat, 5 days)","Pro — $497 (unlimited pages, full AI, 7 days)","Not sure — advise me"] },
    { id:"pay",     label:"How would you like to pay?", type:"select",
      opts:["Select...","Credit card or bank transfer","USDC on Base network","USDT on Base network","ETH on Base network","BTC (Bitcoin)","Not sure yet"] },
    { id:"when",    label:"When do you need to go live?", type:"select",
      opts:["Select...","As soon as possible","Within 2 weeks","Within a month","No rush"] },
    { id:"notes",   label:"Anything else we should know?", type:"textarea",
      ph:"Special requirements, questions, or anything important..." },
  ]},
];

function go(id) { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); }

function useInView() {
  const ref = useRef();
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold:0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

function Tag({ children, color }) {
  const col = color || "#D4A843";
  return (
    <span style={{ fontSize:10, fontFamily:"DM Mono", padding:"3px 9px", borderRadius:20,
      background:col+"18", border:"1px solid "+col+"30", color:col, letterSpacing:.5 }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, outline, large, color, disabled }) {
  const col = color || "#D4A843";
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 30px "+col+"44"; }}}
      onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=outline?"none":"0 4px 18px "+col+"33"; }}
      style={{
        display:"inline-flex", alignItems:"center", gap:8,
        padding: large ? "14px 32px" : "10px 22px",
        borderRadius:9, cursor: disabled ? "not-allowed" : "pointer",
        fontSize: large ? 15 : 13.5, fontWeight:600, transition:"all .2s",
        background: outline ? "transparent" : disabled ? "#333" : "linear-gradient(135deg,"+col+","+col+"CC)",
        color: outline ? col : disabled ? "#6B6860" : "#0A0A08",
        border: outline ? "1.5px solid "+col+"55" : "none",
        boxShadow: outline || disabled ? "none" : "0 4px 18px "+col+"33",
        opacity: disabled ? .6 : 1,
      }}>{children}</button>
  );
}

function Box({ children, accent, style: s }) {
  return (
    <div style={{ background:"#141412", borderRadius:14,
      border:"1px solid "+(accent ? accent+"33" : "#2A2820"),
      padding:22, position:"relative", overflow:"hidden", ...(s||{}) }}>
      {accent && <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
        background:"linear-gradient(90deg,"+accent+",transparent)" }} />}
      {children}
    </div>
  );
}

function Nav({ page, setPage }) {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const h = () => setSc(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100, height:60,
      background: sc ? "rgba(10,10,8,.96)" : "transparent",
      backdropFilter: sc ? "blur(20px)" : "none",
      borderBottom: sc ? "1px solid #2A2820" : "none",
      display:"flex", alignItems:"center", padding:"0 5%", transition:"all .3s",
    }}>
      <div onClick={() => { setPage("home"); window.scrollTo({top:0,behavior:"smooth"}); }}
        style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
        <span style={{ fontSize:22 }}>🍍</span>
        <div>
          <div style={{ fontFamily:"Playfair Display", fontSize:14, fontWeight:700, color:"#F0EDE6", lineHeight:1 }}>Pineapple Bun AI</div>
          <div style={{ fontSize:8, fontFamily:"DM Mono", color:"#D4A843", letterSpacing:2 }}>BY KIM</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:2, margin:"0 auto" }}>
        {[["How it works","how"],["Results","clients"],["Pricing","pricing"],["For AI Agents","agents"],["Get Started","contact"]].map(([l,id]) => (
          <button key={id}
            onClick={() => id==="agents" ? setPage("agents") : go(id)}
            onMouseEnter={e => { if (id!=="agents") e.currentTarget.style.color="#F0EDE6"; }}
            onMouseLeave={e => { if (id!=="agents") e.currentTarget.style.color="#6B6860"; }}
            style={{ padding:"6px 13px", borderRadius:7, border:"none", cursor:"pointer",
              background: id==="agents" ? "#8B5CF618" : "transparent",
              color: id==="agents" ? "#8B5CF6" : "#6B6860",
              fontSize:12.5, transition:"color .2s" }}>{l}</button>
        ))}
      </div>
      <Btn onClick={() => go("contact")}>Get started</Btn>
    </nav>
  );
}

function Ticker() {
  const items = ["From $97","AI Chat That Sells","Live Sales Dashboard","Agent API","Card or Crypto","3-7 Day Delivery","No Rebuild Needed","SMEs Worldwide","14-Day Guarantee","USDC, USDT, ETH and BTC"];
  const all = [...items,...items];
  return (
    <div style={{ background:"#D4A843", height:28, overflow:"hidden", display:"flex", alignItems:"center", marginTop:60 }}>
      <div style={{ display:"flex", animation:"ticker 26s linear infinite", whiteSpace:"nowrap" }}>
        {all.map((t,i) => (
          <span key={i} style={{ fontSize:10.5, fontFamily:"DM Mono", color:"#0A0A08", padding:"0 22px", letterSpacing:.7 }}>
            {t} <span style={{ opacity:.35 }}>&#9670;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero({ setPage }) {
  const [ref, vis] = useInView();
  return (
    <section ref={ref} id="home" style={{ minHeight:"92vh", display:"flex", flexDirection:"column",
      justifyContent:"center", padding:"80px 5% 60px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, zIndex:0,
        backgroundImage:"radial-gradient(ellipse 70% 60% at 60% 30%,#D4A84309 0%,transparent 70%),radial-gradient(ellipse 50% 50% at 15% 70%,#4CAF8206 0%,transparent 60%)" }} />
      <div style={{ position:"absolute", inset:0, zIndex:0,
        backgroundImage:"linear-gradient(#2A282033 1px,transparent 1px),linear-gradient(90deg,#2A282033 1px,transparent 1px)",
        backgroundSize:"48px 48px", opacity:.4 }} />
      <div style={{ position:"absolute", top:"15%", right:"8%", width:280, height:280, borderRadius:"50%",
        border:"1px solid #D4A84318", background:"radial-gradient(circle,#D4A84308 0%,transparent 70%)",
        animation:"float 7s ease-in-out infinite", zIndex:0 }} />
      <div style={{ position:"relative", zIndex:1, maxWidth:820 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:28,
          background:"#D4A8430F", border:"1px solid #D4A84333", borderRadius:50, padding:"6px 16px",
          animation: vis ? "fadeUp .6s ease both" : "none" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#4CAF82", animation:"pulse 2s infinite" }} />
          <span style={{ fontSize:11, fontFamily:"DM Mono", color:"#D4A843", letterSpacing:1.5 }}>AI WEBSITES &middot; AGENT API &middot; CRYPTO PAYMENTS</span>
        </div>
        <h1 style={{ fontFamily:"Playfair Display", fontSize:"clamp(40px,6vw,76px)", fontWeight:900,
          lineHeight:1.05, letterSpacing:-1, marginBottom:12,
          animation: vis ? "fadeUp .7s .1s ease both" : "none" }}>
          <span style={{ color:"#F0EDE6" }}>Your website should</span><br />
          <span style={{ background:"linear-gradient(135deg,#D4A843,#F0C865)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>sell while you sleep.</span>
        </h1>
        <p style={{ fontSize:17, color:"#B8B4A8", lineHeight:1.8, maxWidth:560, fontWeight:300, marginBottom:40,
          animation: vis ? "fadeUp .7s .2s ease both" : "none" }}>
          We add AI chat and a live sales dashboard to your website in 3-7 days. No rebuild. Pay by card or crypto. Accessible to humans and AI agents alike.
        </p>
        <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:52,
          animation: vis ? "fadeUp .7s .3s ease both" : "none" }}>
          <Btn large onClick={() => go("contact")}>Get your free demo</Btn>
          <Btn large outline onClick={() => setPage("agents")}>AI Agent API</Btn>
        </div>
        <div style={{ display:"flex", gap:32, flexWrap:"wrap",
          animation: vis ? "fadeUp .7s .4s ease both" : "none" }}>
          {[["50+","Websites built"],["340%","Avg enquiry increase"],["3-7","Days to live"],["$97","Starting price"]].map(([v,l]) => (
            <div key={l}>
              <div style={{ fontFamily:"Playfair Display", fontSize:22, fontWeight:700, color:"#D4A843" }}>{v}</div>
              <div style={{ fontSize:11, color:"#6B6860" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [ref, vis] = useInView();
  const steps = [
    { n:"01", icon:"📋", title:"Fill out our questionnaire", body:"Tell us about your business in 5 minutes. No tech knowledge needed." },
    { n:"02", icon:"🧠", title:"We train Aria on your business", body:"Aria learns your products, pricing, FAQs and brand voice inside out." },
    { n:"03", icon:"⚡", title:"We build and launch", body:"Your site goes live in 3-7 days. We handle everything." },
    { n:"04", icon:"📊", title:"You watch the dashboard", body:"Live visitors, Aria conversations, enquiries — updated in real time." },
  ];
  return (
    <section id="how" style={{ padding:"100px 5%", background:"#111110" }} ref={ref}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56, animation: vis ? "fadeUp .6s ease both" : "none" }}>
          <Tag>HOW IT WORKS</Tag>
          <h2 style={{ fontFamily:"Playfair Display", fontSize:"clamp(28px,4vw,46px)", fontWeight:700,
            color:"#F0EDE6", marginTop:14 }}>Live in <em style={{ color:"#D4A843" }}>days, not months.</em></h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 }}>
          {steps.map((s,i) => (
            <div key={i}
              onMouseEnter={e => e.currentTarget.style.borderColor="#D4A84344"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#2A2820"}
              style={{ padding:22, borderRadius:14, background:"#141412", border:"1px solid #2A2820",
                transition:"border-color .2s", animation: vis ? "fadeUp .6s "+(.1+i*.1)+"s ease both" : "none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                <span style={{ fontSize:24 }}>{s.icon}</span>
                <span style={{ fontFamily:"DM Mono", fontSize:11, color:"#D4A843", opacity:.5 }}>{s.n}</span>
              </div>
              <div style={{ fontSize:14, fontWeight:600, color:"#F0EDE6", marginBottom:7 }}>{s.title}</div>
              <div style={{ fontSize:12.5, color:"#6B6860", lineHeight:1.65 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientResults() {
  const [active, setActive] = useState(0);
  const [ref, vis] = useInView();
  const c = CLIENTS[active];
  return (
    <section id="clients" style={{ padding:"100px 5%", background:"#0A0A08" }} ref={ref}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48, animation: vis ? "fadeUp .6s ease both" : "none" }}>
          <Tag>CLIENT RESULTS</Tag>
          <h2 style={{ fontFamily:"Playfair Display", fontSize:"clamp(28px,4vw,46px)", fontWeight:700,
            color:"#F0EDE6", marginTop:14 }}>Real businesses. <em style={{ color:"#D4A843" }}>Real results.</em></h2>
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", justifyContent:"center" }}>
          {CLIENTS.map((cl,i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding:"8px 18px", borderRadius:30, cursor:"pointer", transition:"all .2s",
              border:"1.5px solid "+(active===i ? cl.color+"66" : "#2A2820"),
              background: active===i ? cl.color+"12" : "transparent",
              color: active===i ? cl.color : "#6B6860",
              display:"flex", alignItems:"center", gap:7, fontSize:12.5,
            }}><span>{cl.emoji}</span>{cl.name}</button>
          ))}
        </div>
        <div key={active} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, animation:"fadeIn .4s ease" }}>
          <Box accent={c.color}>
            <div style={{ fontSize:36, marginBottom:14 }}>{c.emoji}</div>
            <p style={{ fontFamily:"Playfair Display", fontSize:15, color:"#F0EDE6", lineHeight:1.75,
              fontStyle:"italic", marginBottom:14 }}>&ldquo;{c.quote}&rdquo;</p>
            <div style={{ fontSize:12, color:"#6B6860", marginBottom:12 }}>&mdash; {c.person}, {c.name}</div>
            <Tag color={c.color}>{c.industry}</Tag>
          </Box>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Box style={{ flex:1 }}>
              <div style={{ fontSize:10, fontFamily:"DM Mono", color:c.color, letterSpacing:1.5, marginBottom:10 }}>HEADLINE RESULT</div>
              <div style={{ fontFamily:"Playfair Display", fontSize:22, fontWeight:700, color:"#F0EDE6" }}>{c.result}</div>
            </Box>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {c.stats.map((s,i) => (
                <Box key={i} style={{ textAlign:"center", padding:16 }}>
                  <div style={{ fontFamily:"Playfair Display", fontSize:20, fontWeight:700, color:c.color, marginBottom:4 }}>{s.v}</div>
                  <div style={{ fontSize:10.5, color:"#6B6860" }}>{s.l}</div>
                </Box>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [cur, setCur] = useState("usd");
  const [ref, vis] = useInView();
  return (
    <section id="pricing" style={{ padding:"100px 5%", background:"#111110" }} ref={ref}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:20, animation: vis ? "fadeUp .6s ease both" : "none" }}>
          <Tag>PRICING</Tag>
          <h2 style={{ fontFamily:"Playfair Display", fontSize:"clamp(28px,4vw,46px)", fontWeight:700,
            color:"#F0EDE6", marginTop:14, marginBottom:12 }}>Priced for small business. <em style={{ color:"#D4A843" }}>Starts at $97.</em></h2>
          <p style={{ fontSize:14, color:"#6B6860", marginBottom:22 }}>Every plan includes Aria AI chat and a live sales dashboard. Pay by card, USDC, USDT, ETH or BTC.</p>
          <div style={{ display:"inline-flex", background:"#141412", border:"1px solid #2A2820", borderRadius:30, padding:4, gap:4 }}>
            {[["usd","💳 Card / USD"],["usdc","💎 USDC"],["usdt","💵 USDT"],["eth","⟠ ETH"],["btc","₿ BTC"]].map(([id,l]) => (
              <button key={id} onClick={() => setCur(id)} style={{
                padding:"7px 16px", borderRadius:26, border:"none", cursor:"pointer", fontSize:11.5, fontWeight:500,
                background: cur===id ? "#D4A843" : "transparent",
                color: cur===id ? "#0A0A08" : "#6B6860", transition:"all .2s" }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {PLANS.map((p,i) => (
            <div key={i} style={{ background:"#141412", borderRadius:16, overflow:"hidden",
              border:"1.5px solid "+(p.pop ? p.color+"55" : "#2A2820"),
              transform: p.pop ? "scale(1.03)" : "none",
              boxShadow: p.pop ? "0 0 40px "+p.color+"18" : "none",
              animation: vis ? "fadeUp .6s "+(.1+i*.1)+"s ease both" : "none" }}>
              {p.pop && <div style={{ background:p.color, padding:"5px 0", textAlign:"center",
                fontSize:10, fontFamily:"DM Mono", color:"#0A0A08", letterSpacing:1 }}>MOST POPULAR</div>}
              <div style={{ padding:24 }}>
                <div style={{ fontSize:24, marginBottom:10 }}>{p.emoji}</div>
                <div style={{ fontFamily:"Playfair Display", fontSize:17, fontWeight:700, color:"#F0EDE6", marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:11.5, color:"#6B6860", marginBottom:16, lineHeight:1.5 }}>{p.tagline}</div>
                <div style={{ paddingBottom:16, marginBottom:16, borderBottom:"1px solid #2A2820" }}>
                  <div style={{ fontFamily:"Playfair Display", fontSize:28, fontWeight:700, color:p.color, marginBottom:4 }}>
                    {cur==="usd" ? "$"+p.price : cur==="usdc" ? "$"+p.usdc+" USDC" : cur==="usdt" ? "$"+p.usdt+" USDT" : cur==="btc" ? p.btc+" BTC" : p.eth+" ETH"}
                  </div>
                  {cur!=="usd" && <div style={{ fontSize:10, color:"#6B6860", fontFamily:"DM Mono", marginBottom:4 }}>{"Base network · instant confirm"}</div>}
                  <div style={{ fontSize:11, fontFamily:"DM Mono", color:"#4CAF82" }}>Live in {p.days} days</div>
                  {p.hook && <div style={{ fontSize:12, color:"#D4A843", fontStyle:"italic", marginTop:6 }}>{p.hook}</div>}
                </div>
                {p.features.map((f,fi) => (
                  <div key={fi} style={{ display:"flex", gap:9, marginBottom:8 }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", background:p.color+"20",
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:p.color }} />
                    </div>
                    <span style={{ fontSize:12, color:"#B8B4A8", lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
                <button onClick={() => go("contact")}
                  onMouseEnter={e => { if (!p.pop) e.currentTarget.style.background=p.color+"15"; }}
                  onMouseLeave={e => { if (!p.pop) e.currentTarget.style.background="transparent"; }}
                  style={{ width:"100%", marginTop:18, padding:"11px", borderRadius:9, cursor:"pointer",
                    background: p.pop ? "linear-gradient(135deg,"+p.color+",#F0C865)" : "transparent",
                    border: p.pop ? "none" : "1.5px solid "+p.color+"44",
                    color: p.pop ? "#0A0A08" : p.color, fontSize:13, fontWeight:600, transition:"all .2s" }}>
                  Get started
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, padding:"14px 22px", background:"#141412", borderRadius:12,
          border:"1px solid #2A2820", display:"flex", justifyContent:"center", gap:28, flexWrap:"wrap" }}>
          {["14-day money-back guarantee","No contracts","Card, USDC, USDT, ETH or BTC","Global support","Cancel anytime"].map(t => (
            <span key={t} style={{ fontSize:12, color:"#6B6860" }}>&#10003; <span style={{ color:"#B8B4A8" }}>{t}</span></span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [ref, vis] = useInView();
  const sec = FORM_SECTIONS[step];
  const total = FORM_SECTIONS.length;

  const update = (id, val) => {
    setAnswers(p => ({ ...p, [id]:val }));
    if (errors[id]) setErrors(p => ({ ...p, [id]:null }));
  };

  const validate = () => {
    const errs = {};
    sec.fields.forEach(f => {
      if (f.req) {
        const v = answers[f.id] || "";
        if (!v || v === "Select...") errs[f.id] = "Required";
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [sending, setSending] = useState(false);

  const next = async () => {
    if (!validate()) return;
    if (step === total - 1) {
      setSending(true);
      try {
        // Formspree forwards to Kim.pbun@gmail.com
        // Replace YOUR_FORM_ID with your actual ID from formspree.io (e.g. xpwzgkqb)
        const FORMSPREE_ID = "xeerwpwp";
        await fetch("https://formspree.io/f/" + FORMSPREE_ID, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            _replyto: answers.email,
            _subject: "New enquiry from " + (answers.name || "someone") + " via Pineapple Bun AI",
            name: answers.name || "",
            email: answers.email || "",
            phone: answers.phone || "Not provided",
            business_type: answers.type || "",
            location: answers.loc || "",
            has_website: answers.hasSite || "",
            current_url: answers.url || "None",
            problem: answers.problem || "",
            usp: answers.usp || "",
            plan: answers.plan || "",
            payment: answers.pay || "",
            timeline: answers.when || "",
            notes: answers.notes || "",
          }),
        });
      } catch(e) {
        console.warn("Form submission:", e.message);
      }
      setSending(false);
      setDone(true);
      return;
    }
    setStep(s => s + 1);
  };

  const inp = { width:"100%", background:"#1A1A17", border:"1px solid #2A2820", borderRadius:8,
    padding:"10px 13px", fontSize:13, color:"#F0EDE6", transition:"border-color .15s" };

  if (done) return (
    <section id="contact" style={{ padding:"100px 5%", background:"#111110" }} ref={ref}>
      <div style={{ maxWidth:520, margin:"0 auto", textAlign:"center", animation:"fadeUp .4s ease" }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🍍</div>
        <h2 style={{ fontFamily:"Playfair Display", fontSize:28, fontWeight:700, color:"#F0EDE6", marginBottom:10 }}>You are in!</h2>
        <p style={{ fontSize:14, color:"#6B6860", lineHeight:1.8, marginBottom:24 }}>
          Thanks <strong style={{ color:"#F0EDE6" }}>{answers.owner || "there"}</strong> — Kim will review your answers and be in touch within 24 hours with your personalised website plan and a free demo.
        </p>
        <div style={{ background:"#141412", border:"1px solid #D4A84333", borderRadius:12, padding:24, textAlign:"left" }}>
          <div style={{ fontSize:10, fontFamily:"DM Mono", color:"#D4A843", letterSpacing:1.5, marginBottom:14 }}>WHAT HAPPENS NEXT</div>
          {["Kim reviews your questionnaire within 24 hours","We build a free demo version of your website","You preview it with no obligation","You choose to pay in GBP or crypto"].map((s,i) => (
            <div key={i} style={{ display:"flex", gap:12, marginBottom:10 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:"#D4A843", color:"#0A0A08",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{i+1}</div>
              <span style={{ fontSize:13, color:"#B8B4A8" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <section id="contact" style={{ padding:"100px 5%", background:"#111110" }} ref={ref}>
      <div style={{ maxWidth:620, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:44, animation: vis ? "fadeUp .6s ease both" : "none" }}>
          <Tag>GET STARTED</Tag>
          <h2 style={{ fontFamily:"Playfair Display", fontSize:"clamp(26px,4vw,42px)", fontWeight:700,
            color:"#F0EDE6", marginTop:14, marginBottom:10 }}>Tell us about <em style={{ color:"#D4A843" }}>your business.</em></h2>
          <p style={{ fontSize:14, color:"#6B6860" }}>5 minutes. Free demo. Pay by card or crypto.</p>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:24, justifyContent:"center" }}>
          {FORM_SECTIONS.map((s,i) => (
            <span key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                background: i<step ? "#4CAF82" : i===step ? "#D4A843" : "#141412",
                border: "1.5px solid "+(i<step ? "#4CAF82" : i===step ? "#D4A843" : "#2A2820"),
                fontSize: i<step ? 12 : 13, color: i<=step ? "#0A0A08" : "#6B6860", transition:"all .3s" }}>
                {i < step ? "✓" : s.emoji}
              </div>
              {i < total-1 && <div style={{ width:24, height:1.5,
                background: i<step ? "#4CAF82" : "#2A2820", transition:"background .3s" }} />}
            </span>
          ))}
        </div>

        <div style={{ background:"#141412", border:"1px solid #2A2820", borderRadius:16, padding:30,
          boxShadow:"0 4px 32px rgba(0,0,0,.3)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22,
            paddingBottom:18, borderBottom:"1px solid #2A2820" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:"#D4A84314",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{sec.emoji}</div>
            <div>
              <div style={{ fontSize:15, fontWeight:600, color:"#F0EDE6" }}>{sec.title}</div>
              <div style={{ fontSize:11, color:"#6B6860" }}>Step {step+1} of {total}</div>
            </div>
          </div>

          {sec.fields.map(f => (
            <div key={f.id} style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:12.5, fontWeight:500, color:"#B8B4A8", marginBottom:5 }}>
                {f.label}{f.req && <span style={{ color:"#D4A843", marginLeft:3 }}>*</span>}
              </label>
              {f.type==="textarea" ? (
                <textarea value={answers[f.id]||""} onChange={e => update(f.id,e.target.value)}
                  placeholder={f.ph} rows={3}
                  style={{ ...inp, border:"1.5px solid "+(errors[f.id] ? "#E8604C" : answers[f.id] ? "#D4A84355" : "#2A2820"),
                    resize:"vertical", lineHeight:1.6 }} />
              ) : f.type==="select" ? (
                <select value={answers[f.id]||""} onChange={e => update(f.id,e.target.value)}
                  style={{ ...inp, border:"1.5px solid "+(errors[f.id] ? "#E8604C" : (answers[f.id]&&answers[f.id]!=="Select...") ? "#D4A84355" : "#2A2820"),
                    cursor:"pointer" }}>
                  {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type} value={answers[f.id]||""} onChange={e => update(f.id,e.target.value)}
                  placeholder={f.ph}
                  style={{ ...inp, border:"1.5px solid "+(errors[f.id] ? "#E8604C" : answers[f.id] ? "#D4A84355" : "#2A2820") }} />
              )}
              {errors[f.id] && <div style={{ fontSize:11, color:"#E8604C", marginTop:4 }}>Required</div>}
            </div>
          ))}

          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s-1)} style={{ flex:1, padding:"11px", borderRadius:9,
                border:"1px solid #2A2820", background:"transparent", color:"#6B6860", fontSize:13, cursor:"pointer" }}>
                Back
              </button>
            )}
            <button onClick={next} style={{ flex:2, padding:"12px", borderRadius:9, border:"none",
              background:"linear-gradient(135deg,#D4A843,#F0C865)", color:"#0A0A08", fontSize:14, fontWeight:700,
              cursor:"pointer", boxShadow:"0 4px 16px #D4A84333" }}>
              {sending ? "Sending..." : step===total-1 ? "Submit — get my free demo" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentPage({ setPage }) {
  const [view, setView] = useState("overview");
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const logRef = useRef();

  useEffect(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, [logs]);

  const runDemo = () => {
    setRunning(true); setLogs([]);
    let t = 0;
    DEMO_STEPS.forEach((s, i) => {
      t += s.delay;
      setTimeout(() => setLogs(p => [...p, s]), t);
    });
    setTimeout(() => setRunning(false), t + 300);
  };

  const copy = () => {
    navigator.clipboard?.writeText(JSON.stringify(MANIFEST, null, 2));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const tc = t => ({ req:"#D4A843", res:"#4CAF82", body:"#6B6860", crypto:"#8B5CF6", success:"#4CAF82" }[t] || "#B8B4A8");

  return (
    <div style={{ minHeight:"100vh", background:"#0A0A08", paddingTop:80 }}>
      <div style={{ background:"#111110", borderBottom:"1px solid #2A2820", padding:"36px 5% 0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <button onClick={() => setPage("home")} style={{ background:"none", border:"none", color:"#6B6860",
            cursor:"pointer", fontSize:12, marginBottom:14 }}>← Back to website</button>
          <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:24 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:"#8B5CF618", border:"1px solid #8B5CF633",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🤖</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, flexWrap:"wrap" }}>
                <h1 style={{ fontFamily:"Playfair Display", fontSize:26, fontWeight:700, color:"#F0EDE6" }}>Agent API</h1>
                <Tag color="#8B5CF6">AGENT-ACCESSIBLE</Tag>
                <Tag color="#14B8A6">BASE NETWORK</Tag>
                <Tag color="#4CAF82">NO AUTH REQUIRED</Tag>
              </div>
              <p style={{ fontSize:13.5, color:"#6B6860", maxWidth:620, lineHeight:1.7 }}>
                Pineapple Bun AI exposes a REST API with an OpenAI-compatible plugin manifest. AI agents can discover the service, browse plans, submit client briefs, pay in USDC or ETH on Base, and track delivery — all with no human in the loop.
              </p>
            </div>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {[["overview","Overview"],["manifest","AI Plugin Manifest"],["demo","Live Demo"]].map(([id,l]) => (
              <button key={id} onClick={() => setView(id)} style={{
                padding:"9px 18px", borderRadius:"8px 8px 0 0", cursor:"pointer", fontSize:13,
                background: view===id ? "#0A0A08" : "transparent",
                color: view===id ? "#F0EDE6" : "#6B6860",
                border: view===id ? "1px solid #2A2820" : "1px solid transparent",
                borderBottom: "none", fontWeight: view===id ? 500 : 400 }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 5%" }}>
        {view==="overview" && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:14, marginBottom:24 }}>
              {[
                { icon:"🔍", title:"Auto-Discoverable", color:"#8B5CF6",
                  body:"Serves /.well-known/ai-plugin.json — the OpenAI plugin standard. Any compatible agent framework auto-discovers and uses the service." },
                { icon:"📋", title:"OpenAPI 3.0 Spec", color:"#5B9BD5",
                  body:"Full spec at /.well-known/openapi.json. Three endpoints: GET /plans, POST /orders, GET /orders/{id}." },
                { icon:"💎", title:"Crypto Payments", color:"#14B8A6",
                  body:"Accepts USDC and ETH on Base (chain 8453). Fees under $0.01. Payment confirmation is automatic and on-chain." },
                { icon:"🔐", title:"No Auth Required", color:"#D4A843",
                  body:"All endpoints are public. No API key needed. The crypto payment IS the authentication." },
                { icon:"📦", title:"Milestone Tracking", color:"#4CAF82",
                  body:"Every order returns a milestones array. Poll GET /orders/{id} to track progress across the 3-7 day build." },
                { icon:"📡", title:"Webhook Callbacks", color:"#E8604C",
                  body:"Register a callback URL on order creation to receive push notifications on payment, production and delivery." },
              ].map((c,i) => (
                <div key={i}
                  onMouseEnter={e => e.currentTarget.style.borderColor=c.color+"44"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="#2A2820"}
                  style={{ background:"#141412", border:"1px solid #2A2820", borderRadius:12, padding:20, transition:"border-color .2s" }}>
                  <div style={{ fontSize:22, marginBottom:10 }}>{c.icon}</div>
                  <div style={{ fontSize:13.5, fontWeight:600, color:"#F0EDE6", marginBottom:6 }}>{c.title}</div>
                  <div style={{ fontSize:12, color:"#6B6860", lineHeight:1.65 }}>{c.body}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Box>
                <div style={{ fontSize:10, fontFamily:"DM Mono", color:"#8B5CF6", letterSpacing:2, marginBottom:14 }}>API ENDPOINTS</div>
                {[
                  { m:"GET",  p:"/api/v1/plans",        c:"#4CAF82", d:"List plans with USD and crypto prices" },
                  { m:"POST", p:"/api/v1/orders",       c:"#D4A843", d:"Submit brief and get payment address" },
                  { m:"GET",  p:"/api/v1/orders/{id}",  c:"#4CAF82", d:"Check status and milestones" },
                ].map((e,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0",
                    borderBottom: i<2 ? "1px solid #2A2820" : "none" }}>
                    <span style={{ fontSize:10, fontFamily:"DM Mono", padding:"2px 8px", borderRadius:4,
                      background: e.c==="green" ? "#4CAF8218" : "#D4A84318",
                      color: e.c, minWidth:40, textAlign:"center" }}>{e.m}</span>
                    <span style={{ fontSize:11.5, fontFamily:"DM Mono", color:"#B8B4A8", flex:1 }}>{e.p}</span>
                    <span style={{ fontSize:11.5, color:"#6B6860" }}>{e.d}</span>
                  </div>
                ))}
              </Box>
              <Box accent="#14B8A6">
                <div style={{ fontSize:10, fontFamily:"DM Mono", color:"#14B8A6", letterSpacing:2, marginBottom:14 }}>PAYMENT FLOW</div>
                {["Agent calls POST /orders","Receives Base wallet address and amount","Sends USDC or ETH on-chain","Payment auto-detected on Base","Order moves to in_production","Website delivered in 3-7 days"].map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:9, alignItems:"flex-start" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:"#14B8A620",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, color:"#14B8A6", flexShrink:0 }}>{i+1}</div>
                    <span style={{ fontSize:12.5, color:"#B8B4A8" }}>{s}</span>
                  </div>
                ))}
                <div style={{ marginTop:12, padding:"8px 12px", background:"#14B8A610",
                  border:"1px solid #14B8A630", borderRadius:8, fontSize:11, color:"#B8B4A8" }}>
                  Chain: Base (8453) &middot; Tokens: USDC, ETH &middot; Fees: &lt;$0.01 &middot; Finality: ~2s
                </div>
              </Box>
            </div>
          </div>
        )}

        {view==="manifest" && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div>
                <div style={{ fontFamily:"Playfair Display", fontSize:20, fontWeight:700, color:"#F0EDE6", marginBottom:3 }}>AI Plugin Manifest</div>
                <div style={{ fontSize:11, color:"#6B6860", fontFamily:"DM Mono" }}>Served at: https://pineapplebun.ai/.well-known/ai-plugin.json</div>
              </div>
              <Btn small outline onClick={copy}>{copied ? "Copied!" : "Copy JSON"}</Btn>
            </div>
            <div style={{ background:"#0D0D0B", border:"1px solid #2A2820", borderRadius:12, padding:24,
              fontFamily:"DM Mono", fontSize:12.5, lineHeight:1.9, overflowX:"auto" }}>
              {JSON.stringify(MANIFEST, null, 2).split("\n").map((line, i) => {
                const isKey = /^\s+"[^"]+":/.test(line);
                const isStrVal = /: "[^"]+"/.test(line);
                return (
                  <div key={i} style={{ color: isKey ? "#D4A843" : isStrVal ? "#4CAF82" : "#6B6860" }}>{line}</div>
                );
              })}
            </div>
          </div>
        )}

        {view==="demo" && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            <div style={{ fontFamily:"Playfair Display", fontSize:20, fontWeight:700, color:"#F0EDE6", marginBottom:6 }}>Agent Interaction Demo</div>
            <p style={{ fontSize:13, color:"#6B6860", marginBottom:20 }}>Watch a simulated AI agent discover the API, select a plan, pay in USDC on Base, and track delivery — no human required.</p>
            <div style={{ background:"#0D0D0B", border:"1px solid #2A2820", borderRadius:12, overflow:"hidden", marginBottom:16 }}>
              <div style={{ background:"#141412", padding:"10px 16px", borderBottom:"1px solid #2A2820",
                display:"flex", alignItems:"center", gap:8 }}>
                {["#E8604C","#D4A843","#4CAF82"].map((col,i) => (
                  <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:col }} />
                ))}
                <span style={{ fontSize:11, fontFamily:"DM Mono", color:"#6B6860", marginLeft:8 }}>agent_session — pineapplebun.ai/api/v1</span>
                <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                  <Tag color="#8B5CF6">AI AGENT</Tag>
                  <Tag color="#14B8A6">BASE NETWORK</Tag>
                </div>
              </div>
              <div ref={logRef} style={{ padding:22, fontFamily:"DM Mono", fontSize:12, minHeight:300,
                lineHeight:2, maxHeight:400, overflowY:"auto" }}>
                {logs.length===0 && !running && (
                  <div style={{ color:"#6B6860", textAlign:"center", paddingTop:60 }}>
                    <div style={{ fontSize:32, marginBottom:12 }}>🤖</div>
                    <div>Press Run Demo to watch an agent place an order end-to-end</div>
                  </div>
                )}
                {logs.map((l,i) => (
                  <div key={i} style={{ color:tc(l.t), marginBottom:1, animation:"fadeIn .25s ease" }}>
                    <span style={{ color:"#2A2820", marginRight:14, userSelect:"none", fontSize:10 }}>{String(i+1).padStart(2,"0")}</span>
                    {l.msg}
                  </div>
                ))}
                {running && logs.length > 0 && <span style={{ color:"#D4A843", animation:"blink 1s infinite" }}>&#9608;</span>}
              </div>
            </div>
            <Btn onClick={runDemo} disabled={running}>{running ? "Running..." : "Run Demo"}</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background:"#0A0A08", borderTop:"1px solid #2A2820", padding:"40px 5%" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between",
        alignItems:"flex-start", flexWrap:"wrap", gap:24, marginBottom:24 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
            <span style={{ fontSize:20 }}>🍍</span>
            <div style={{ fontFamily:"Playfair Display", fontSize:14, fontWeight:700, color:"#F0EDE6" }}>Pineapple Bun AI</div>
          </div>
          <div style={{ fontSize:12, color:"#6B6860", maxWidth:220, lineHeight:1.7, marginBottom:12 }}>AI-powered websites for SMEs worldwide. Built by Kim.</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <Tag color="#8B5CF6">Agent API</Tag>
            <Tag color="#14B8A6">Base Network</Tag>
            <Tag color="#4CAF82">USDC and ETH</Tag>
          </div>
        </div>
        <div style={{ display:"flex", gap:36, flexWrap:"wrap" }}>
          {[
            ["Product", ["How it works","Client results","Pricing"]],
            ["Developers", ["For AI Agents","AI Plugin Manifest","OpenAPI Spec"]],
            ["Contact", ["hello@pineapplebun.ai","pineapplebun.ai"]],
          ].map(([h, items]) => (
            <div key={h}>
              <div style={{ fontSize:9.5, fontFamily:"DM Mono", color:"#D4A843", letterSpacing:1.5, marginBottom:12 }}>{h.toUpperCase()}</div>
              {items.map(item => (
                <div key={item}
                  onClick={() => item==="For AI Agents" && setPage("agents")}
                  onMouseEnter={e => e.currentTarget.style.color="#B8B4A8"}
                  onMouseLeave={e => e.currentTarget.style.color="#6B6860"}
                  style={{ fontSize:12, color:"#6B6860", marginBottom:7, cursor:"pointer" }}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", paddingTop:20, borderTop:"1px solid #2A2820",
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <span style={{ fontSize:11, color:"#6B6860" }}>&#169; 2025 Pineapple Bun AI &middot; All rights reserved</span>
        <span style={{ fontSize:11, color:"#6B6860" }}>Base network payments &middot; No spam &middot; Cancel anytime</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div style={{ minHeight:"100vh", background:"#0A0A08" }}>
      <style>{CSS}</style>
      <Nav page={page} setPage={setPage} />
      {page === "agents" ? (
        <AgentPage setPage={setPage} />
      ) : (
        <>
          <Ticker />
          <Hero setPage={setPage} />
          <HowItWorks />
          <ClientResults />
          <Pricing />
          <ContactForm />
          <Footer setPage={setPage} />
        </>
      )}
    </div>
  );
}
