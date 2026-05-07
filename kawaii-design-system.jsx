import { useState } from "react";

const sections = [
  "Einleitung & Philosophie",
  "Subgenres & Flavors",
  "Farbsystem",
  "Typografie",
  "Spacing & Shape",
  "UI Elemente",
  "Motion & Micro-Interactions",
  "Ikonografie & Dekoration",
  "Sonderfälle & Ausreißer",
  "Token-Referenz",
];

const Tag = ({ children, color = "#f9a8d4" }) => (
  <span
    style={{
      background: color,
      borderRadius: "999px",
      padding: "2px 10px",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      color: "#3b1f2b",
      display: "inline-block",
      marginRight: 4,
      marginBottom: 4,
    }}
  >
    {children}
  </span>
);

const ColorSwatch = ({ hex, name, note }) => (
  <div style={{ textAlign: "center", width: 90 }}>
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: 20,
        background: hex,
        margin: "0 auto 6px",
        border: "2px solid rgba(0,0,0,0.08)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    />
    <div style={{ fontSize: 11, fontWeight: 700, color: "#3b1f2b" }}>{name}</div>
    <div style={{ fontSize: 10, color: "#9c7b8a", fontFamily: "monospace" }}>{hex}</div>
    {note && <div style={{ fontSize: 9, color: "#c4a5b5", marginTop: 2 }}>{note}</div>}
  </div>
);

const UIDemo = ({ label, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#c4a5b5",
        marginBottom: 10,
      }}
    >
      {label}
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      {children}
    </div>
  </div>
);

const Pill = ({ children, variant = "primary" }) => {
  const variants = {
    primary: { bg: "#fce4ec", border: "#f48fb1", color: "#880e4f" },
    mint: { bg: "#e0f7f4", border: "#80cbc4", color: "#004d40" },
    lavender: { bg: "#ede7f6", border: "#b39ddb", color: "#311b92" },
    peach: { bg: "#fff3e0", border: "#ffcc80", color: "#bf360c" },
    white: { bg: "#fff", border: "#f8bbd0", color: "#880e4f" },
  };
  const v = variants[variant] || variants.primary;
  return (
    <span
      style={{
        background: v.bg,
        border: `1.5px solid ${v.border}`,
        color: v.color,
        borderRadius: 999,
        padding: "6px 16px",
        fontSize: 13,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {children}
    </span>
  );
};

const KawaiiButton = ({ children, variant = "filled", icon }) => {
  const [hover, setHover] = useState(false);
  const styles = {
    filled: {
      bg: hover ? "#f06292" : "#f48fb1",
      color: "#fff",
      border: "none",
      shadow: hover ? "0 6px 20px #f4428155" : "0 3px 10px #f4428133",
      transform: hover ? "translateY(-2px) scale(1.03)" : "none",
    },
    outline: {
      bg: hover ? "#fce4ec" : "transparent",
      color: "#c2185b",
      border: "2px solid #f48fb1",
      shadow: "none",
      transform: hover ? "translateY(-1px)" : "none",
    },
    ghost: {
      bg: hover ? "#fce4ec55" : "transparent",
      color: "#ad1457",
      border: "none",
      shadow: "none",
      transform: hover ? "translateY(-1px)" : "none",
    },
  };
  const s = styles[variant];
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: s.bg,
        color: s.color,
        border: s.border || "none",
        borderRadius: 999,
        padding: "9px 22px",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        boxShadow: s.shadow,
        transform: s.transform,
        transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        fontFamily: "inherit",
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

const InputDemo = ({ placeholder, icon }) => (
  <div
    style={{
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
    }}
  >
    {icon && (
      <span style={{ position: "absolute", left: 14, fontSize: 16, opacity: 0.5 }}>{icon}</span>
    )}
    <input
      placeholder={placeholder}
      style={{
        background: "#fff",
        border: "2px solid #f8bbd0",
        borderRadius: 999,
        padding: icon ? "9px 16px 9px 38px" : "9px 18px",
        fontSize: 14,
        color: "#3b1f2b",
        outline: "none",
        fontFamily: "inherit",
        width: 220,
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#f48fb1")}
      onBlur={(e) => (e.target.style.borderColor = "#f8bbd0")}
    />
  </div>
);

const CardDemo = ({ title, desc, badge, variant = "default" }) => {
  const variants = {
    default: { bg: "#fff", border: "#fce4ec", accent: "#f48fb1" },
    mint: { bg: "#f0fffe", border: "#b2dfdb", accent: "#80cbc4" },
    lavender: { bg: "#f5f0ff", border: "#d1c4e9", accent: "#b39ddb" },
  };
  const v = variants[variant];
  return (
    <div
      style={{
        background: v.bg,
        border: `2px solid ${v.border}`,
        borderRadius: 20,
        padding: "18px 20px",
        width: 200,
        position: "relative",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      {badge && (
        <span
          style={{
            position: "absolute",
            top: -10,
            right: 14,
            background: v.accent,
            color: "#fff",
            borderRadius: 999,
            padding: "2px 10px",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {badge}
        </span>
      )}
      <div style={{ fontSize: 28, marginBottom: 8 }}>🌸</div>
      <div style={{ fontWeight: 700, color: "#3b1f2b", marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: "#9c7b8a", lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
};

const BadgeDemo = ({ children, emoji, color }) => (
  <span
    style={{
      background: color || "#fce4ec",
      borderRadius: 12,
      padding: "5px 12px 5px 8px",
      fontSize: 12,
      fontWeight: 700,
      color: "#3b1f2b",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      border: "1.5px solid rgba(0,0,0,0.05)",
    }}
  >
    <span style={{ fontSize: 14 }}>{emoji}</span>
    {children}
  </span>
);

const SubgenreCard = ({ name, emoji, palette, desc, tags, outlier }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 24,
      padding: "20px",
      border: "2px solid #fce4ec",
      flex: "1 1 260px",
      maxWidth: 320,
      position: "relative",
      boxShadow: "0 4px 24px rgba(244,143,177,0.1)",
    }}
  >
    {outlier && (
      <span
        style={{
          position: "absolute",
          top: -10,
          left: 16,
          background: "#311b92",
          color: "#ede7f6",
          borderRadius: 999,
          padding: "2px 12px",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.05em",
        }}
      >
        AUSREISSER ✦
      </span>
    )}
    <div style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</div>
    <div style={{ fontWeight: 800, fontSize: 16, color: "#3b1f2b", marginBottom: 6 }}>{name}</div>
    <div
      style={{
        display: "flex",
        gap: 6,
        marginBottom: 10,
        flexWrap: "wrap",
      }}
    >
      {palette.map((c, i) => (
        <div
          key={i}
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            background: c,
            border: "1.5px solid rgba(0,0,0,0.1)",
          }}
        />
      ))}
    </div>
    <div style={{ fontSize: 12, color: "#6d4c61", lineHeight: 1.6, marginBottom: 10 }}>{desc}</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {tags.map((t, i) => (
        <Tag key={i} color={palette[i % palette.length] + "88"}>
          {t}
        </Tag>
      ))}
    </div>
  </div>
);

const TokenRow = ({ name, value, type }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 14px",
      borderBottom: "1px solid #fce4ec",
      fontSize: 13,
    }}
  >
    <span
      style={{
        fontFamily: "monospace",
        background: "#fce4ec",
        padding: "2px 8px",
        borderRadius: 6,
        fontSize: 12,
        color: "#880e4f",
        minWidth: 220,
        display: "inline-block",
      }}
    >
      {name}
    </span>
    {type === "color" && (
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          background: value,
          display: "inline-block",
          border: "1.5px solid rgba(0,0,0,0.1)",
          flexShrink: 0,
        }}
      />
    )}
    <span style={{ color: "#6d4c61", fontFamily: "monospace", fontSize: 12 }}>{value}</span>
  </div>
);

export default function KawaiiDesignSystem() {
  const [active, setActive] = useState(0);

  const renderSection = () => {
    switch (active) {
      case 0:
        return (
          <div>
            <div
              style={{
                background: "linear-gradient(135deg, #fce4ec 0%, #ede7f6 50%, #e0f7f4 100%)",
                borderRadius: 28,
                padding: "32px 36px",
                marginBottom: 28,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  fontSize: 100,
                  opacity: 0.12,
                }}
              >
                ✿
              </div>
              <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em" }}>
                KAWAII DESIGN SYSTEM · V1.0
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#3b1f2b",
                  lineHeight: 1.2,
                  marginBottom: 12,
                }}
              >
                Design mit Herz,<br />
                <span style={{ color: "#e91e8c" }}>nicht mit Kitsch.</span>
              </div>
              <div style={{ fontSize: 14, color: "#6d4c61", lineHeight: 1.8, maxWidth: 560 }}>
                Kawaii (可愛い) bedeutet im Japanischen ursprünglich "beschämend strahlend" — ein Erröten, 
                das Verletzlichkeit und Charme verbindet. Kein süßlicher Zufall, sondern eine 
                <strong> kulturelle Philosophie der emotionalen Offenheit</strong>. Dieses Design System 
                übersetzt diese Philosophie in konkrete UI-Tokens, Komponenten und Sonderfälle — 
                von soft-pastell bis zur kantigsten Subgenre-Variation.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
              {[
                { icon: "💗", title: "Emotionale Resonanz", desc: "Jedes Element kommuniziert ein Gefühl. Kein neutrales UI — alles hat einen emotionalen Fingerabdruck." },
                { icon: "🫧", title: "Weiche Geometrie", desc: "Keine harten Kanten. Rounded Corners, Blob-Shapes, organische Formen dominieren die Morphologie." },
                { icon: "✨", title: "Joy-First UX", desc: "Interaktionen sollen Freude auslösen. Micro-Animations, Bounce-Effekte und Feedback-Sound sind keine Extras, sondern Kern." },
                { icon: "🎭", title: "Subkultur-Bewusstsein", desc: "Kawaii ist kein monolithischer Stil. 8+ Subgenres mit eigenen Regeln — von Pastel bis Dark Kawaii." },
                { icon: "♿", title: "Accessible Cuteness", desc: "Pastell ≠ schlechter Kontrast. WCAG AA ist Pflicht. Schönheit ohne Ausgrenzung." },
                { icon: "🌀", title: "Ausreißer als System", desc: "Das System definiert bewusst Ausnahmeregeln: Momente wo Regeln gebrochen werden — als Feature, nicht als Bug." },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "18px 20px",
                    border: "2px solid #fce4ec",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#9c7b8a", lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff8fe", borderRadius: 20, padding: "20px 24px", border: "2px dashed #f8bbd0" }}>
              <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 8 }}>📌 Inspirations-Quellen & Kontext</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  "Sanrio / Hello Kitty (1974)",
                  "Harajuku Street Fashion",
                  "Dribbble Kawaii UI (Salman Khan)",
                  "Coquettecore / Balletcore Web Trend (2023–25)",
                  "Wix Web Trends 2025",
                  "Aesthetics Wiki (Fandom)",
                  "Kittl Kawaii Design Guide",
                  "Dark Kawaii / Kuromi Rise (Bokksu 2025)",
                  "AWWWARDS Award Sites",
                  "Yami Kawaii Academic Paper (Taylor & Francis 2025)",
                ].map((s, i) => (
                  <Tag key={i} color={["#fce4ec","#ede7f6","#e0f7f4","#fff3e0","#e8f5e9"][i % 5]}>
                    {s}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 700, marginBottom: 4, letterSpacing: "0.08em" }}>
              KULTURELLE TAXONOMIE
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#3b1f2b", marginBottom: 8 }}>
              Die 8 Kawaii-Subgenres
            </div>
            <div style={{ fontSize: 13, color: "#9c7b8a", marginBottom: 28, lineHeight: 1.7 }}>
              Jedes Subgenre hat eigene Design-Regeln. Ein Design System muss wählen oder explizit mischen.
              Diese Übersicht hilft bei der Positionierung — Sonderfälle sind als <strong>AUSREISSER</strong> markiert.
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
              <SubgenreCard
                name="Pastel Kawaii"
                emoji="🌸"
                palette={["#fce4ec", "#e8f5e9", "#e3f2fd", "#fff9c4", "#ede7f6"]}
                desc="Der Ursprung. Soft, dreamy, beruhigend. Rilakkuma-Energie. Baby-Pinks, Mint-Greens, Sky-Blues. Dominiert Lifestyle-Apps, Creator-Branding, Wellness."
                tags={["Soft Corners", "Low Contrast", "Dreamy BG", "Cute Mascots", "Pastel-only Palette"]}
              />
              <SubgenreCard
                name="Pop Kawaii"
                emoji="⭐"
                palette={["#ff80ab", "#ffeb3b", "#40c4ff", "#69f0ae", "#ea80fc"]}
                desc="Laut, bunt, energetisch. Satte Primärfarben + Pastell-Akzente. Charakter-Design mit übergroßen Augen. Pokémon-Vibes. Ideal für Games, Kids-Apps."
                tags={["Bold Colors", "Character Icons", "High Energy", "Thick Outlines", "Star Motifs"]}
              />
              <SubgenreCard
                name="Yume Kawaii"
                emoji="🌙"
                palette={["#ce93d8", "#f48fb1", "#90caf9", "#fff9c4", "#b3e5fc"]}
                desc="'Dreamlike Cute'. Zwischen Vaporwave und Anime. Surreale Floating-Elemente — Sterne, Monde, Wolken. Nostalgisch-futuristisch."
                tags={["Stars & Clouds", "Ethereal BG", "Gradient Skies", "Floating Objects", "Nostalgic"]}
              />
              <SubgenreCard
                name="Decora Kawaii"
                emoji="🎀"
                palette={["#ff1744", "#00e5ff", "#ffea00", "#76ff03", "#d500f9"]}
                desc="Maximalistisches Layering. Neon-on-neon. Keine Atempause. Harajuku-Decora-Bewegung. Designprinzip: Mehr ist mehr ist mehr. Mutig für Landing-Pages."
                tags={["Neon Contrast", "Maximalism", "Layered Elements", "Colorful Overflow", "Decora Clips"]}
              />
              <SubgenreCard
                name="Tech Kawaii"
                emoji="🤖"
                palette={["#80deea", "#b9f6ca", "#ea80fc", "#1a1a2e", "#ffffff"]}
                desc="Kawaii trifft Sci-Fi. Pastel-farbene Cyborgs, digitale Mascots, eckigere Typografie aber weiche Formen. Ideal für Tech-Startups, die nicht kalt wirken wollen."
                tags={["Pastel + Dark BG", "Sharp Accents", "Digital Mascot", "Neon Glows", "Cyber Forms"]}
              />
              <SubgenreCard
                name="Yami Kawaii"
                emoji="🩹"
                palette={["#1a0a12", "#9c27b0", "#f06292", "#fce4ec", "#ffffff"]}
                desc="'Sickly Cute'. Dunkle Basis + pastellige Akzente als Widerspruch. Emotionale Ehrlichkeit als Gestaltungsprinzip. Für Brands die Tiefe zeigen wollen."
                tags={["Dark Base", "Pastel Pop", "Emotional Depth", "Contrast", "Gothic Ribbons"]}
                outlier
              />
              <SubgenreCard
                name="Pastel Goth"
                emoji="💀"
                palette={["#e1bee7", "#f8bbd0", "#263238", "#4a148c", "#880e4f"]}
                desc="Gothic Struktur + Pastell-Palette. Spinnweben in Rosa. Totenschädel in Lavendel. Starke Hierachie, dramatische Typografie aber weiche Farben."
                tags={["Skull Motifs", "Pastel Palette", "Gothic Structure", "Dark Typography", "Lace Borders"]}
                outlier
              />
              <SubgenreCard
                name="Otona Kawaii"
                emoji="🌷"
                palette={["#f5f5f5", "#fce4ec", "#d4a7b8", "#8d6e82", "#3b1f2b"]}
                desc="'Grown-Up Cute'. Reifes Kawaii für erwachsene Audiences. Weniger Charaktere, mehr Textur. Pastellig aber mit Substanz. Ideal für Premium-Brands."
                tags={["Refined", "Minimal Characters", "Soft Neutrals", "Premium Feel", "Elegant Curves"]}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 700, marginBottom: 4, letterSpacing: "0.08em" }}>
              COLOR SYSTEM
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#3b1f2b", marginBottom: 20 }}>
              Farbpaletten & Semantik
            </div>

            {[
              {
                label: "🌸 Core Palette — Pastel Kawaii (Basis)",
                swatches: [
                  { hex: "#fce4ec", name: "Blossom", note: "BG / Surface" },
                  { hex: "#f48fb1", name: "Petal", note: "Primary" },
                  { hex: "#e91e8c", name: "Bloom", note: "CTA / Focus" },
                  { hex: "#880e4f", name: "Deep Rose", note: "Text on Light" },
                  { hex: "#3b1f2b", name: "Plum Ink", note: "Body Text" },
                  { hex: "#fff0f5", name: "Cream Blush", note: "Page BG" },
                ],
              },
              {
                label: "🫧 Secondary Palette — Mint & Lavender",
                swatches: [
                  { hex: "#e0f7f4", name: "Foam", note: "Surface Alt" },
                  { hex: "#80cbc4", name: "Seafoam", note: "Secondary" },
                  { hex: "#ede7f6", name: "Misty Lilac", note: "Surface Alt 2" },
                  { hex: "#b39ddb", name: "Wisteria", note: "Accent" },
                  { hex: "#fff9c4", name: "Lemon Cream", note: "Highlight" },
                  { hex: "#ffcc80", name: "Peach Glow", note: "Warning / Warm" },
                ],
              },
              {
                label: "🤖 Tech Kawaii Dark — Overlay-Palette",
                swatches: [
                  { hex: "#0d0d1a", name: "Void", note: "Dark BG" },
                  { hex: "#1a1a2e", name: "Deep Space", note: "Card BG" },
                  { hex: "#ea80fc", name: "Cyber Orchid", note: "Neon Accent" },
                  { hex: "#80deea", name: "Hologram", note: "Link / Active" },
                  { hex: "#f48fb1", name: "Neon Petal", note: "CTA on Dark" },
                  { hex: "#f5f5f5", name: "Ghost White", note: "Text on Dark" },
                ],
              },
              {
                label: "💀 Yami / Pastel Goth — Dark Fusion",
                swatches: [
                  { hex: "#1a0a12", name: "Nightshade", note: "Dark Base" },
                  { hex: "#4a0032", name: "Velvet", note: "Surface" },
                  { hex: "#9c27b0", name: "Toxic Bloom", note: "Accent" },
                  { hex: "#f06292", name: "Bruised Pink", note: "CTA" },
                  { hex: "#fce4ec", name: "Ghost Petal", note: "Text Accent" },
                  { hex: "#e0e0e0", name: "Ash", note: "Body Text" },
                ],
              },
            ].map((group, i) => (
              <div key={i} style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#6d4c61", marginBottom: 12 }}>
                  {group.label}
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {group.swatches.map((s, j) => (
                    <ColorSwatch key={j} {...s} />
                  ))}
                </div>
              </div>
            ))}

            <div style={{ background: "#fff8fe", borderRadius: 20, padding: "20px 24px", border: "2px solid #fce4ec", marginTop: 8 }}>
              <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 12 }}>⚠️ Kontrast-Regeln</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13, color: "#6d4c61" }}>
                {[
                  ["✅ Petal (#f48fb1) auf Cream Blush (#fff0f5)", "Kontrast 2.8:1 — nur für Deko, nicht für Text"],
                  ["✅ Plum Ink (#3b1f2b) auf Blossom (#fce4ec)", "Kontrast 10.4:1 — AA+++ für Body Text"],
                  ["✅ Deep Rose (#880e4f) auf Blossom (#fce4ec)", "Kontrast 8.2:1 — WCAG AA für alle Größen"],
                  ["❌ Petal (#f48fb1) auf Weiß für Body Text", "Kontrast 2.6:1 — nicht WCAG-konform!"],
                  ["✅ Ghost White auf Void (#0d0d1a)", "Kontrast 18:1 — perfekt für Dark Mode"],
                  ["⚠️ Pastel auf Pastel", "Nur dekorativ. Nie für Interface-Texte."],
                ].map(([label, note], i) => (
                  <div key={i} style={{ padding: "10px 12px", background: "#fff", borderRadius: 12, border: "1.5px solid #fce4ec" }}>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#9c7b8a" }}>{note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 700, marginBottom: 4, letterSpacing: "0.08em" }}>
              TYPOGRAPHY SYSTEM
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#3b1f2b", marginBottom: 20 }}>
              Schrift & Hierarchie
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
              {[
                {
                  role: "Display / Hero",
                  desc: "Rounded Display oder Bubble-Font. Großartig für Headlines, Logos, Splash-Screens.",
                  examples: ["Nunito (Google)", "Comfortaa", "Pacifico", "Fredoka One", "Quicksand Bold"],
                  note: "Keine spitzen Ecken. Runde Abschlüsse sind Pflicht.",
                  color: "#fce4ec",
                },
                {
                  role: "Heading / Section",
                  desc: "Rounded Sans-Serif mit leichtem Charakter. Lesbar aber still verspielt.",
                  examples: ["Nunito", "Poppins", "Outfit (softer)", "Rubik"],
                  note: "Leicht heavier weight (700–800). Kein Ultra-Bold bei Pastel-Kontext.",
                  color: "#ede7f6",
                },
                {
                  role: "Body Text",
                  desc: "Klare, runde Sans-Serif. Muss bei kleinen Größen excellente Lesbarkeit haben.",
                  examples: ["Nunito (400)", "Jost", "DM Sans", "Plus Jakarta Sans"],
                  note: "Mind. 14px, 1.6–1.8 line-height. Kein zu helles Pastell als Textfarbe.",
                  color: "#e0f7f4",
                },
                {
                  role: "Accent / Decorative",
                  desc: "Handschrift, Pixel-Font oder Balloon-Font für Highlights, Badges, Sticker-artige Elemente.",
                  examples: ["Caveat", "Patrick Hand", "VT323 (Pixel, Tech Kawaii)", "Pacifico"],
                  note: "Nur sparsam — max. 1 Sonderelement pro Screen.",
                  color: "#fff9c4",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: item.color,
                    borderRadius: 20,
                    padding: "18px 20px",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#3b1f2b", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {item.role}
                  </div>
                  <div style={{ fontSize: 12, color: "#6d4c61", lineHeight: 1.6, marginBottom: 10 }}>{item.desc}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                    {item.examples.map((e, j) => (
                      <Tag key={j}>{e}</Tag>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#9c7b8a", fontStyle: "italic" }}>💡 {item.note}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", border: "2px solid #fce4ec", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 16 }}>Typografische Hierarchie — Beispiel</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#e91e8c", lineHeight: 1.1, marginBottom: 6 }}>
                Alles mit Liebe gemacht ✿
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#3b1f2b", marginBottom: 8 }}>
                Dein neues Lieblingsprodukt ist endlich da
              </div>
              <div style={{ fontSize: 14, color: "#6d4c61", lineHeight: 1.8, marginBottom: 16, maxWidth: 480 }}>
                Weicher als eine Wolke, süßer als Mochi — unsere neue Kollektion verbindet 
                japanische Sorgfalt mit zeitlosem Design. Jedes Detail ist mit Herz entworfen worden.
              </div>
              <div style={{ fontSize: 11, color: "#c4a5b5", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                12. Mai 2025 · Tokyo Collection
              </div>
            </div>

            <div style={{ background: "#1a0a12", borderRadius: 20, padding: "24px 28px", border: "2px solid #4a0032" }}>
              <div style={{ fontWeight: 800, color: "#f8bbd0", marginBottom: 16, fontSize: 13, letterSpacing: "0.08em" }}>
                ✦ DARK KAWAII TYPOGRAFIE-REGELN
              </div>
              {[
                "Display-Fonts: eckiger, schärfer — aber noch leicht gerundet. Z.B. Syne, Outfit ExtraBold",
                "Body: heller Text auf dunklem Grund — #f5f5f5 oder #e0e0e0 auf #0d0d1a",
                "Akzent-Font: Glow-Effekt per text-shadow in Neon-Pink oder Cyan",
                "Letter-Spacing: etwas weiter bei Headings (0.05–0.1em) für mehr Drama",
                "Caps-Lock für Section Labels in Dark Kawaii — erzeugt Spannung",
              ].map((rule, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: "#f06292", flexShrink: 0 }}>◆</span>
                  <div style={{ fontSize: 13, color: "#e0c8d4", lineHeight: 1.6 }}>{rule}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 700, marginBottom: 4, letterSpacing: "0.08em" }}>
              SPACING & SHAPE SYSTEM
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#3b1f2b", marginBottom: 20 }}>
              Formen, Radien & Abstände
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, color: "#3b1f2b", marginBottom: 12 }}>Border Radius Scale</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                {[
                  { r: 4, label: "xs — 4px", note: "Nur Tech Kawaii" },
                  { r: 8, label: "sm — 8px", note: "Tags, inline" },
                  { r: 12, label: "md — 12px", note: "Chips, small cards" },
                  { r: 20, label: "lg — 20px", note: "Cards, Modals" },
                  { r: 28, label: "xl — 28px", note: "Hero Cards" },
                  { r: 999, label: "pill — 999px", note: "Buttons, Badges" },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: 64 + i * 8,
                        height: 64 + i * 8,
                        background: "#fce4ec",
                        borderRadius: item.r,
                        border: "2px solid #f48fb1",
                        margin: "0 auto 8px",
                      }}
                    />
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#3b1f2b" }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: "#9c7b8a" }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, color: "#3b1f2b", marginBottom: 12 }}>Spacing Scale (4px Base)</div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                {[4, 8, 12, 16, 24, 32, 48, 64, 96].map((val, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: 24,
                        height: val,
                        background: `hsl(${330 - i * 10}, ${80 - i * 2}%, ${88 + i}%)`,
                        borderRadius: 4,
                        margin: "0 auto 4px",
                        border: "1px solid #f4429933",
                      }}
                    />
                    <div style={{ fontSize: 9, color: "#9c7b8a" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, color: "#3b1f2b", marginBottom: 12 }}>Shadow Scale</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { label: "shadow-sm", val: "0 2px 8px rgba(244,66,145,0.12)", note: "Cards, inactive" },
                  { label: "shadow-md", val: "0 4px 20px rgba(244,66,145,0.18)", note: "Hover, aktiv" },
                  { label: "shadow-lg", val: "0 8px 40px rgba(244,66,145,0.25)", note: "Modals, focus" },
                  { label: "shadow-glow", val: "0 0 24px rgba(233,30,140,0.4)", note: "Dark Kawaii glow" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "16px 18px",
                      boxShadow: item.val,
                      minWidth: 150,
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "#c2185b", marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#9c7b8a" }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff8fe", borderRadius: 20, padding: "20px 24px", border: "2px solid #fce4ec" }}>
              <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 12 }}>🫧 Shape Language Regeln</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13, color: "#6d4c61" }}>
                {[
                  "Alles hat mind. border-radius: 12px — Ausnahme nur für Tech-Kawaii",
                  "Blob-SVGs als Background-Decorations in Pastel-Tönen",
                  "Ecken sind immer runder als Standard-UI — Grundregel: 2× der normalen Convention",
                  "Cards bevorzugen border statt Schatten bei hellen Hintergründen",
                  "Schatten immer in Farbe (nicht grau) — Petal-Schatten statt Box-Shadow schwarz",
                  "Pill-Buttons sind Standard. Square-Buttons nur in Tech/Yami-Kontext",
                ].map((rule, i) => (
                  <div key={i} style={{ padding: "10px 12px", background: "#fff", borderRadius: 12, border: "1.5px solid #fce4ec", display: "flex", gap: 8 }}>
                    <span style={{ color: "#f48fb1", flexShrink: 0 }}>✿</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 700, marginBottom: 4, letterSpacing: "0.08em" }}>
              UI COMPONENTS
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#3b1f2b", marginBottom: 20 }}>
              Komponenten-Bibliothek
            </div>

            <UIDemo label="Buttons — Pill (Standard)">
              <KawaiiButton variant="filled" icon="🌸">Primär</KawaiiButton>
              <KawaiiButton variant="outline" icon="✨">Sekundär</KawaiiButton>
              <KawaiiButton variant="ghost">Ghost</KawaiiButton>
              <button style={{ background: "linear-gradient(135deg, #f48fb1, #ce93d8)", color: "#fff", border: "none", borderRadius: 999, padding: "9px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                🎀 Gradient CTA
              </button>
            </UIDemo>

            <UIDemo label="Badges & Tags">
              <BadgeDemo emoji="🌸" color="#fce4ec">Neu</BadgeDemo>
              <BadgeDemo emoji="⭐" color="#fff9c4">Featured</BadgeDemo>
              <BadgeDemo emoji="💜" color="#ede7f6">Premium</BadgeDemo>
              <BadgeDemo emoji="🎀" color="#f8bbd0">Sale</BadgeDemo>
              <BadgeDemo emoji="✨" color="#e0f7f4">Aktiv</BadgeDemo>
            </UIDemo>

            <UIDemo label="Pills / Chips">
              <Pill variant="primary">Kategorie</Pill>
              <Pill variant="mint">🍃 Natur</Pill>
              <Pill variant="lavender">✨ Magic</Pill>
              <Pill variant="peach">🍑 Sweet</Pill>
              <Pill variant="white">🌙 Dream</Pill>
            </UIDemo>

            <UIDemo label="Input Fields">
              <InputDemo placeholder="Suche etwas Süßes..." icon="🔍" />
              <InputDemo placeholder="E-Mail Adresse ✉️" />
            </UIDemo>

            <UIDemo label="Cards">
              <CardDemo title="Sakura Mode" desc="Soft und beruhigend für den Alltag" badge="Neu ✿" variant="default" />
              <CardDemo title="Mint Dream" desc="Erfrischende Textur und Coolness" badge="🍃 Frisch" variant="mint" />
              <CardDemo title="Yume Cloud" desc="Traumhaft und ein bisschen anders" variant="lavender" />
            </UIDemo>

            <UIDemo label="Progress / Statusbar">
              {[30, 65, 90].map((val, i) => (
                <div key={i} style={{ width: 200 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, color: "#9c7b8a" }}>
                    <span>Level {i + 1}</span>
                    <span>{val}%</span>
                  </div>
                  <div style={{ background: "#fce4ec", borderRadius: 999, height: 10, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${val}%`,
                        background: `linear-gradient(90deg, #f48fb1, ${["#ce93d8", "#80cbc4", "#e91e8c"][i]})`,
                        borderRadius: 999,
                        transition: "width 1s",
                      }}
                    />
                  </div>
                </div>
              ))}
            </UIDemo>

            <UIDemo label="Toggle / Switch (conceptual)">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 48, height: 26, background: "#f48fb1", borderRadius: 999, position: "relative", cursor: "pointer" }}>
                  <div style={{ width: 20, height: 20, background: "#fff", borderRadius: 999, position: "absolute", top: 3, right: 4, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                </div>
                <span style={{ fontSize: 13, color: "#6d4c61" }}>ON — Petal Active</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 48, height: 26, background: "#f8bbd055", border: "2px solid #f8bbd0", borderRadius: 999, position: "relative", cursor: "pointer" }}>
                  <div style={{ width: 18, height: 18, background: "#f48fb1", borderRadius: 999, position: "absolute", top: 2, left: 4 }} />
                </div>
                <span style={{ fontSize: 13, color: "#6d4c61" }}>OFF — Inactive</span>
              </div>
            </UIDemo>

            <UIDemo label="Notification / Toast">
              {[
                { icon: "🌸", text: "Erfolgreich gespeichert!", bg: "#fce4ec", border: "#f48fb1" },
                { icon: "💜", text: "Neue Nachricht von Sakura!", bg: "#ede7f6", border: "#b39ddb" },
                { icon: "⚠️", text: "Fast vergessen? Dein Korb wartet!", bg: "#fff3e0", border: "#ffcc80" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: item.bg,
                    border: `2px solid ${item.border}`,
                    borderRadius: 16,
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                    color: "#3b1f2b",
                    fontWeight: 600,
                    minWidth: 240,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </UIDemo>
          </div>
        );

      case 6:
        return (
          <div>
            <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 700, marginBottom: 4, letterSpacing: "0.08em" }}>
              MOTION SYSTEM
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#3b1f2b", marginBottom: 20 }}>
              Animation & Micro-Interactions
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[
                {
                  name: "Bounce-In",
                  css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  desc: "Überschießt leicht, federt zurück. Hauptmotions-Easing für Kawaii. Buttons, Cards, Modals.",
                  token: "--ease-bounce",
                  color: "#fce4ec",
                },
                {
                  name: "Spring-Out",
                  css: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  desc: "Sanftes Ausblenden. Exits, Dismissals, closing states.",
                  token: "--ease-spring-out",
                  color: "#ede7f6",
                },
                {
                  name: "Soft-In",
                  css: "cubic-bezier(0.4, 0, 0.2, 1)",
                  desc: "Material Design's Standard-Ease — reif, smooth. Für Otona Kawaii und Hover-States.",
                  token: "--ease-soft",
                  color: "#e0f7f4",
                },
                {
                  name: "Overshoot-Pop",
                  css: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  desc: "Stärker überziehend. Für Like-Buttons, Emoji-Reactions, Achievement-Unlocks.",
                  token: "--ease-pop",
                  color: "#fff9c4",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: item.color,
                    borderRadius: 20,
                    padding: "18px 20px",
                  }}
                >
                  <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: "#c2185b", background: "#fff5", padding: "3px 8px", borderRadius: 6, marginBottom: 8, display: "inline-block" }}>
                    {item.css}
                  </div>
                  <div style={{ fontSize: 12, color: "#6d4c61", lineHeight: 1.6, marginBottom: 6 }}>{item.desc}</div>
                  <Tag>{item.token}</Tag>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "2px solid #fce4ec", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 16 }}>⏱ Duration Scale</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { token: "--duration-instant", val: "80ms", use: "Hover-Tints, Color-Fades" },
                  { token: "--duration-fast", val: "150ms", use: "Ripples, Mini-Bounce" },
                  { token: "--duration-base", val: "250ms", use: "Default Transitions" },
                  { token: "--duration-medium", val: "400ms", use: "Cards, Modals" },
                  { token: "--duration-slow", val: "600ms", use: "Page Transitions, Hero" },
                  { token: "--duration-dream", val: "1200ms+", use: "Yume Kawaii Float-Animations" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff8fe",
                      borderRadius: 12,
                      padding: "12px 14px",
                      border: "1.5px solid #fce4ec",
                      minWidth: 160,
                    }}
                  >
                    <div style={{ fontFamily: "monospace", fontSize: 11, color: "#c2185b", marginBottom: 4 }}>{item.token}</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#3b1f2b", marginBottom: 4 }}>{item.val}</div>
                    <div style={{ fontSize: 11, color: "#9c7b8a" }}>{item.use}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff8fe", borderRadius: 20, padding: "20px 24px", border: "2px solid #fce4ec" }}>
              <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 12 }}>✨ Signature Kawaii Animations</div>
              <div style={{ fontSize: 13, color: "#6d4c61" }}>
                {[
                  { name: "Heartbeat Pulse", desc: "scale(1) → scale(1.15) → scale(1) bei Like/Favorite. Easing: overshoot-pop, 300ms." },
                  { name: "Sparkle Scatter", desc: "Kleine ✨-Partikel fliegen von einem geklickten Punkt weg. CSS oder canvas-basiert." },
                  { name: "Blob Morph", desc: "Hintergrund-Blob ändert seine SVG-Form auf scroll/hover. Organic, langsam (1200ms)." },
                  { name: "Float Loop", desc: "Dekorative Elemente (Sterne, Herzen) floaten sanft auf-ab. 3s infinite ease-in-out." },
                  { name: "Bounce Entrance", desc: "Element kommt von unten mit scale(0.6) und federt auf scale(1). Alle Cards beim Load." },
                  { name: "Wiggle", desc: "Kurzes rotate(–5°) → rotate(5°) → rotate(0°) bei Fehler oder Attention-CTA. 300ms." },
                  { name: "Shimmer Gradient", desc: "Animated linear-gradient über Skeleton-Elemente oder Highlights. Kennt man von Loading-States." },
                  { name: "Iris Wipe", desc: "Sonderfalls-Transition: Bild/Screen blendet ein via SVG-Clip-Path (Kreis expandiert). Anime-inspiriert." },
                ].map((anim, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "10px 12px", background: "#fff", borderRadius: 12, border: "1.5px solid #fce4ec" }}>
                    <div style={{ flexShrink: 0, fontWeight: 800, color: "#e91e8c", minWidth: 140 }}>{anim.name}</div>
                    <div>{anim.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div>
            <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 700, marginBottom: 4, letterSpacing: "0.08em" }}>
              ICONOGRAPHY & DECORATION
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#3b1f2b", marginBottom: 20 }}>
              Icons, Motive & Ornamente
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "2px solid #fce4ec", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 16 }}>🌸 Kawaii Icon-Kategorien</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { cat: "Natur & Blüten", icons: "🌸 🌷 🌺 🌼 🍀 🌿 🍃", note: "Immer in Pastell-Kontexten" },
                  { cat: "Süßigkeiten", icons: "🍡 🍬 🍭 🧁 🍰 🍓 🍒", note: "Perfect für Food/Lifestyle Apps" },
                  { cat: "Himmel & Traum", icons: "⭐ 🌙 ☁️ 🌈 ✨ 💫 🌟", note: "Yume Kawaii signatur" },
                  { cat: "Emotionen", icons: "💗 💜 💙 🎀 🥺 😊 🫧", note: "Immer weich und rund" },
                  { cat: "Kawaii Animals", icons: "🐰 🐱 🐣 🐸 🦋 🐼 🐧", note: "Große Augen, kleine Körper" },
                  { cat: "Dekor & Glitzer", icons: "✿ ◆ ꒰ ꒱ ♡ ˚ ₊", note: "Unicode-Deko für Text-Akzente" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff8fe",
                      borderRadius: 14,
                      padding: "12px 14px",
                      border: "1.5px solid #fce4ec",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 12, color: "#3b1f2b", marginBottom: 6 }}>{item.cat}</div>
                    <div style={{ fontSize: 18, marginBottom: 6, lineHeight: 1.8 }}>{item.icons}</div>
                    <div style={{ fontSize: 10, color: "#c4a5b5" }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "2px solid #fce4ec", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 16 }}>🎀 Dekoratives System</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13, color: "#6d4c61" }}>
                {[
                  { name: "Background Blobs", desc: "SVG-Blobs in Pastell hinter Haupt-Content. transform: rotate() auf scroll für Tiefe." },
                  { name: "Deco-Dots", desc: "Kleine Kreise (4–8px) als Textur auf Surfaces. Muster-Hintergrund in Pastel-Weiß." },
                  { name: "Corner Flourishes", desc: "Kleine Blumen oder Sterne in Card-Ecken. Position: absolute, leicht transparent." },
                  { name: "Divider Stars", desc: "✦ ─────── ✦ als Section-Divider statt <hr>." },
                  { name: "Sticker Layer", desc: "Rotierte Mini-Elemente über Cards geschichtet (wie echte Sticker). Z-Index-Management nötig." },
                  { name: "Gradient Halos", desc: "Weiche radial-gradient-Glows hinter wichtigen Elementen. Nicht zu groß." },
                  { name: "Bokeh BG", desc: "Animierte, weiche Kreise (opacity 0.06–0.12) im Hintergrund. CSS animation: float." },
                  { name: "Noise Texture", desc: "Leichtes SVG-Rauschen (opacity 0.03–0.05) auf mono-farbigen Surfaces für Tiefe." },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff8fe",
                      borderRadius: 12,
                      padding: "12px 14px",
                      border: "1.5px solid #fce4ec",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "#e91e8c", marginBottom: 4 }}>{item.name}</div>
                    <div style={{ lineHeight: 1.6, fontSize: 12 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#1a0a12", borderRadius: 20, padding: "24px", border: "2px solid #4a0032" }}>
              <div style={{ fontWeight: 800, color: "#f8bbd0", marginBottom: 12 }}>💀 Dark Kawaii Icon-Regeln</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {["🩹 Bandagen", "💊 Pillen", "🖤 Schwarze Herzen", "⛓ Ketten", "🦇 Fledermäuse", "💀 Skulls (pastell)", "🌑 Dark Moons", "🕷 Spinnen (süß)"].map((icon, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#4a0032",
                      borderRadius: 10,
                      padding: "8px 14px",
                      fontSize: 13,
                      color: "#f8bbd0",
                      border: "1.5px solid #880e4f",
                    }}
                  >
                    {icon}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: "#c4a5b5", lineHeight: 1.7 }}>
                Regel: Dark Kawaii Icons IMMER in weicher Ausführung — kein Gore, keine Hyperrealismus-Darstellung. 
                Skulls sind süß und rund, nicht beängstigend. Der Kontrast entsteht durch Kontext, nicht durch Schockwert.
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div>
            <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 700, marginBottom: 4, letterSpacing: "0.08em" }}>
              SONDERFÄLLE & AUSREISSER
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#3b1f2b", marginBottom: 8 }}>
              Wenn das System bewusst bricht
            </div>
            <div style={{ fontSize: 13, color: "#9c7b8a", lineHeight: 1.7, marginBottom: 28 }}>
              Ein starkes Design System braucht nicht nur Regeln — es braucht definierte <strong>Ausnahmen</strong>. 
              Diese Sonderfälle sind keine Fehler, sondern Momente höchster emotionaler Wirkung. 
              Jeder Ausreißer hat einen klaren Trigger und eine klare Absicht.
            </div>

            {[
              {
                num: "01",
                name: "The Dark Flip",
                trigger: "Night Mode / Premium Mode / Yami-Subpage",
                desc: "Das gesamte System wechselt auf Dark-Kawaii: Hintergründe werden #0d0d1a, Akzente werden Neon-Petal oder Cyber-Orchid. Gleiche Komponenten, vollständig invertierte Atmosphäre.",
                rules: ["Alle border-radius bleiben identisch", "Shadows wechseln auf Glow-Schatten", "Typografie: Ghost White #f5f5f5", "Emojis bleiben gleich — sie sind universell"],
                palette: ["#0d0d1a", "#ea80fc", "#f48fb1", "#80deea"],
                award: false,
              },
              {
                num: "02",
                name: "Maximalist Decora Burst",
                trigger: "Celebration Screens, Achievements, Onboarding-End",
                desc: "Für einen kurzen Moment explodiert das System in voller Decora-Mode: Neons, layered Icons, Text in 3D-Effekt, confetti-artige Dekoration. Dauer: max. 2–3 Sekunden.",
                rules: ["Nur als transient State — nie als dauerhafter Screen", "Animation: Iris-Wipe Eingang", "Farben: Pop Kawaii Neon-Palette", "Exit: sanfter fade zurück in Pastel"],
                palette: ["#ff1744", "#00e5ff", "#ffea00", "#d500f9"],
                award: true,
              },
              {
                num: "03",
                name: "Otona-Upgrade",
                trigger: "Premium-Tier, Enterprise, Adult-directed Features",
                desc: "Kawaii wird zurückhaltend-raffiniert. Pastell-Palette bleibt, aber reduzierter. Weniger Charaktere, mehr Weißraum, Serif-Akzente. Denk: Luxury meets Cute.",
                rules: ["Serif für Headings (Georgia, Playfair Display)", "Farben: gedämpft — Rose Quartz statt Petal Pink", "Animations: slow, smooth, zero bounce", "Icons: minimal Line-Icons statt Emoji"],
                palette: ["#f5f0f0", "#d4a7b8", "#8d6e82", "#3b1f2b"],
                award: false,
              },
              {
                num: "04",
                name: "Glitch-Pop",
                trigger: "Error States, 404, System-Fehler",
                desc: "Statt Standard-Error-Pages: kurzer CSS-Glitch-Effekt auf dem mascot-character, der verwirrt aussieht. Visueller Bug wird zur Emotion. Tech Kawaii als Error-Language.",
                rules: ["CSS @keyframes mit transform: skew()", "RGB-Split-Effekt via text-shadow in Rot/Cyan", "Dauer: 300ms loop, dann stabil", "Mascot zeigt 'confused face' emoji"],
                palette: ["#ff1744", "#00e5ff", "#1a1a2e", "#ea80fc"],
                award: true,
              },
              {
                num: "05",
                name: "Typography Takeover",
                trigger: "Hero-Sections, Homepage-First-Impression, Editorial Moments",
                desc: "Statt Illustration oder Photo: die Headline IS das Design. Bubble-Font in voller Bildgröße, farbige Buchstaben, leichte rotation einzelner Buchstaben. Typografie als Kunst.",
                rules: ["Font-Size: clamp(80px, 15vw, 180px)", "Jeder Buchstabe eigene Farbe aus Palette", "letter-spacing: –0.03em (tight, impactful)", "Hintergrund: plain Cream Blush"],
                palette: ["#f48fb1", "#b39ddb", "#80cbc4", "#ffcc80"],
                award: true,
              },
              {
                num: "06",
                name: "Cursor Play",
                trigger: "Creative Portfolio-Sites, Interactive Experiences",
                desc: "Custom Cursor: Statt Pfeil — ein kleines 🌸 oder ✦. Mouse-Trail mit verblassenden Petals. Hover über Links: Cursor wächst auf 40px und zeigt Mini-Mascot.",
                rules: ["cursor: none + JS-Overlay", "Trail: 8–12 fading divs hinter Cursor", "Hover-State: cubic-bezier bounce scale", "Performance: requestAnimationFrame, kein Jitter"],
                palette: ["#f48fb1", "#ce93d8", "#fff0f5"],
                award: true,
              },
              {
                num: "07",
                name: "Loading Ritual",
                trigger: "Initial Page Load, lange API-Calls",
                desc: "Kein standard Spinner. Ein kleiner Charakter 'backt' oder 'kocht' animiert während des Ladens. Ladefortschritt = Charakter-State-Machine. Warten wird zum Moment.",
                rules: ["SVG-Charakter mit 4–6 States", "CSS @keyframes für jeden State", "Fallback: einfacher Petal-Spinner", "Max 8 Sekunden — danach: Fehlerbehandlung"],
                palette: ["#fce4ec", "#f48fb1", "#fff9c4", "#3b1f2b"],
                award: false,
              },
              {
                num: "08",
                name: "Wabi-Sabi Moment",
                trigger: "Empty States, No-Results, First-Time-Use",
                desc: "Inspiriert vom japanischen Konzept der Schönheit in Unvollkommenheit. Leerer Zustand zeigt einen kleinen melancholischen Charakter mit poetischem Text. Nicht frustrierend — berührend.",
                rules: ["Illustration: trauriges aber süßes Gesicht", "Text: poetisch, keine technische Sprache", "CTA: einladend statt direktiv", "Palette: gedämpfte Yume-Töne"],
                palette: ["#ede7f6", "#ce93d8", "#f8bbd0", "#9c7b8a"],
                award: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  padding: "22px 24px",
                  border: item.award ? "2px solid #e91e8c" : "2px solid #fce4ec",
                  marginBottom: 16,
                  position: "relative",
                }}
              >
                {item.award && (
                  <span
                    style={{
                      position: "absolute",
                      top: -12,
                      right: 20,
                      background: "#e91e8c",
                      color: "#fff",
                      borderRadius: 999,
                      padding: "3px 14px",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                    }}
                  >
                    ✦ AWARD-POTENTIAL
                  </span>
                )}
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#fce4ec", flexShrink: 0, lineHeight: 1 }}>
                    {item.num}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color: "#3b1f2b", marginBottom: 4 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#c2185b", fontWeight: 700, marginBottom: 8, letterSpacing: "0.06em" }}>
                      TRIGGER: {item.trigger}
                    </div>
                    <div style={{ fontSize: 13, color: "#6d4c61", lineHeight: 1.7, marginBottom: 12 }}>{item.desc}</div>
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        {item.rules.map((r, j) => (
                          <div key={j} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 12, color: "#9c7b8a" }}>
                            <span style={{ color: "#f48fb1", flexShrink: 0 }}>▸</span>
                            {r}
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        {item.palette.map((c, j) => (
                          <div
                            key={j}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 8,
                              background: c,
                              border: "1.5px solid rgba(0,0,0,0.1)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 9:
        return (
          <div>
            <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 700, marginBottom: 4, letterSpacing: "0.08em" }}>
              DESIGN TOKENS
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: "#3b1f2b", marginBottom: 20 }}>
              CSS Custom Properties
            </div>

            <div style={{ fontFamily: "monospace", background: "#1a0a12", borderRadius: 20, padding: "24px", color: "#f8bbd0", fontSize: 12, lineHeight: 1.8, marginBottom: 24, overflowX: "auto" }}>
              <div style={{ color: "#ce93d8", marginBottom: 8, fontWeight: 700 }}>/* Kawaii Design System — CSS Tokens v1.0 */</div>
              <div style={{ color: "#80cbc4" }}>:root {"{"}</div>
              {[
                ["/* === COLORS === */", "comment"],
                ["--color-blossom", "#fce4ec"],
                ["--color-petal", "#f48fb1"],
                ["--color-bloom", "#e91e8c"],
                ["--color-deep-rose", "#880e4f"],
                ["--color-plum-ink", "#3b1f2b"],
                ["--color-cream-blush", "#fff0f5"],
                ["--color-seafoam", "#80cbc4"],
                ["--color-wisteria", "#b39ddb"],
                ["--color-lemon-cream", "#fff9c4"],
                ["/* Dark Kawaii */", "comment"],
                ["--color-void", "#0d0d1a"],
                ["--color-cyber-orchid", "#ea80fc"],
                ["--color-hologram", "#80deea"],
                ["/* === TYPOGRAPHY === */", "comment"],
                ["--font-display", "'Nunito', 'Comfortaa', sans-serif"],
                ["--font-body", "'Nunito', 'DM Sans', sans-serif"],
                ["--font-accent", "'Caveat', 'Patrick Hand', cursive"],
                ["--font-mono", "'JetBrains Mono', monospace"],
                ["/* === RADIUS === */", "comment"],
                ["--radius-xs", "4px"],
                ["--radius-sm", "8px"],
                ["--radius-md", "12px"],
                ["--radius-lg", "20px"],
                ["--radius-xl", "28px"],
                ["--radius-pill", "999px"],
                ["/* === SPACING === */", "comment"],
                ["--space-1", "4px"],
                ["--space-2", "8px"],
                ["--space-3", "12px"],
                ["--space-4", "16px"],
                ["--space-6", "24px"],
                ["--space-8", "32px"],
                ["--space-12", "48px"],
                ["--space-16", "64px"],
                ["/* === SHADOW === */", "comment"],
                ["--shadow-sm", "0 2px 8px rgba(244,66,145,0.12)"],
                ["--shadow-md", "0 4px 20px rgba(244,66,145,0.18)"],
                ["--shadow-lg", "0 8px 40px rgba(244,66,145,0.25)"],
                ["--shadow-glow", "0 0 24px rgba(233,30,140,0.4)"],
                ["/* === EASING === */", "comment"],
                ["--ease-bounce", "cubic-bezier(0.34,1.56,0.64,1)"],
                ["--ease-spring", "cubic-bezier(0.25,0.46,0.45,0.94)"],
                ["--ease-pop", "cubic-bezier(0.175,0.885,0.32,1.275)"],
                ["/* === DURATION === */", "comment"],
                ["--duration-fast", "150ms"],
                ["--duration-base", "250ms"],
                ["--duration-medium", "400ms"],
                ["--duration-slow", "600ms"],
              ].map(([key, val], i) => (
                <div key={i} style={{ paddingLeft: 16 }}>
                  {val === "comment" ? (
                    <span style={{ color: "#9c7b8a" }}>{key}</span>
                  ) : (
                    <>
                      <span style={{ color: "#80deea" }}>{key}</span>
                      <span style={{ color: "#f5f5f5" }}>: </span>
                      <span style={{ color: "#fff9c4" }}>{val}</span>
                      <span style={{ color: "#f5f5f5" }}>;</span>
                    </>
                  )}
                </div>
              ))}
              <div style={{ color: "#80cbc4" }}>{"}"}</div>
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", border: "2px solid #fce4ec" }}>
              <div style={{ fontWeight: 800, color: "#3b1f2b", marginBottom: 12 }}>📋 Token-Anwendungsmatrix</div>
              <div>
                {[
                  { name: "--color-petal", value: "#f48fb1", type: "color" },
                  { name: "--color-bloom", value: "#e91e8c", type: "color" },
                  { name: "--color-plum-ink", value: "#3b1f2b", type: "color" },
                  { name: "--color-cream-blush", value: "#fff0f5", type: "color" },
                  { name: "--color-void", value: "#0d0d1a", type: "color" },
                  { name: "--radius-pill", value: "999px", type: "radius" },
                  { name: "--radius-lg", value: "20px", type: "radius" },
                  { name: "--ease-bounce", value: "cubic-bezier(0.34,1.56,0.64,1)", type: "easing" },
                  { name: "--shadow-md", value: "0 4px 20px rgba(244,66,145,0.18)", type: "shadow" },
                  { name: "--duration-base", value: "250ms", type: "duration" },
                ].map((token, i) => (
                  <TokenRow key={i} {...token} />
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff0f5",
        fontFamily: "'Nunito', 'DM Sans', -apple-system, sans-serif",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          flexShrink: 0,
          background: "#fff",
          borderRight: "2px solid #fce4ec",
          padding: "24px 0",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "0 20px 20px", borderBottom: "2px solid #fce4ec" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>🌸</div>
          <div style={{ fontWeight: 900, fontSize: 15, color: "#3b1f2b", lineHeight: 1.2 }}>
            Kawaii<br />Design System
          </div>
          <div style={{ fontSize: 10, color: "#c4a5b5", marginTop: 4, fontWeight: 700, letterSpacing: "0.08em" }}>
            V1.0 · 2025
          </div>
        </div>
        <div style={{ padding: "12px 0" }}>
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: "100%",
                background: active === i ? "#fce4ec" : "transparent",
                border: "none",
                textAlign: "left",
                padding: "10px 20px",
                fontSize: 12,
                fontWeight: active === i ? 800 : 600,
                color: active === i ? "#c2185b" : "#6d4c61",
                cursor: "pointer",
                borderLeft: active === i ? "3px solid #e91e8c" : "3px solid transparent",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto", maxWidth: 900 }}>
        {renderSection()}
      </div>
    </div>
  );
}
