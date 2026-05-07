import { useState, useRef, useEffect } from "react";

// ─── TOKENS ──────────────────────────────────────────────
const T = {
  // Color Roles (M3-mapped)
  primary:          "#e91e8c",
  onPrimary:        "#ffffff",
  primaryContainer: "#fce4ec",
  onPrimaryContainer:"#880e4f",
  secondary:        "#b039db",
  onSecondary:      "#ffffff",
  secondaryContainer:"#ede7f6",
  onSecondaryContainer:"#4a0072",
  tertiary:         "#00897b",
  onTertiary:       "#ffffff",
  tertiaryContainer:"#e0f7f4",
  onTertiaryContainer:"#004d40",
  error:            "#c62828",
  onError:          "#ffffff",
  errorContainer:   "#ffebee",
  onErrorContainer: "#b71c1c",
  surface:          "#fffbfe",
  onSurface:        "#3b1f2b",
  surfaceVariant:   "#fce4ec",
  onSurfaceVariant: "#6d4c61",
  outline:          "#c4a5b5",
  outlineVariant:   "#f8bbd0",
  background:       "#fff0f5",
  onBackground:     "#3b1f2b",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow:  "#fff5f9",
  surfaceContainer:     "#fce4ec",
  surfaceContainerHigh: "#f8bbd0",
  surfaceContainerHighest: "#f48fb1",
  inverseSurface:   "#3b1f2b",
  inverseOnSurface: "#fce4ec",
  inversePrimary:   "#f48fb1",
  scrim:            "rgba(59,31,43,0.4)",
  // Dark scheme extras
  darkBg:           "#0d0d1a",
  darkSurface:      "#1a1a2e",
  darkPrimary:      "#f48fb1",
  darkOnPrimary:    "#0d0d1a",
  // Elevation (as box-shadow with tinted overlay concept)
  elev0: "none",
  elev1: "0 1px 3px rgba(233,30,140,0.12), 0 1px 2px rgba(233,30,140,0.08)",
  elev2: "0 2px 8px rgba(233,30,140,0.14), 0 1px 4px rgba(233,30,140,0.1)",
  elev3: "0 4px 16px rgba(233,30,140,0.18), 0 2px 8px rgba(233,30,140,0.12)",
  elev4: "0 6px 24px rgba(233,30,140,0.22), 0 4px 12px rgba(233,30,140,0.14)",
  elev5: "0 8px 40px rgba(233,30,140,0.28), 0 4px 16px rgba(233,30,140,0.16)",
  // Shape (M3 shape scale)
  shapeNone:   "0px",
  shapeXs:     "4px",
  shapeSm:     "8px",
  shapeMd:     "12px",
  shapeLg:     "16px",
  shapeXl:     "28px",
  shapeXxl:    "32px",
  shapeFull:   "999px",
  // Type scale labels
  fontDisplay: "'Nunito', 'Comfortaa', sans-serif",
  fontBody:    "'Nunito', 'DM Sans', sans-serif",
  fontMono:    "'JetBrains Mono', monospace",
  // Easing
  easeBounce:  "cubic-bezier(0.34,1.56,0.64,1)",
  easeStd:     "cubic-bezier(0.2,0,0,1)",
  easeDecel:   "cubic-bezier(0,0,0,1)",
  easeAccel:   "cubic-bezier(0.3,0,1,1)",
};

// ─── PALETTE & THEME BUILDER ─────────────────────────────

function _hexRgb(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}
function _relLum(r,g,b) {
  return [r,g,b].reduce((acc,c,i) => {
    const s = c/255; const lin = s<=0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055,2.4);
    return acc + lin*[0.2126,0.7152,0.0722][i];
  },0);
}
function _ct(hex) { const [r,g,b]=_hexRgb(hex); return _relLum(r,g,b)>0.179?"#1a1a1a":"#ffffff"; }
function _lighten(hex,t) { const [r,g,b]=_hexRgb(hex); const h=v=>Math.round(v+(255-v)*t).toString(16).padStart(2,"0"); return `#${h(r)}${h(g)}${h(b)}`; }
function _darken(hex,t)  { const [r,g,b]=_hexRgb(hex); const h=v=>Math.round(v*(1-t)).toString(16).padStart(2,"0"); return `#${h(r)}${h(g)}${h(b)}`; }
function _blend(h1,h2,t) { const [r1,g1,b1]=_hexRgb(h1),[r2,g2,b2]=_hexRgb(h2); const h=(a,b)=>Math.round(a*(1-t)+b*t).toString(16).padStart(2,"0"); return `#${h(r1,r2)}${h(g1,g2)}${h(b1,b2)}`; }

// 40 curated contrasting triplets [primary, secondary, surface]
const PALETTE_COMBOS = [
  ["#4B6E6F","#D39180","#F6F8F7"],
  ["#4B6E6F","#DCC26E","#EEEBE5"],
  ["#72AAA4","#F1E489","#F6F8F7"],
  ["#D39180","#72AAA4","#EEEBE5"],
  ["#DCC26E","#CCD4D1","#F6F8F7"],
  ["#71808D","#EBD1DE","#F4E6EF"],
  ["#71808D","#D4EBED","#DEDEE0"],
  ["#93C1D8","#AA9AA2","#DEDEE0"],
  ["#95BCCE","#C3B9BF","#F4E6EF"],
  ["#96AFB8","#E2B6C7","#F6F8F7"],
  ["#CC5682","#D4EBED","#F4E6EF"],
  ["#CC5682","#CCD4D1","#EEEBE5"],
  ["#A64E68","#D4EBED","#F6F8F7"],
  ["#A64E68","#EBD1DE","#F4E6EF"],
  ["#633F40","#CCD4D1","#F4E9B2"],
  ["#633F40","#D4EBED","#EEEBE5"],
  ["#826669","#93C1D8","#DEDEE0"],
  ["#826669","#D4EBED","#F4E6EF"],
  ["#B9718B","#72AAA4","#F6F8F7"],
  ["#B9718B","#CCD4D1","#EEEBE5"],
  ["#A64E68","#72AAA4","#F6F8F7"],
  ["#CC5682","#72AAA4","#EEEBE5"],
  ["#4B6E6F","#E2B6C7","#F4E6EF"],
  ["#4B6E6F","#EBD1DE","#F6F8F7"],
  ["#71808D","#DEA0B7","#F4E6EF"],
  ["#71808D","#E2B6C7","#EEEBE5"],
  ["#D39180","#95BCCE","#F6F8F7"],
  ["#D39180","#71808D","#EEEBE5"],
  ["#DCC26E","#826669","#F6F8F7"],
  ["#DCC26E","#4B6E6F","#DEDEE0"],
  ["#96AFB8","#D1809A","#F4E6EF"],
  ["#95BCCE","#D39180","#F4E9B2"],
  ["#93C1D8","#B9718B","#F6F8F7"],
  ["#AA9AA2","#72AAA4","#F4E9B2"],
  ["#C3B9BF","#4B6E6F","#D4EBED"],
  ["#D1809A","#71808D","#D4EBED"],
  ["#DEA0B7","#96AFB8","#F6F8F7"],
  ["#C498A8","#72AAA4","#DEDEE0"],
  ["#72AAA4","#EBD1DE","#F4E9B2"],
  ["#CC5682","#4B6E6F","#F4E9B2"],
];

function buildThemeColors(primary, secondary, surface) {
  const [pr,pg,pb] = _hexRgb(primary);
  const [ir,ig,ib] = _hexRgb(_darken(primary, 0.52));
  const primaryContainer   = _lighten(primary, 0.72);
  const onPrimary          = _ct(primary);
  const onPrimaryContainer = _darken(primary, 0.42);
  const secondaryContainer   = _lighten(secondary, 0.72);
  const onSecondary          = _ct(secondary);
  const onSecondaryContainer = _darken(secondary, 0.42);
  const tertiary             = _blend(primary, secondary, 0.5);
  const tertiaryContainer    = _lighten(tertiary, 0.72);
  const onTertiary           = _ct(tertiary);
  const onTertiaryContainer  = _darken(tertiary, 0.42);
  const onSurface            = _ct(surface);
  const surfaceVariant       = _blend(surface, primary, 0.12);
  const onSurfaceVariant     = _darken(primary, 0.28);
  const background           = _lighten(surface, 0.08);
  const outline              = _blend(primary, surface, 0.62);
  const outlineVariant       = _lighten(primary, 0.80);
  const surfaceContainerLowest  = _lighten(surface, 0.25);
  const surfaceContainerLow     = _lighten(surface, 0.15);
  const surfaceContainer        = primaryContainer;
  const surfaceContainerHigh    = _lighten(primary, 0.55);
  const surfaceContainerHighest = _lighten(primary, 0.35);
  const inverseSurface   = _darken(primary, 0.52);
  const inverseOnSurface = _lighten(surface, 0.12);
  const inversePrimary   = _lighten(primary, 0.48);
  const darkBg           = _darken(primary, 0.84);
  const darkSurface      = _darken(primary, 0.77);
  const darkPrimary      = _lighten(primary, 0.50);
  return {
    primary, onPrimary, primaryContainer, onPrimaryContainer,
    secondary, onSecondary, secondaryContainer, onSecondaryContainer,
    tertiary, onTertiary, tertiaryContainer, onTertiaryContainer,
    error:"#c62828", onError:"#ffffff", errorContainer:"#ffebee", onErrorContainer:"#b71c1c",
    surface, onSurface, surfaceVariant, onSurfaceVariant,
    outline, outlineVariant, background, onBackground: onSurface,
    surfaceContainerLowest, surfaceContainerLow, surfaceContainer,
    surfaceContainerHigh, surfaceContainerHighest,
    inverseSurface, inverseOnSurface, inversePrimary,
    scrim:`rgba(${ir},${ig},${ib},0.4)`,
    darkBg, darkSurface, darkPrimary, darkOnPrimary: darkBg,
    elev0:"none",
    elev1:`0 1px 3px rgba(${pr},${pg},${pb},0.12),0 1px 2px rgba(${pr},${pg},${pb},0.08)`,
    elev2:`0 2px 8px rgba(${pr},${pg},${pb},0.14),0 1px 4px rgba(${pr},${pg},${pb},0.1)`,
    elev3:`0 4px 16px rgba(${pr},${pg},${pb},0.18),0 2px 8px rgba(${pr},${pg},${pb},0.12)`,
    elev4:`0 6px 24px rgba(${pr},${pg},${pb},0.22),0 4px 12px rgba(${pr},${pg},${pb},0.14)`,
    elev5:`0 8px 40px rgba(${pr},${pg},${pb},0.28),0 4px 16px rgba(${pr},${pg},${pb},0.16)`,
  };
}

// ─── NAV SECTIONS ──────────────────────────────────────────
const NAV = [
  { id:"color",       label:"Color System",        icon:"🎨" },
  { id:"typography",  label:"Typography",           icon:"✍️" },
  { id:"elevation",   label:"Elevation",            icon:"🏔" },
  { id:"shape",       label:"Shape",                icon:"🫧" },
  { id:"states",      label:"States & Interaction", icon:"✨" },
  { id:"buttons",     label:"Buttons",              icon:"🌸" },
  { id:"fab",         label:"FAB",                  icon:"➕" },
  { id:"iconbtns",    label:"Icon Buttons",         icon:"💜" },
  { id:"chips",       label:"Chips",                icon:"🎀" },
  { id:"cards",       label:"Cards",                icon:"🃏" },
  { id:"lists",       label:"Lists",                icon:"📋" },
  { id:"textfields",  label:"Text Fields",          icon:"📝" },
  { id:"selection",   label:"Selection Controls",   icon:"☑️" },
  { id:"sliders",     label:"Sliders",              icon:"🎚" },
  { id:"navigation",  label:"Navigation",           icon:"🧭" },
  { id:"appbars",     label:"App Bars",             icon:"📱" },
  { id:"dialogs",     label:"Dialogs & Sheets",     icon:"💬" },
  { id:"menus",       label:"Menus & Tabs",         icon:"📂" },
  { id:"progress",    label:"Progress Indicators",  icon:"⏳" },
  { id:"snackbadge",  label:"Snackbar & Badge",     icon:"🔔" },
  { id:"datepicker",  label:"Date / Time Picker",   icon:"📅" },
  { id:"carousel",    label:"Carousel",             icon:"🎠" },
  { id:"search",      label:"Search",               icon:"🔍" },
  { id:"dividers",    label:"Dividers",             icon:"✦" },
  { id:"tooltips",    label:"Tooltips",             icon:"💭" },
];

// ─── MICRO HELPERS ──────────────────────────────────────────
const SectionHeader = ({ id, icon, title, sub }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ fontSize: 11, color: T.primary, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
      M3 → KAWAII · {id.toUpperCase()}
    </div>
    <div style={{ fontSize: 26, fontWeight: 900, color: T.onSurface, display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span>{icon}</span> {title}
    </div>
    {sub && <div style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.7, maxWidth: 620 }}>{sub}</div>}
  </div>
);

const DemoBox = ({ label, children, dark }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: T.outline, marginBottom: 10 }}>{label}</div>
    <div style={{
      background: dark ? T.darkBg : T.surfaceContainerLowest,
      borderRadius: T.shapeLg,
      padding: "20px 24px",
      border: `1.5px solid ${dark ? "#4a0032" : T.outlineVariant}`,
      display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center"
    }}>{children}</div>
  </div>
);

const Spec = ({ items }) => (
  <div style={{ background: T.surfaceContainerLow, borderRadius: T.shapeMd, padding: "14px 18px", marginTop: 14, fontSize: 12, color: T.onSurfaceVariant, lineHeight: 1.9 }}>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", gap: 8 }}>
        <span style={{ color: T.primary, flexShrink: 0 }}>▸</span>
        <span>{item}</span>
      </div>
    ))}
  </div>
);

// ─── BUTTON COMPONENT ──────────────────────────────────────
function KBtn({ variant = "filled", size = "md", icon, label, disabled, color }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const base = {
    filled:        { bg: T.primary, fg: T.onPrimary, border: "none" },
    filledTonal:   { bg: T.primaryContainer, fg: T.onPrimaryContainer, border: "none" },
    outlined:      { bg: "transparent", fg: T.primary, border: `1.5px solid ${T.outline}` },
    text:          { bg: "transparent", fg: T.primary, border: "none" },
    elevated:      { bg: T.surfaceContainerLow, fg: T.primary, border: "none" },
  };
  const v = base[variant] || base.filled;
  const sizes = { sm: { px: "12px 16px", fs: 12, h: 32 }, md: { px: "16px 24px", fs: 14, h: 40 }, lg: { px: "20px 32px", fs: 16, h: 48 } };
  const sz = sizes[size];
  const stateColor = hover ? (variant === "filled" ? "rgba(255,255,255,0.08)" : "rgba(233,30,140,0.08)") : "transparent";
  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background: disabled ? T.surfaceContainerHigh : v.bg,
        color: disabled ? T.outline : v.fg,
        border: v.border,
        borderRadius: T.shapeFull,
        padding: sz.px,
        height: sz.h,
        fontSize: sz.fs,
        fontWeight: 700,
        fontFamily: T.fontBody,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex", alignItems: "center", gap: 6,
        boxShadow: variant === "elevated" && !disabled ? (hover ? T.elev3 : T.elev2) : "none",
        transform: pressed ? "scale(0.97)" : hover ? "translateY(-1px)" : "none",
        transition: `all 200ms ${T.easeBounce}`,
        outline: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: stateColor, borderRadius: "inherit", transition: "background 150ms" }} />
      {icon && <span style={{ position: "relative" }}>{icon}</span>}
      <span style={{ position: "relative" }}>{label}</span>
    </button>
  );
}

// ─── CHIP ──────────────────────────────────────────────────
function KChip({ variant = "assist", label, icon, selected, onToggle }) {
  const [sel, setSel] = useState(selected || false);
  const toggle = () => { setSel(!sel); onToggle && onToggle(!sel); };
  const bg = sel ? T.primaryContainer : T.surfaceContainerLow;
  const fg = sel ? T.onPrimaryContainer : T.onSurface;
  const border = sel ? `1.5px solid ${T.primary}` : `1.5px solid ${T.outlineVariant}`;
  return (
    <button onClick={toggle} style={{
      background: bg, color: fg, border,
      borderRadius: T.shapeSm,
      padding: "6px 14px", fontSize: 13, fontWeight: 700,
      fontFamily: T.fontBody, cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 6,
      transition: `all 200ms ${T.easeBounce}`,
      transform: sel ? "scale(1.03)" : "none",
      boxShadow: sel ? T.elev1 : "none",
    }}>
      {sel ? "✿" : icon || ""} {label}
      {sel && <span style={{ fontSize: 10, marginLeft: 2 }}>✕</span>}
    </button>
  );
}

// ─── CHECKBOX ──────────────────────────────────────────────
function KCheckbox({ label, defaultChecked, indeterminate }) {
  const [checked, setChecked] = useState(defaultChecked || false);
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: T.onSurface, fontWeight: 600 }}>
      <div
        onClick={() => setChecked(!checked)}
        style={{
          width: 20, height: 20,
          borderRadius: T.shapeXs,
          border: checked ? "none" : `2px solid ${T.outline}`,
          background: checked ? T.primary : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: `all 200ms ${T.easeBounce}`,
          transform: checked ? "scale(1.1)" : "scale(1)",
          flexShrink: 0,
        }}
      >
        {checked && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}
        {indeterminate && !checked && <span style={{ color: T.outline, fontSize: 12, lineHeight: 1 }}>–</span>}
      </div>
      {label}
    </label>
  );
}

// ─── RADIO ─────────────────────────────────────────────────
function KRadioGroup({ options, defaultValue }) {
  const [val, setVal] = useState(defaultValue || options[0]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map((opt, i) => {
        const sel = val === opt;
        return (
          <label key={i} onClick={() => setVal(opt)} style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: T.onSurface, fontWeight: 600 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: `2px solid ${sel ? T.primary : T.outline}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: `all 200ms ${T.easeBounce}`,
              transform: sel ? "scale(1.05)" : "scale(1)",
            }}>
              {sel && <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.primary, transition: `all 200ms ${T.easeBounce}` }} />}
            </div>
            {opt}
          </label>
        );
      })}
    </div>
  );
}

// ─── SWITCH ────────────────────────────────────────────────
function KSwitch({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn || false);
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <div
        onClick={() => setOn(!on)}
        style={{
          width: 52, height: 32,
          borderRadius: T.shapeFull,
          background: on ? T.primary : T.surfaceContainerHighest,
          border: on ? "none" : `2px solid ${T.outline}`,
          position: "relative",
          transition: `background 250ms ${T.easeStd}`,
          flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute",
          top: on ? 4 : 5, left: on ? 24 : 5,
          width: on ? 24 : 16, height: on ? 24 : 16,
          borderRadius: "50%",
          background: on ? T.onPrimary : T.outline,
          transition: `all 250ms ${T.easeBounce}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10,
        }}>
          {on && "✓"}
        </div>
      </div>
      {label && <span style={{ fontSize: 14, color: T.onSurface, fontWeight: 600 }}>{label}</span>}
    </label>
  );
}

// ─── SLIDER ────────────────────────────────────────────────
function KSlider({ label, defaultValue = 40 }) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div style={{ width: 260 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.onSurfaceVariant, fontWeight: 700, marginBottom: 8 }}>
        <span>{label}</span><span style={{ color: T.primary }}>{val}</span>
      </div>
      <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 6, background: T.surfaceContainerHigh, borderRadius: T.shapeFull }}>
          <div style={{ width: `${val}%`, height: "100%", background: T.primary, borderRadius: T.shapeFull }} />
        </div>
        <input type="range" min={0} max={100} value={val}
          onChange={e => setVal(+e.target.value)}
          style={{ position: "absolute", left: 0, right: 0, opacity: 0, height: "100%", cursor: "pointer", width: "100%", margin: 0 }}
        />
        <div style={{
          position: "absolute",
          left: `calc(${val}% - 14px)`,
          width: 28, height: 28,
          borderRadius: "50%",
          background: T.primary,
          border: `3px solid ${T.onPrimary}`,
          boxShadow: T.elev3,
          pointerEvents: "none",
          transition: `left 50ms`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, color: "#fff", fontWeight: 800,
        }}>✿</div>
      </div>
    </div>
  );
}

// ─── TEXT FIELD ────────────────────────────────────────────
function KTextField({ label, placeholder, variant = "filled", helperText, error, icon, trailingIcon, disabled }) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState("");
  const active = focused || val.length > 0;
  const borderColor = error ? T.error : focused ? T.primary : T.outline;
  if (variant === "outlined") {
    return (
      <div style={{ width: 260 }}>
        <div style={{ position: "relative", borderRadius: T.shapeXs }}>
          <fieldset style={{
            border: `${focused ? 2 : 1.5}px solid ${borderColor}`,
            borderRadius: T.shapeXs,
            padding: "0 12px",
            margin: 0,
            background: disabled ? T.surfaceContainerLow : T.surfaceContainerLowest,
          }}>
            <legend style={{
              fontSize: active ? 11 : 14,
              color: error ? T.error : focused ? T.primary : T.onSurfaceVariant,
              padding: "0 4px",
              transition: "all 200ms",
              fontWeight: 700,
              fontFamily: T.fontBody,
            }}>{label}</legend>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10 }}>
              {icon && <span>{icon}</span>}
              <input value={val} onChange={e => setVal(e.target.value)}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                placeholder={active ? placeholder : ""}
                disabled={disabled}
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: T.onSurface, fontFamily: T.fontBody }} />
              {trailingIcon && <span>{trailingIcon}</span>}
            </div>
          </fieldset>
        </div>
        {helperText && <div style={{ fontSize: 11, color: error ? T.error : T.onSurfaceVariant, marginTop: 4, paddingLeft: 12 }}>{error ? "⚠ " : ""}{helperText}</div>}
      </div>
    );
  }
  return (
    <div style={{ width: 260 }}>
      <div style={{
        background: disabled ? T.surfaceContainerLow : T.surfaceContainer,
        borderRadius: `${T.shapeSm} ${T.shapeSm} 0 0`,
        borderBottom: `${focused ? 2 : 1.5}px solid ${borderColor}`,
        padding: "8px 12px 4px",
        position: "relative",
        transition: "border-color 200ms",
      }}>
        <label style={{ fontSize: active ? 11 : 14, color: error ? T.error : focused ? T.primary : T.onSurfaceVariant, display: "block", fontWeight: 700, fontFamily: T.fontBody, transition: "all 200ms", marginBottom: active ? 2 : 6 }}>
          {label} {icon && icon}
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input value={val} onChange={e => setVal(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder={active ? placeholder : ""}
            disabled={disabled}
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: T.onSurface, fontFamily: T.fontBody, paddingBottom: 6 }} />
          {trailingIcon && <span style={{ fontSize: 16, opacity: 0.6 }}>{trailingIcon}</span>}
        </div>
      </div>
      {helperText && <div style={{ fontSize: 11, color: error ? T.error : T.onSurfaceVariant, marginTop: 4, paddingLeft: 12 }}>{error ? "⚠ " : "✿ "}{helperText}</div>}
    </div>
  );
}

// ─── CARD ──────────────────────────────────────────────────
function KCard({ variant = "elevated", title, subtitle, body, media, actions, badge }) {
  const [hover, setHover] = useState(false);
  const styles = {
    elevated:  { bg: T.surfaceContainerLow, border: "none", shadow: hover ? T.elev3 : T.elev2 },
    filled:    { bg: T.surfaceContainerHighest, border: "none", shadow: "none" },
    outlined:  { bg: T.surface, border: `1.5px solid ${T.outlineVariant}`, shadow: "none" },
  };
  const s = styles[variant];
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: s.bg, border: s.border,
        borderRadius: T.shapeXl,
        boxShadow: s.shadow,
        overflow: "hidden",
        width: 220,
        transform: hover ? "translateY(-3px) scale(1.01)" : "none",
        transition: `all 250ms ${T.easeBounce}`,
        position: "relative",
      }}>
      {badge && <div style={{ position: "absolute", top: 10, right: 10, background: T.primary, color: T.onPrimary, borderRadius: T.shapeFull, padding: "2px 10px", fontSize: 10, fontWeight: 800, zIndex: 1 }}>{badge}</div>}
      {media && <div style={{ height: 120, background: media, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{media}</div>}
      <div style={{ padding: "14px 16px" }}>
        {title && <div style={{ fontWeight: 800, color: T.onSurface, fontSize: 15, marginBottom: 2 }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 12, color: T.primary, fontWeight: 700, marginBottom: 6 }}>{subtitle}</div>}
        {body && <div style={{ fontSize: 12, color: T.onSurfaceVariant, lineHeight: 1.6 }}>{body}</div>}
        {actions && <div style={{ marginTop: 12, display: "flex", gap: 8 }}>{actions}</div>}
      </div>
    </div>
  );
}

// ─── PROGRESS ──────────────────────────────────────────────
function KLinearProgress({ value, indeterminate }) {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    if (!indeterminate) return;
    const id = setInterval(() => setPos(p => (p + 2) % 120), 16);
    return () => clearInterval(id);
  }, [indeterminate]);
  return (
    <div style={{ width: 260, height: 6, background: T.surfaceContainerHigh, borderRadius: T.shapeFull, overflow: "hidden", position: "relative" }}>
      {indeterminate ? (
        <div style={{ position: "absolute", left: `${pos - 40}%`, width: "40%", height: "100%", background: `linear-gradient(90deg, transparent, ${T.primary}, transparent)`, borderRadius: T.shapeFull, transition: "left 16ms linear" }} />
      ) : (
        <div style={{ width: `${value}%`, height: "100%", background: `linear-gradient(90deg, ${T.primaryContainer}, ${T.primary})`, borderRadius: T.shapeFull, transition: "width 300ms ease" }} />
      )}
    </div>
  );
}

function KCircularProgress({ value, size = 48, indeterminate }) {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    if (!indeterminate) return;
    const id = setInterval(() => setAngle(a => (a + 4) % 360), 16);
    return () => clearInterval(id);
  }, [indeterminate]);
  const r = (size / 2) - 4;
  const circ = 2 * Math.PI * r;
  const dash = indeterminate ? circ * 0.6 : circ * (value / 100);
  return (
    <svg width={size} height={size} style={{ transform: `rotate(${indeterminate ? angle : -90}deg)`, transition: indeterminate ? "none" : "transform 0ms" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.surfaceContainerHigh} strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.primary} strokeWidth={4}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: indeterminate ? "none" : "stroke-dasharray 300ms ease" }} />
    </svg>
  );
}

// ─── BADGE ─────────────────────────────────────────────────
function KBadge({ count, icon }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      {count !== undefined && (
        <div style={{
          position: "absolute", top: -4, right: -6,
          background: T.error, color: T.onError,
          borderRadius: T.shapeFull,
          minWidth: count > 0 ? 18 : 8, height: count > 0 ? 18 : 8,
          fontSize: 10, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: count > 9 ? "0 4px" : 0,
          border: `2px solid ${T.surface}`,
          transition: `all 250ms ${T.easeBounce}`,
        }}>{count > 0 ? (count > 99 ? "99+" : count) : ""}</div>
      )}
    </div>
  );
}

// ─── SNACKBAR ──────────────────────────────────────────────
function KSnackbar({ message, action, icon, visible }) {
  return (
    <div style={{
      background: T.inverseSurface, color: T.inverseOnSurface,
      borderRadius: T.shapeSm,
      padding: "12px 16px",
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: T.elev5,
      fontSize: 14, fontWeight: 600,
      transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
      opacity: visible ? 1 : 0,
      transition: `all 300ms ${T.easeBounce}`,
      maxWidth: 380, pointerEvents: visible ? "all" : "none",
    }}>
      {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      <span style={{ flex: 1 }}>{message}</span>
      {action && <button style={{ background: "none", border: "none", color: T.inversePrimary, fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: T.fontBody }}>{action}</button>}
    </div>
  );
}

// ─── FAB ───────────────────────────────────────────────────
function KFAB({ size = "md", icon, label, variant = "primary" }) {
  const [hover, setHover] = useState(false);
  const colors = {
    primary:   { bg: T.primaryContainer, fg: T.onPrimaryContainer },
    secondary: { bg: T.secondaryContainer, fg: T.onSecondaryContainer },
    tertiary:  { bg: T.tertiaryContainer, fg: T.onTertiaryContainer },
    surface:   { bg: T.surfaceContainerHigh, fg: T.primary },
  };
  const c = colors[variant];
  const sizes = { sm: { s: 40, fs: 20 }, md: { s: 56, fs: 24 }, lg: { s: 96, fs: 36 } };
  const sz = sizes[size];
  return (
    <button
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: c.bg, color: c.fg,
        border: "none",
        borderRadius: label ? T.shapeLg : T.shapeLg,
        width: label ? "auto" : sz.s, height: sz.s,
        padding: label ? `0 20px 0 16px` : 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontSize: sz.fs,
        fontWeight: 700, fontFamily: T.fontBody,
        cursor: "pointer",
        boxShadow: hover ? T.elev4 : T.elev3,
        transform: hover ? "translateY(-2px) scale(1.04)" : "none",
        transition: `all 250ms ${T.easeBounce}`,
      }}>
      <span>{icon}</span>
      {label && <span style={{ fontSize: 14 }}>{label}</span>}
    </button>
  );
}

// ─── TOOLTIP ───────────────────────────────────────────────
function KTooltip({ children, text, pos = "top" }) {
  const [show, setShow] = useState(false);
  const posMap = {
    top:    { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
  };
  return (
    <div style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <div style={{
        position: "absolute",
        ...posMap[pos],
        background: T.inverseSurface, color: T.inverseOnSurface,
        borderRadius: T.shapeXs,
        padding: "6px 12px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
        opacity: show ? 1 : 0,
        transform: (posMap[pos].transform || "") + (show ? " scale(1)" : " scale(0.9)"),
        transition: `all 150ms ${T.easeBounce}`,
        pointerEvents: "none", zIndex: 100,
        boxShadow: T.elev2,
      }}>{text}</div>
    </div>
  );
}

// ─── DIALOG ────────────────────────────────────────────────
function KDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <KBtn variant="filled" label="Dialog öffnen 🌸" icon="💬" onClick={() => setOpen(true)} />
      {open && (
        <div style={{ position: "fixed", inset: 0, background: T.scrim, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.surfaceContainerLowest, borderRadius: T.shapeXxl,
            padding: "24px", width: 320, maxWidth: "90vw",
            boxShadow: T.elev5,
            animation: "dialogIn 250ms cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <div style={{ fontSize: 32, textAlign: "center", marginBottom: 8 }}>🌸</div>
            <div style={{ fontWeight: 900, fontSize: 20, color: T.onSurface, marginBottom: 8, textAlign: "center" }}>Wirklich löschen?</div>
            <div style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.7, textAlign: "center", marginBottom: 20 }}>
              Diese Aktion kann nicht rückgängig gemacht werden. Dein Mochi wird für immer weg sein. 🥺
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <KBtn variant="text" label="Abbrechen" onClick={() => setOpen(false)} />
              <KBtn variant="filled" label="Löschen 💔" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BOTTOM SHEET ─────────────────────────────────────────
function KBottomSheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <KBtn variant="filledTonal" label="Bottom Sheet 📋" icon="⬆️" onClick={() => setOpen(true)} />
      {open && (
        <div style={{ position: "fixed", inset: 0, background: T.scrim, zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.surfaceContainerLow, borderRadius: `${T.shapeXxl} ${T.shapeXxl} 0 0`,
            padding: "16px 24px 32px", width: "100%", maxWidth: 480, margin: "0 auto",
            boxShadow: T.elev5,
          }}>
            <div style={{ width: 32, height: 4, background: T.outlineVariant, borderRadius: T.shapeFull, margin: "0 auto 20px" }} />
            <div style={{ fontWeight: 900, fontSize: 18, color: T.onSurface, marginBottom: 16 }}>Teile diesen Moment ✨</div>
            {["💌 Per Nachricht", "🔗 Link kopieren", "🌸 Story teilen", "📷 Als Bild speichern"].map((item, i) => (
              <div key={i} onClick={() => setOpen(false)} style={{ padding: "14px 0", borderBottom: `1px solid ${T.outlineVariant}`, cursor: "pointer", fontSize: 14, fontWeight: 600, color: T.onSurface, display: "flex", alignItems: "center", gap: 12 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NAVIGATION BAR ────────────────────────────────────────
function KNavBar() {
  const [active, setActive] = useState(0);
  const items = [
    { icon: "🏠", label: "Home" }, { icon: "🌸", label: "Entdecken" },
    { icon: "💗", label: "Favoriten" }, { icon: "👤", label: "Profil" },
  ];
  return (
    <div style={{ background: T.surfaceContainerLow, borderRadius: T.shapeXl, padding: "8px 4px", display: "flex", boxShadow: T.elev2, width: "100%" }}>
      {items.map((item, i) => (
        <button key={i} onClick={() => setActive(i)} style={{
          flex: 1, background: "none", border: "none", cursor: "pointer", padding: "8px 4px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          position: "relative", fontFamily: T.fontBody,
        }}>
          <div style={{
            padding: "4px 16px", borderRadius: T.shapeFull,
            background: active === i ? T.primaryContainer : "transparent",
            transition: `all 250ms ${T.easeBounce}`,
            transform: active === i ? "scale(1.1)" : "scale(1)",
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: active === i ? T.primary : T.onSurfaceVariant }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── NAVIGATION RAIL ───────────────────────────────────────
function KNavRail() {
  const [active, setActive] = useState(0);
  const items = [
    { icon: "🏠", label: "Home" }, { icon: "🌸", label: "Entdecken" },
    { icon: "💗", label: "Favoriten" }, { icon: "🔔", label: "Nachrichten" }, { icon: "👤", label: "Profil" },
  ];
  return (
    <div style={{ background: T.surfaceContainerLow, borderRadius: T.shapeXl, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, boxShadow: T.elev1, width: 80 }}>
      <KFAB size="sm" icon="✿" variant="surface" />
      <div style={{ height: 12 }} />
      {items.map((item, i) => (
        <button key={i} onClick={() => setActive(i)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          padding: "4px", width: "100%", fontFamily: T.fontBody,
        }}>
          <div style={{
            padding: "8px 16px", borderRadius: T.shapeFull,
            background: active === i ? T.primaryContainer : "transparent",
            transition: `all 250ms ${T.easeBounce}`,
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: active === i ? T.primary : T.onSurfaceVariant, lineHeight: 1 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── TABS ──────────────────────────────────────────────────
function KTabs({ items, variant = "primary" }) {
  const [active, setActive] = useState(0);
  return (
    <div style={{ borderBottom: `2px solid ${T.outlineVariant}`, display: "flex", position: "relative" }}>
      {items.map((item, i) => (
        <button key={i} onClick={() => setActive(i)} style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "12px 20px", fontSize: 14, fontWeight: 700,
          color: active === i ? T.primary : T.onSurfaceVariant,
          fontFamily: T.fontBody,
          display: "flex", alignItems: "center", gap: 6,
          borderBottom: active === i ? `3px solid ${T.primary}` : "3px solid transparent",
          marginBottom: -2,
          transition: `all 200ms ${T.easeStd}`,
        }}>
          {item.icon && <span>{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ─── SEGMENTED BUTTON ─────────────────────────────────────
function KSegmented({ options, defaultIndex = 0 }) {
  const [sel, setSel] = useState(defaultIndex);
  return (
    <div style={{ display: "flex", border: `1.5px solid ${T.outline}`, borderRadius: T.shapeFull, overflow: "hidden" }}>
      {options.map((opt, i) => (
        <button key={i} onClick={() => setSel(i)} style={{
          flex: 1, padding: "9px 16px",
          background: sel === i ? T.primaryContainer : T.surface,
          color: sel === i ? T.onPrimaryContainer : T.onSurface,
          border: "none",
          borderLeft: i > 0 ? `1px solid ${T.outline}` : "none",
          cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: T.fontBody,
          transition: `all 200ms ${T.easeBounce}`,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          {sel === i && <span>✓</span>}
          {opt.icon && <span>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── MENU ──────────────────────────────────────────────────
function KMenuDemo() {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: "✏️", label: "Bearbeiten" },
    { icon: "📋", label: "Kopieren" },
    { icon: "📌", label: "Anheften", divider: true },
    { icon: "🗑", label: "Löschen", destructive: true },
  ];
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <KBtn variant="outlined" label="Menü ▾" icon="⋮" onClick={() => setOpen(!open)} />
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0 }} onClick={() => setOpen(false)} />
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0,
            background: T.surfaceContainerLowest, borderRadius: T.shapeXl,
            boxShadow: T.elev4, minWidth: 200, zIndex: 100, overflow: "hidden",
            animation: "menuIn 150ms cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            {items.map((item, i) => (
              <div key={i}>
                {item.divider && <div style={{ height: 1, background: T.outlineVariant, margin: "4px 0" }} />}
                <div onClick={() => setOpen(false)} style={{
                  padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
                  cursor: "pointer", fontSize: 14, fontWeight: 600,
                  color: item.destructive ? T.error : T.onSurface,
                  transition: "background 150ms",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = item.destructive ? T.errorContainer : T.surfaceContainerLow}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── LIST ──────────────────────────────────────────────────
function KList({ items }) {
  return (
    <div style={{ background: T.surfaceContainerLowest, borderRadius: T.shapeXl, overflow: "hidden", border: `1.5px solid ${T.outlineVariant}`, width: 320 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          padding: "14px 16px", display: "flex", alignItems: "center", gap: 14,
          borderBottom: i < items.length - 1 ? `1px solid ${T.outlineVariant}` : "none",
          cursor: "pointer", transition: "background 150ms",
        }}
          onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainerLow}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          {item.leading && (
            <div style={{ width: 40, height: 40, borderRadius: T.shapeFull, background: T.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {item.leading}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: T.onSurface, fontSize: 14 }}>{item.headline}</div>
            {item.supporting && <div style={{ fontSize: 12, color: T.onSurfaceVariant, marginTop: 1 }}>{item.supporting}</div>}
          </div>
          {item.trailing && <div style={{ color: T.onSurfaceVariant, fontSize: 12, fontWeight: 600 }}>{item.trailing}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── TOP APP BAR ───────────────────────────────────────────
function KTopAppBar({ variant = "center" }) {
  return (
    <div style={{
      background: T.surfaceContainerLow,
      borderRadius: T.shapeXl,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      boxShadow: T.elev1,
      width: "100%",
    }}>
      <button style={{ background: T.surfaceContainer, border: "none", width: 36, height: 36, borderRadius: T.shapeFull, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
      {variant === "center" ? (
        <>
          <div style={{ flex: 1, textAlign: "center", fontWeight: 900, color: T.onSurface, fontSize: 16 }}>✿ Mein Profil</div>
          <KBadge count={3} icon="🔔" />
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>⋮</button>
        </>
      ) : (
        <>
          <div style={{ flex: 1, fontWeight: 900, color: T.onSurface, fontSize: 16 }}>✿ Mein Profil</div>
          <KBadge count={3} icon="🔔" />
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>🔍</button>
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>⋮</button>
        </>
      )}
    </div>
  );
}

// ─── SEARCH BAR ────────────────────────────────────────────
function KSearchBar({ variant = "bar" }) {
  const [val, setVal] = useState("");
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      background: T.surfaceContainerHigh,
      borderRadius: variant === "bar" ? T.shapeFull : `${T.shapeFull} ${T.shapeFull} 0 0`,
      padding: "10px 16px",
      display: "flex", alignItems: "center", gap: 12,
      width: 300,
      boxShadow: focused ? T.elev3 : T.elev1,
      transition: `box-shadow 200ms`,
      border: focused ? `2px solid ${T.primary}` : "2px solid transparent",
    }}>
      <span style={{ fontSize: 18, opacity: 0.6 }}>🔍</span>
      <input
        value={val} onChange={e => setVal(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder="Suche nach Kawaii..."
        style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14, fontFamily: T.fontBody, color: T.onSurface }}
      />
      {val && <button onClick={() => setVal("")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: T.onSurfaceVariant }}>✕</button>}
      {!val && <span style={{ fontSize: 16 }}>🎙</span>}
    </div>
  );
}

// ─── DATE PICKER ───────────────────────────────────────────
function KDatePicker() {
  const [selected, setSelected] = useState(null);
  const today = new Date();
  const days = ["Mo","Di","Mi","Do","Fr","Sa","So"];
  const month = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const offset = (firstDay + 6) % 7;
  return (
    <div style={{ background: T.surfaceContainerLowest, borderRadius: T.shapeXxl, padding: "20px", width: 300, boxShadow: T.elev4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button style={{ background: T.surfaceContainer, border: "none", width: 32, height: 32, borderRadius: T.shapeFull, cursor: "pointer" }}>‹</button>
        <div style={{ fontWeight: 900, color: T.onSurface, fontSize: 16 }}>
          ✿ {month[today.getMonth()]} {today.getFullYear()}
        </div>
        <button style={{ background: T.surfaceContainer, border: "none", width: 32, height: 32, borderRadius: T.shapeFull, cursor: "pointer" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 8 }}>
        {days.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: T.onSurfaceVariant, padding: "4px 0" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate();
          const isSel = selected === day;
          return (
            <button key={day} onClick={() => setSelected(day)} style={{
              width: "100%", aspectRatio: "1",
              background: isSel ? T.primary : isToday ? T.primaryContainer : "transparent",
              color: isSel ? T.onPrimary : isToday ? T.primary : T.onSurface,
              border: "none", borderRadius: T.shapeFull,
              cursor: "pointer", fontSize: 13, fontWeight: isSel || isToday ? 800 : 600,
              fontFamily: T.fontBody,
              transition: `all 200ms ${T.easeBounce}`,
              transform: isSel ? "scale(1.1)" : "none",
            }}>{day}</button>
          );
        })}
      </div>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <KBtn variant="text" label="Abbrechen" />
        <KBtn variant="filled" label={selected ? `${selected}. wählen ✿` : "Datum wählen"} />
      </div>
    </div>
  );
}

// ─── CAROUSEL ──────────────────────────────────────────────
function KCarousel() {
  const [active, setActive] = useState(0);
  const items = [
    { bg: "linear-gradient(135deg,#fce4ec,#f8bbd0)", emoji: "🌸", title: "Sakura Dreams", sub: "Spring Collection" },
    { bg: "linear-gradient(135deg,#ede7f6,#d1c4e9)", emoji: "💜", title: "Lavender Fields", sub: "Purple Edition" },
    { bg: "linear-gradient(135deg,#e0f7f4,#b2dfdb)", emoji: "🌿", title: "Mint Breeze", sub: "Fresh & Clean" },
    { bg: "linear-gradient(135deg,#fff9c4,#fff176)", emoji: "⭐", title: "Star Honey", sub: "Golden Hour" },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <div style={{ overflow: "hidden", borderRadius: T.shapeXxl }}>
        <div style={{ display: "flex", transition: `transform 400ms ${T.easeStd}`, transform: `translateX(-${active * 100}%)` }}>
          {items.map((item, i) => (
            <div key={i} style={{ minWidth: "100%", background: item.bg, height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 56 }}>{item.emoji}</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: T.onSurface }}>{item.title}</div>
              <div style={{ fontSize: 13, color: T.onSurfaceVariant }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14, alignItems: "center" }}>
        <button onClick={() => setActive(Math.max(0, active - 1))} style={{ background: T.surfaceContainerLow, border: `1.5px solid ${T.outlineVariant}`, borderRadius: T.shapeFull, width: 32, height: 32, cursor: "pointer" }}>‹</button>
        {items.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{
            width: active === i ? 24 : 8, height: 8,
            borderRadius: T.shapeFull,
            background: active === i ? T.primary : T.outlineVariant,
            transition: `all 300ms ${T.easeBounce}`,
            cursor: "pointer",
          }} />
        ))}
        <button onClick={() => setActive(Math.min(items.length - 1, active + 1))} style={{ background: T.surfaceContainerLow, border: `1.5px solid ${T.outlineVariant}`, borderRadius: T.shapeFull, width: 32, height: 32, cursor: "pointer" }}>›</button>
      </div>
    </div>
  );
}

// ─── DIVIDER ───────────────────────────────────────────────
function KDivider({ variant = "full", label }) {
  if (label) return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
      <div style={{ flex: 1, height: 1, background: T.outlineVariant }} />
      <span style={{ fontSize: 11, color: T.onSurfaceVariant, fontWeight: 800, letterSpacing: "0.08em" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: T.outlineVariant }} />
    </div>
  );
  return <div style={{ height: 1, background: T.outlineVariant, margin: "4px 0", marginLeft: variant === "inset" ? 72 : 0 }} />;
}

// ─── ELEVATION DEMO ────────────────────────────────────────
function ElevDemo({ level, shadow, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: T.shapeXl, background: T.surface, boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 8px", border: level === 0 ? `1.5px solid ${T.outlineVariant}` : "none" }}>
        {["🌸","🌺","💐","🌷","🪷","✿"][level]}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.onSurface }}>Level {level}</div>
      <div style={{ fontSize: 10, color: T.onSurfaceVariant }}>{label}</div>
    </div>
  );
}

// ─── STATE LAYER DEMO ──────────────────────────────────────
function StateDemo({ label, state, opacity, color }) {
  return (
    <div style={{ width: 100, textAlign: "center" }}>
      <div style={{ width: 80, height: 80, margin: "0 auto 8px", borderRadius: T.shapeLg, background: T.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <span style={{ fontSize: 28, position: "relative", zIndex: 1 }}>🌸</span>
        <div style={{ position: "absolute", inset: 0, background: color, opacity }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.onSurface }}>{label}</div>
      <div style={{ fontSize: 10, color: T.onSurfaceVariant }}>{Math.round(opacity * 100)}% overlay</div>
    </div>
  );
}

// ─── TYPE SCALE ROW ────────────────────────────────────────
const typeScale = [
  { role: "Display Large",   size: 57, weight: 400, tracking: -0.25, lineHeight: 64, use: "Hero Headlines, Splash" },
  { role: "Display Medium",  size: 45, weight: 400, tracking: 0,     lineHeight: 52, use: "Landingpage Hero" },
  { role: "Display Small",   size: 36, weight: 400, tracking: 0,     lineHeight: 44, use: "Section Intro" },
  { role: "Headline Large",  size: 32, weight: 700, tracking: 0,     lineHeight: 40, use: "Card Titles, Dialogs" },
  { role: "Headline Medium", size: 28, weight: 700, tracking: 0,     lineHeight: 36, use: "Page Headers" },
  { role: "Headline Small",  size: 24, weight: 700, tracking: 0,     lineHeight: 32, use: "Section Headers" },
  { role: "Title Large",     size: 22, weight: 700, tracking: 0,     lineHeight: 28, use: "Top App Bar, Modals" },
  { role: "Title Medium",    size: 16, weight: 700, tracking: 0.15,  lineHeight: 24, use: "List Headlines" },
  { role: "Title Small",     size: 14, weight: 700, tracking: 0.1,   lineHeight: 20, use: "Captions, Labels" },
  { role: "Label Large",     size: 14, weight: 700, tracking: 0.1,   lineHeight: 20, use: "Buttons, Tabs, Chips" },
  { role: "Label Medium",    size: 12, weight: 700, tracking: 0.5,   lineHeight: 16, use: "Badge, Navigation" },
  { role: "Label Small",     size: 11, weight: 700, tracking: 0.5,   lineHeight: 16, use: "Overlines, Timestamps" },
  { role: "Body Large",      size: 16, weight: 400, tracking: 0.5,   lineHeight: 24, use: "Article, Main Content" },
  { role: "Body Medium",     size: 14, weight: 400, tracking: 0.25,  lineHeight: 20, use: "Cards, Lists" },
  { role: "Body Small",      size: 12, weight: 400, tracking: 0.4,   lineHeight: 16, use: "Helper Text, Captions" },
];

// colorRoles is defined inside KawaiiDS2 so it re-evaluates on every theme change

// ─── MAIN RENDER ──────────────────────────────────────────
export default function KawaiiDS2() {
  const [activeSection, setActiveSection] = useState("color");
  const [snackVisible, setSnackVisible] = useState(false);
  const [themeKey, setThemeKey] = useState(0);
  const [activeCombo, setActiveCombo] = useState(null);
  const [shuffleHover, setShuffleHover] = useState(false);

  const showSnack = () => {
    setSnackVisible(true);
    setTimeout(() => setSnackVisible(false), 3000);
  };

  const shuffleTheme = () => {
    const combo = PALETTE_COMBOS[Math.floor(Math.random() * PALETTE_COMBOS.length)];
    Object.assign(T, buildThemeColors(combo[0], combo[1], combo[2]));
    setActiveCombo(combo);
    setThemeKey(k => k + 1);
  };

  // Re-evaluated on every render so color swatches stay in sync
  const colorRoles = [
    { role: "Primary",            bg: T.primary,            fg: T.onPrimary,            label: "Primäre Aktionen, FAB, aktive Zustände" },
    { role: "On Primary",         bg: T.onPrimary,          fg: T.primary,              label: "Text/Icons auf Primary" },
    { role: "Primary Container",  bg: T.primaryContainer,   fg: T.onPrimaryContainer,   label: "Chips aktiv, Selected-Badges" },
    { role: "Secondary",          bg: T.secondary,          fg: T.onSecondary,          label: "Sekundäre Buttons, Akzente" },
    { role: "Secondary Container",bg: T.secondaryContainer, fg: T.onSecondaryContainer, label: "Tonal Chips, Soft Cards" },
    { role: "Tertiary",           bg: T.tertiary,           fg: T.onTertiary,           label: "Kontrast-Akzent (Mint/Teal)" },
    { role: "Tertiary Container", bg: T.tertiaryContainer,  fg: T.onTertiaryContainer,  label: "Dekorative Highlights" },
    { role: "Error",              bg: T.error,              fg: T.onError,              label: "Fehlermeldungen, Destructive Actions" },
    { role: "Error Container",    bg: T.errorContainer,     fg: T.onErrorContainer,     label: "Error-Hintergründe" },
    { role: "Surface",            bg: T.surface,            fg: T.onSurface,            label: "Page Background, Base Cards" },
    { role: "Surface Variant",    bg: T.surfaceVariant,     fg: T.onSurfaceVariant,     label: "Abgestufte Cards, Inputs" },
    { role: "Outline",            bg: "#fff", fg: T.outline,                            label: "Borders, Divider" },
    { role: "Inverse Surface",    bg: T.inverseSurface,     fg: T.inverseOnSurface,     label: "Snackbar, Tooltip" },
  ];

  const renderContent = () => {
    switch(activeSection) {
      case "color": return (
        <div>
          <SectionHeader id="color" icon="🎨" title="Color System" sub="M3 definiert 30 Color Roles. Kawaii mappt sie auf emotionale Pastell-Paletten. Jede Role hat eine klare Bedeutung — nicht nur Ästhetik, sondern Funktion." />
          <DemoBox label="Color Roles (Light Scheme)">
            {colorRoles.map((r, i) => (
              <div key={i} style={{ textAlign: "center", minWidth: 90 }}>
                <div style={{ width: 72, height: 48, borderRadius: T.shapeMd, background: r.bg, border: `1.5px solid ${T.outlineVariant}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: r.fg }}>{r.role.split(" ").map(w => w[0]).join("")}</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.onSurface, lineHeight: 1.2 }}>{r.role}</div>
                <div style={{ fontSize: 9, color: T.onSurfaceVariant, marginTop: 1 }}>{r.label.slice(0,24)}…</div>
              </div>
            ))}
          </DemoBox>
          <DemoBox label="Surface Container Scale (Elevation Tint)">
            {[
              ["Lowest", T.surfaceContainerLowest],
              ["Low",    T.surfaceContainerLow],
              ["Base",   T.surfaceContainer],
              ["High",   T.surfaceContainerHigh],
              ["Highest",T.surfaceContainerHighest],
            ].map(([name, bg], i) => (
              <div key={i} style={{ width: 80, height: 80, borderRadius: T.shapeLg, background: bg, border: `1.5px solid ${T.outlineVariant}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: T.onSurface, textAlign: "center" }}>{name}</div>
              </div>
            ))}
          </DemoBox>
          <DemoBox label="Dark Kawaii Scheme" dark>
            {[
              ["Bg",       T.darkBg],
              ["Surface",  T.darkSurface],
              ["Primary",  T.darkPrimary],
              ["Cyber",    T.secondaryContainer],
              ["Orchid",   "#ea80fc"],
              ["Hologram", "#80deea"],
            ].map(([name, bg], i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: T.shapeMd, background: bg, border: "1.5px solid #4a0032", margin: "0 auto 4px" }} />
                <div style={{ fontSize: 10, fontWeight: 700, color: "#f8bbd0" }}>{name}</div>
              </div>
            ))}
          </DemoBox>
          <Spec items={[
            "Primary Hue: Pink 340° — HCT Farbraum analog zu M3's tonal palette generation",
            "Tonal Palette: 13 Stufen von 0 (schwarz) bis 100 (weiß) — Kawaii nutzt Tone 80–95 für Containers",
            "Kontrast-Minimum: 4.5:1 für Body Text (WCAG AA) — Petal auf Cream Blush NICHT für Text!",
            "Dark Scheme: Primärfarbe shiftet auf Tone 80 (#f48fb1) — nie reines Weiß auf dunkel-Backgrounds",
            "Dynamische Farben: User-Wallpaper-basiertes Theming (M3) → Kawaii Variante: seasonal palettes (cherry/mint/snow)",
          ]} />
        </div>
      );

      case "typography": return (
        <div>
          <SectionHeader id="typography" icon="✍️" title="Typography Scale" sub="M3's 15 Type Roles vollständig auf Kawaii gemappt. Basis-Font: Nunito (rund, friendly). Display nutzt optionale Bubble-Variante." />
          <div style={{ background: T.surfaceContainerLowest, borderRadius: T.shapeXl, overflow: "hidden", border: `1.5px solid ${T.outlineVariant}`, marginBottom: 20 }}>
            {typeScale.map((ts, i) => (
              <div key={i} style={{ padding: "10px 20px", borderBottom: i < typeScale.length - 1 ? `1px solid ${T.outlineVariant}` : "none", display: "grid", gridTemplateColumns: "180px 1fr 120px", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: T.onSurfaceVariant, letterSpacing: "0.06em" }}>{ts.role}</div>
                <div style={{ fontSize: Math.min(ts.size, 28), fontWeight: ts.weight, color: T.onSurface, fontFamily: T.fontDisplay, letterSpacing: ts.tracking + "px", lineHeight: ts.lineHeight / ts.size, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Kawaii デザイン ✿
                </div>
                <div style={{ fontSize: 10, color: T.onSurfaceVariant }}>{ts.size}px / {ts.lineHeight}px</div>
              </div>
            ))}
          </div>
          <DemoBox label="Font Pairing Empfehlungen">
            {[
              { display: "Nunito 900", body: "Nunito 400", label: "Pastel Kawaii", note: "Konsistente Rundung" },
              { display: "Comfortaa", body: "DM Sans", label: "Otona Kawaii", note: "Reifer, cleaner" },
              { display: "Fredoka One", body: "Nunito", label: "Pop Kawaii", note: "Maximum Cute" },
              { display: "Syne ExtraBold", body: "Jost", label: "Tech Kawaii", note: "Schärfer, moderner" },
            ].map((pair, i) => (
              <div key={i} style={{ background: T.surfaceContainerLow, borderRadius: T.shapeLg, padding: "14px 16px", minWidth: 160 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: T.primary, marginBottom: 2 }}>{pair.display}</div>
                <div style={{ fontSize: 13, color: T.onSurface, marginBottom: 6 }}>{pair.body}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: T.onSurfaceVariant, textTransform: "uppercase" }}>{pair.label}</div>
                <div style={{ fontSize: 10, color: T.outline }}>{pair.note}</div>
              </div>
            ))}
          </DemoBox>
        </div>
      );

      case "elevation": return (
        <div>
          <SectionHeader id="elevation" icon="🏔" title="Elevation System" sub="M3 nutzt Tinted Surface + Schatten. Kawaii mappt dies auf farbige Pink-Schatten statt neutral-graue. 6 Level (0–5)." />
          <DemoBox label="Elevation Levels — Surface mit Kawaii Tinted Shadow">
            {[T.elev0,T.elev1,T.elev2,T.elev3,T.elev4,T.elev5].map((shadow, i) => (
              <ElevDemo key={i} level={i} shadow={shadow} label={["Resting","Raised","Overlay","Modal","Sticky","Floating"][i]} />
            ))}
          </DemoBox>
          <DemoBox label="Dark Mode Elevation (Tinted Surface)">
            {[0,1,2,3,4,5].map((lvl, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: T.shapeXl,
                  background: `color-mix(in srgb, ${T.darkPrimary} ${[0,5,8,11,12,14][lvl]}%, ${T.darkSurface})`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                  margin: "0 auto 6px",
                  boxShadow: `0 ${[0,1,2,4,6,8][lvl]*2}px ${[0,4,8,16,24,32][lvl]}px rgba(244,143,177,${[0,0.06,0.1,0.14,0.18,0.22][lvl]})`,
                }}>🌸</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#f8bbd0" }}>+{[0,5,8,11,12,14][lvl]}% Tint</div>
              </div>
            ))}
          </DemoBox>
          <Spec items={[
            "Level 0: Keine Elevation, kein Shadow. Nur bei explizit flachen Elementen (Divider, Background-Shapes).",
            "Level 1: Raised Cards, Filled Buttons (ruhender Zustand), Navigation Drawer",
            "Level 2: FAB (ruhend), Dropdown-Menus, Navigationsbar",
            "Level 3: FAB (hover), Dialoge, Side Sheets",
            "Level 4: Navigation Drawer (hover), Sticky Headers",
            "Level 5: Tooltips, richtige Snackbars, floating Overlays",
          ]} />
        </div>
      );

      case "shape": return (
        <div>
          <SectionHeader id="shape" icon="🫧" title="Shape System" sub="M3 hat eine formale Shape Scale von None bis Full. Kawaii dreht alles nach rechts: Minimum-Radius erhöht, 'Full' (Pill) ist Standard für interaktive Elemente." />
          <DemoBox label="Shape Scale — Kawaii vs M3 Standard">
            {[
              { label: "None / XS", r: T.shapeXs, m3: "0–4px", kw: "4px (Tech Kawaii only)" },
              { label: "Small",     r: T.shapeSm, m3: "8px",   kw: "8px (Chips, Tags)" },
              { label: "Medium",    r: T.shapeMd, m3: "12px",  kw: "12px (Menus, Inputs)" },
              { label: "Large",     r: T.shapeLg, m3: "16px",  kw: "16px (Cards, Sheets)" },
              { label: "X-Large",   r: T.shapeXl, m3: "28px",  kw: "28px (Dialoge, Hero Cards)" },
              { label: "XX-Large",  r: T.shapeXxl,m3: "32px",  kw: "32px (Large Modals)" },
              { label: "Full",      r: T.shapeFull,m3:"∞",     kw: "999px — Buttons, FAB, Badges" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", minWidth: 90 }}>
                <div style={{ width: 72, height: 72, borderRadius: s.r, background: T.primaryContainer, border: `2px solid ${T.primary}`, margin: "0 auto 8px" }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: T.onSurface }}>{s.label}</div>
                <div style={{ fontSize: 9, color: T.primary, fontFamily: T.fontMono }}>{s.kw.split("(")[0]}</div>
                <div style={{ fontSize: 9, color: T.onSurfaceVariant }}>M3: {s.m3}</div>
              </div>
            ))}
          </DemoBox>
          <DemoBox label="Shape per Component-Gruppe">
            {[
              { label: "Buttons", shape: T.shapeFull, why: "Maximum friendliness" },
              { label: "Cards", shape: T.shapeXl, why: "Soft but structured" },
              { label: "Chips", shape: T.shapeSm, why: "Compact, readable" },
              { label: "Dialogs", shape: T.shapeXxl, why: "Premium modal feel" },
              { label: "Inputs (filled)", shape: `${T.shapeSm} ${T.shapeSm} 0 0`, why: "Ground-anchored" },
              { label: "Inputs (outlined)", shape: T.shapeXs, why: "Form clarity" },
              { label: "Navigation", shape: T.shapeXl, why: "Soft container" },
              { label: "FAB", shape: T.shapeLg, why: "Rounded, not pill" },
            ].map((c, i) => (
              <div key={i} style={{ background: T.surfaceContainerLow, borderRadius: c.shape, padding: "10px 14px", minWidth: 120 }}>
                <div style={{ fontWeight: 800, color: T.onSurface, fontSize: 12 }}>{c.label}</div>
                <div style={{ fontSize: 9, color: T.primary, fontFamily: T.fontMono, marginTop: 2 }}>{c.shape}</div>
                <div style={{ fontSize: 9, color: T.onSurfaceVariant, marginTop: 2 }}>{c.why}</div>
              </div>
            ))}
          </DemoBox>
        </div>
      );

      case "states": return (
        <div>
          <SectionHeader id="states" icon="✨" title="States & Interaction States" sub="M3 definiert 6 State Layers: Enabled, Hovered, Focused, Pressed, Dragged, Disabled. Kawaii fügt Bounce-Animationen und Sparkle-Feedback hinzu." />
          <DemoBox label="State Layer Overlay (Primary Color auf Container)">
            <StateDemo label="Enabled" state="enabled" opacity={0} color={T.primary} />
            <StateDemo label="Hovered" state="hovered" opacity={0.08} color={T.primary} />
            <StateDemo label="Focused" state="focused" opacity={0.12} color={T.primary} />
            <StateDemo label="Pressed" state="pressed" opacity={0.16} color={T.primary} />
            <StateDemo label="Dragged" state="dragged" opacity={0.16} color={T.secondary} />
            <StateDemo label="Disabled" state="disabled" opacity={0.38} color="#9e9e9e" />
          </DemoBox>
          <DemoBox label="Kawaii Interaction Additions (über M3 hinaus)">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
              {[
                { state: "Bounce Press", desc: "scale(0.96) bei mousedown, spring-back auf release. Easing: cubic-bezier(0.34,1.56,0.64,1)", token: "--kawaii-press-scale: 0.96" },
                { state: "Hover Lift", desc: "translateY(-2px) + elev-upgrade (z.B. elev1 → elev3) bei hover. Alle Cards, Buttons", token: "--kawaii-hover-lift: -2px" },
                { state: "Focus Glow", desc: "box-shadow: 0 0 0 3px primaryContainer beim Fokus (Tastatur). Sichtbarer als M3-Standard", token: "--kawaii-focus-ring: 3px" },
                { state: "Sparkle Burst", desc: "Kleine ✨-Partikel bei Klick auf Primary Actions. Optional, via JS. 300ms, dann fade out", token: "--kawaii-sparkle: true" },
                { state: "Wiggle Error", desc: "rotate(-4deg) → rotate(4deg) → 0 bei Validierungsfehler. 300ms, 2 Iterationen", token: "--kawaii-wiggle-deg: 4deg" },
                { state: "Float Idle", desc: "Dekorative Elemente floaten (–4px → +4px) im Idle. 3s infinite ease-in-out", token: "--kawaii-float-distance: 4px" },
              ].map((s, i) => (
                <div key={i} style={{ background: T.surfaceContainerLow, borderRadius: T.shapeMd, padding: "12px 16px", display: "grid", gridTemplateColumns: "160px 1fr 200px", gap: 12, alignItems: "center" }}>
                  <div style={{ fontWeight: 800, color: T.primary, fontSize: 13 }}>{s.state}</div>
                  <div style={{ fontSize: 12, color: T.onSurfaceVariant, lineHeight: 1.5 }}>{s.desc}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.onSurface, background: T.surfaceContainerHigh, padding: "4px 8px", borderRadius: T.shapeXs }}>{s.token}</div>
                </div>
              ))}
            </div>
          </DemoBox>
        </div>
      );

      case "buttons": return (
        <div>
          <SectionHeader id="buttons" icon="🌸" title="Buttons" sub="M3 hat 5 Button-Typen. Kawaii mappt sie auf Pill-Shape, tinted Shadows und Bounce-Press. Alle interaktiv." />
          <DemoBox label="Filled Button — Primary Action">
            <KBtn variant="filled" icon="🌸" label="Filled" />
            <KBtn variant="filled" icon="🌸" label="Filled Large" size="lg" />
            <KBtn variant="filled" icon="🌸" label="Disabled" disabled />
          </DemoBox>
          <DemoBox label="Filled Tonal — Secondary Action">
            <KBtn variant="filledTonal" icon="💜" label="Filled Tonal" />
            <KBtn variant="filledTonal" icon="✨" label="Tonal Large" size="lg" />
          </DemoBox>
          <DemoBox label="Elevated — Low emphasis on Surface">
            <KBtn variant="elevated" icon="🎀" label="Elevated" />
            <KBtn variant="elevated" icon="⭐" label="Elevated Sm" size="sm" />
          </DemoBox>
          <DemoBox label="Outlined — Medium emphasis">
            <KBtn variant="outlined" icon="🌺" label="Outlined" />
            <KBtn variant="outlined" label="No Icon" />
          </DemoBox>
          <DemoBox label="Text — Lowest emphasis">
            <KBtn variant="text" label="Text Button" />
            <KBtn variant="text" icon="→" label="Learn more" />
          </DemoBox>
          <Spec items={[
            "Alle Buttons: border-radius: 999px (pill) — M3 Standard ist 20px, Kawaii erhöht auf pill",
            "Filled: background = primary, shadow = elev1 ruhend, elev2 hover, bounce-press scale(0.97)",
            "Filled Tonal: background = primaryContainer, kein Schatten — für häufig genutzte sekundäre Actions",
            "Elevated: background = surfaceContainerLow, shadow Pflicht, hover elev-upgrade",
            "Outlined: border = 1.5px outline, transparenter BG, hover: primaryContainer 8% Overlay",
            "Text: kein Background, kein Border, minimaler State Layer — für tertiäre Aktionen in Dialogen",
          ]} />
        </div>
      );

      case "fab": return (
        <div>
          <SectionHeader id="fab" icon="➕" title="Floating Action Button (FAB)" sub="M3 hat 4 FAB-Varianten: Small, Regular, Large, Extended. Kawaii mappt auf 4 Farbvarianten + Extended mit optionalem Label." />
          <DemoBox label="FAB Varianten">
            <KFAB size="sm" icon="✿" variant="primary" />
            <KFAB size="md" icon="🌸" variant="primary" />
            <KFAB size="lg" icon="✿" variant="primary" />
            <KFAB size="md" icon="💜" variant="secondary" />
            <KFAB size="md" icon="🌿" variant="tertiary" />
            <KFAB size="md" icon="⭐" variant="surface" />
          </DemoBox>
          <DemoBox label="Extended FAB (mit Label)">
            <KFAB size="md" icon="🌸" label="Neuer Post" variant="primary" />
            <KFAB size="md" icon="✿" label="Erstellen" variant="secondary" />
            <KFAB size="md" icon="💜" label="Komponieren" variant="surface" />
          </DemoBox>
          <Spec items={[
            "Small FAB: 40×40px, border-radius: 12px — für kompakte Kontexte",
            "Regular FAB: 56×56px, border-radius: 16px — Standard",
            "Large FAB: 96×96px, border-radius: 28px — prominente primäre Aktion",
            "Extended: min-width 80px, icon + label, border-radius: 16px",
            "Alle FABs: elev3 ruhend → elev4 hover, immer über Content schwebend",
            "Kawaii: FAB-Icons bevorzugen Blumen/Stern-Symbole statt klassischem Plus",
          ]} />
        </div>
      );

      case "iconbtns": return (
        <div>
          <SectionHeader id="iconbtns" icon="💜" title="Icon Buttons" sub="M3 hat 4 Icon Button Varianten: Standard, Filled, Filled Tonal, Outlined. Plus Toggleable-State." />
          <DemoBox label="Icon Buttons — alle Varianten">
            {[
              { bg: "transparent", border: "none", color: T.primary, label: "Standard" },
              { bg: T.primary, border: "none", color: T.onPrimary, label: "Filled" },
              { bg: T.primaryContainer, border: "none", color: T.onPrimaryContainer, label: "Tonal" },
              { bg: "transparent", border: `1.5px solid ${T.outline}`, color: T.onSurfaceVariant, label: "Outlined" },
            ].map((v, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <button style={{
                  width: 48, height: 48, borderRadius: T.shapeFull,
                  background: v.bg, border: v.border, color: v.color,
                  cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 6px",
                  transition: `all 200ms ${T.easeBounce}`,
                }}>🌸</button>
                <div style={{ fontSize: 10, color: T.onSurfaceVariant, fontWeight: 700 }}>{v.label}</div>
              </div>
            ))}
          </DemoBox>
          <DemoBox label="Toggleable Icon Buttons">
            {["♡ → 💗", "🔔 → 🔕", "🌙 → ☀️", "🔖 → 🏷"].map((pair, i) => {
              const [off, on] = pair.split(" → ");
              const [toggled, setToggled] = useState(false);
              return (
                <div key={i} style={{ textAlign: "center" }}>
                  <button onClick={() => setToggled(!toggled)} style={{
                    width: 48, height: 48, borderRadius: T.shapeFull,
                    background: toggled ? T.primaryContainer : "transparent",
                    border: toggled ? "none" : `1.5px solid ${T.outlineVariant}`,
                    cursor: "pointer", fontSize: 22,
                    transition: `all 250ms ${T.easeBounce}`,
                    transform: toggled ? "scale(1.1)" : "scale(1)",
                  }}>{toggled ? on : off}</button>
                  <div style={{ fontSize: 10, color: T.onSurfaceVariant, fontWeight: 700, marginTop: 4 }}>{toggled ? "Active" : "Default"}</div>
                </div>
              );
            })}
          </DemoBox>
        </div>
      );

      case "chips": return (
        <div>
          <SectionHeader id="chips" icon="🎀" title="Chips" sub="M3 hat 4 Chip-Typen: Assist, Filter, Input, Suggestion. Kawaii-Chips haben weiche Shape und Bounce beim Togglen." />
          <DemoBox label="Assist Chips — Shortcuts">
            <KChip variant="assist" label="🎵 Musik" icon="🎵" />
            <KChip variant="assist" label="🌸 Favoriten" icon="🌸" />
            <KChip variant="assist" label="📅 Heute" icon="📅" />
          </DemoBox>
          <DemoBox label="Filter Chips — togglebar">
            <KChip variant="filter" label="Pastel" icon="🎨" />
            <KChip variant="filter" label="Kawaii" icon="✿" selected />
            <KChip variant="filter" label="Dark" icon="🌑" />
            <KChip variant="filter" label="Cute" icon="💗" />
          </DemoBox>
          <DemoBox label="Input Chips — Auswahl mit X">
            {["Sakura", "Mochi", "Yuzu"].map((tag, i) => (
              <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.primaryContainer, borderRadius: T.shapeSm, padding: "6px 12px", fontSize: 13, fontWeight: 700, color: T.onPrimaryContainer }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>✿</div>
                {tag}
                <span style={{ cursor: "pointer", opacity: 0.6 }}>✕</span>
              </div>
            ))}
          </DemoBox>
          <DemoBox label="Suggestion Chips — horizontal scroll">
            {["🌸 Alles", "💗 Beliebt", "⭐ Neu", "🎀 Angebote", "🌙 Exklusiv", "✨ Trending"].map((c, i) => (
              <KChip key={i} label={c} />
            ))}
          </DemoBox>
        </div>
      );

      case "cards": return (
        <div>
          <SectionHeader id="cards" icon="🃏" title="Cards" sub="M3 hat 3 Card-Varianten: Elevated, Filled, Outlined. Kawaii-Cards haben gerundete XL-Ecken und weiche Hover-Lift-Animationen." />
          <DemoBox label="Elevated, Filled, Outlined">
            <KCard variant="elevated" title="Sakura Latte ☕" subtitle="Spring Menu" body="Cremiger Matcha mit Kirschblüten-Sirup" badge="Neu ✿" />
            <KCard variant="filled" title="Mochi Delight 🍡" subtitle="Sweet Treats" body="Handgemachte Reiskuchen aus Tokyo" />
            <KCard variant="outlined" title="Yume Collection 🌙" subtitle="Dream Series" body="Limitierte Edition für Traumjäger" badge="Limited" />
          </DemoBox>
          <DemoBox label="Media Card (mit Hintergrund)">
            <KCard variant="elevated" media="linear-gradient(135deg,#fce4ec,#ede7f6)"
              title="Kawaii Workshop 🎨" subtitle="15. Mai · Online"
              body="Lerne kawaii UI in 3 Stunden"
              actions={<><KBtn variant="filled" label="Anmelden" size="sm" /><KBtn variant="text" label="Mehr" size="sm" /></>} />
          </DemoBox>
          <DemoBox label="Horizontal List Card">
            {[0,1,2].map(i => (
              <div key={i} style={{ display: "flex", background: T.surfaceContainerLow, borderRadius: T.shapeLg, overflow: "hidden", width: 300, border: `1.5px solid ${T.outlineVariant}` }}>
                <div style={{ width: 80, background: ["#fce4ec","#ede7f6","#e0f7f4"][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
                  {["🌸","💜","🌿"][i]}
                </div>
                <div style={{ padding: "12px 14px", flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: T.onSurface }}>Kawaii Item {i+1}</div>
                  <div style={{ fontSize: 11, color: T.onSurfaceVariant, marginTop: 2 }}>Supporting text here</div>
                  <KBtn variant="text" label="Details →" size="sm" />
                </div>
              </div>
            ))}
          </DemoBox>
        </div>
      );

      case "lists": return (
        <div>
          <SectionHeader id="lists" icon="📋" title="Lists" sub="M3 listet 1-line, 2-line, 3-line Varianten mit Leading/Trailing Elementen. Kawaii-Listen verwenden runde Avatare und Petal-Highlighting." />
          <DemoBox label="One-line, Two-line Lists">
            <KList items={[
              { leading: "🌸", headline: "Sakura Mode", trailing: "›" },
              { leading: "💜", headline: "Lavender Dreams", supporting: "Premium Feature", trailing: <KBadge count={2} icon="" /> },
              { leading: "🌿", headline: "Mint Collection", supporting: "12 neue Artikel verfügbar", trailing: "›" },
              { leading: "⭐", headline: "Starred Items", supporting: "Deine Favoriten", trailing: "→" },
            ]} />
          </DemoBox>
          <DemoBox label="Three-line List + Leading Image">
            <div style={{ background: T.surfaceContainerLowest, borderRadius: T.shapeXl, overflow: "hidden", border: `1.5px solid ${T.outlineVariant}`, width: 360 }}>
              {[
                { emoji: "🌸", title: "Sakura Diary", desc: "Heute war so ein schöner Tag im Kirschblütengarten. Die Blüten tanzten im Wind...", time: "10:24" },
                { emoji: "💗", title: "Kawaii Workshop", desc: "Hat mir jemand die Notizen vom gestrigen Workshop gesendet? Ich konnte leider nicht...", time: "gestern" },
              ].map((item, i) => (
                <div key={i} style={{ padding: "14px 16px", display: "flex", gap: 14, borderBottom: i < 1 ? `1px solid ${T.outlineVariant}` : "none", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainerLow}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 48, height: 48, borderRadius: T.shapeFull, background: T.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontWeight: 800, color: T.onSurface, fontSize: 14 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: T.onSurfaceVariant }}>{item.time}</div>
                    </div>
                    <div style={{ fontSize: 12, color: T.onSurfaceVariant, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </DemoBox>
        </div>
      );

      case "textfields": return (
        <div>
          <SectionHeader id="textfields" icon="📝" title="Text Fields" sub="M3 hat Filled und Outlined Text Fields. Kawaii-Version: Filled mit Pastel-Hintergrund, Outlined mit Blumenblüten als Focus-Indikator statt einfacher Line." />
          <DemoBox label="Filled Text Fields">
            <KTextField label="Spitzname ✿" placeholder="z.B. Sakura-chan" variant="filled" helperText="Dein Kawaii-Name" />
            <KTextField label="Passwort 🔐" placeholder="Geheimes Passwort" variant="filled" trailingIcon="👁" helperText="Mind. 8 Zeichen" />
            <KTextField label="Fehlerhaft ⚠️" placeholder="Ungültige Eingabe" variant="filled" error helperText="Diese E-Mail ist ungültig" />
            <KTextField label="Deaktiviert" placeholder="" variant="filled" disabled />
          </DemoBox>
          <DemoBox label="Outlined Text Fields">
            <KTextField label="Name" placeholder="Dein Name" variant="outlined" helperText="Pflichtfeld ✿" />
            <KTextField label="E-Mail 💌" placeholder="hello@kawaii.de" variant="outlined" icon="✉️" helperText="Für Kawaii-News" />
            <KTextField label="Fehler" variant="outlined" error helperText="Format ungültig" />
          </DemoBox>
        </div>
      );

      case "selection": return (
        <div>
          <SectionHeader id="selection" icon="☑️" title="Selection Controls" sub="Checkboxes, Radio Buttons, Switches. Alle mit Bounce-Transition und Kawaii-State-Colors." />
          <DemoBox label="Checkboxes">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <KCheckbox label="Erinnere mich 🌸" />
              <KCheckbox label="Vorausgewählt" defaultChecked />
              <KCheckbox label="Indeterminate" indeterminate />
            </div>
          </DemoBox>
          <DemoBox label="Radio Group">
            <KRadioGroup options={["Pastel Kawaii 🌸", "Dark Kawaii 🖤", "Tech Kawaii 🤖"]} defaultValue="Pastel Kawaii 🌸" />
          </DemoBox>
          <DemoBox label="Switches">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <KSwitch label="Dark Mode 🌑" />
              <KSwitch label="Benachrichtigungen 🔔" defaultOn />
              <KSwitch label="Kawaii Mode ✿" defaultOn />
            </div>
          </DemoBox>
        </div>
      );

      case "sliders": return (
        <div>
          <SectionHeader id="sliders" icon="🎚" title="Sliders" sub="M3 hat Continuous und Discrete Sliders. Kawaii: Thumb zeigt ✿ Symbol statt Kreis, Track in Petal-Gradient." />
          <DemoBox label="Continuous Slider">
            <KSlider label="Lautstärke 🎵" defaultValue={65} />
            <KSlider label="Helligkeit ☀️" defaultValue={80} />
            <KSlider label="Kawaii-Level ✿" defaultValue={100} />
          </DemoBox>
          <DemoBox label="Discrete Slider (konzeptuell — 5 Schritte)">
            <div style={{ width: 260 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11, fontWeight: 700, color: T.onSurfaceVariant }}>
                {["😴","😊","🌸","💗","✨"].map((e, i) => <span key={i}>{e}</span>)}
              </div>
              <KSlider label="Stimmung" defaultValue={60} />
            </div>
          </DemoBox>
        </div>
      );

      case "navigation": return (
        <div>
          <SectionHeader id="navigation" icon="🧭" title="Navigation" sub="M3 hat Navigation Bar (mobile), Navigation Rail (tablet), Navigation Drawer (desktop). Alle interaktiv." />
          <DemoBox label="Navigation Bar — Mobile Bottom Nav">
            <KNavBar />
          </DemoBox>
          <DemoBox label="Navigation Rail — Tablet">
            <KNavRail />
          </DemoBox>
          <DemoBox label="Navigation Drawer — Konzeptuell (Desktop)">
            <div style={{ background: T.surfaceContainerLow, borderRadius: T.shapeXl, padding: "20px 0", width: 260, boxShadow: T.elev2 }}>
              <div style={{ padding: "0 20px 16px", borderBottom: `1px solid ${T.outlineVariant}` }}>
                <div style={{ fontWeight: 900, fontSize: 18, color: T.onSurface }}>✿ Kawaii App</div>
              </div>
              {[
                { icon: "🏠", label: "Dashboard", active: true },
                { icon: "🌸", label: "Entdecken" },
                { icon: "💗", label: "Favoriten", badge: 3 },
                { icon: "📅", label: "Kalender" },
                { icon: "⚙️", label: "Einstellungen" },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: "12px 20px", display: "flex", alignItems: "center", gap: 14,
                  background: item.active ? T.primaryContainer : "transparent",
                  borderRadius: `0 ${T.shapeFull} ${T.shapeFull} 0`,
                  marginRight: 12, marginLeft: 0, marginBottom: 2,
                  cursor: "pointer",
                }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontWeight: item.active ? 800 : 600, color: item.active ? T.onPrimaryContainer : T.onSurface, flex: 1 }}>{item.label}</span>
                  {item.badge && <KBadge count={item.badge} icon="" />}
                </div>
              ))}
            </div>
          </DemoBox>
        </div>
      );

      case "appbars": return (
        <div>
          <SectionHeader id="appbars" icon="📱" title="App Bars" sub="Top App Bar (Small, Center-aligned, Medium, Large) + Bottom App Bar. Kawaii: Blumen-Dekoration, Badge-Overlay auf Icons." />
          <DemoBox label="Top App Bar — Center Aligned">
            <KTopAppBar variant="center" />
          </DemoBox>
          <DemoBox label="Top App Bar — Left Aligned">
            <KTopAppBar variant="left" />
          </DemoBox>
          <DemoBox label="Top App Bar — Large (Scrolled State)">
            <div style={{ background: T.surfaceContainerLow, borderRadius: T.shapeXl, padding: "16px 20px", width: "100%", boxShadow: T.elev2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
                <div style={{ display: "flex", gap: 4 }}>
                  {["🔍","🔔","⋮"].map((ic, i) => <button key={i} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>{ic}</button>)}
                </div>
              </div>
              <div style={{ fontWeight: 900, fontSize: 28, color: T.onSurface, lineHeight: 1.1 }}>🌸 Meine Sammlung</div>
              <div style={{ fontSize: 12, color: T.onSurfaceVariant, marginTop: 4 }}>47 Kawaii Schätze</div>
            </div>
          </DemoBox>
          <DemoBox label="Bottom App Bar">
            <div style={{ background: T.surfaceContainerLow, borderRadius: T.shapeXl, padding: "8px 16px", display: "flex", alignItems: "center", gap: 4, width: "100%", boxShadow: T.elev2 }}>
              {["🌸","🔍","🎨","💗"].map((ic, i) => (
                <button key={i} style={{ flex: 1, background: "none", border: "none", padding: "10px 0", cursor: "pointer", fontSize: 22, borderRadius: T.shapeFull }}>
                  {ic}
                </button>
              ))}
              <div style={{ flex: 2 }} />
              <KFAB size="sm" icon="✿" variant="primary" />
            </div>
          </DemoBox>
        </div>
      );

      case "dialogs": return (
        <div>
          <SectionHeader id="dialogs" icon="💬" title="Dialogs & Sheets" sub="M3 hat Basic Dialog, Full-Screen Dialog, Bottom Sheet (Modal + Standard), Side Sheet. Alle mit Scrim-Overlay und Spring-Eingang." />
          <DemoBox label="Basic Dialog + Bottom Sheet (klickbar)">
            <KDialogDemo />
            <KBottomSheetDemo />
          </DemoBox>
          <DemoBox label="Full-Screen Dialog (konzeptuell)">
            <div style={{ background: T.surfaceContainerLowest, borderRadius: T.shapeXl, overflow: "hidden", width: 320, border: `1.5px solid ${T.outlineVariant}` }}>
              <div style={{ background: T.surfaceContainerLow, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>✕</button>
                <div style={{ flex: 1, fontWeight: 800, color: T.onSurface }}>Neuen Eintrag erstellen</div>
                <KBtn variant="filled" label="Speichern ✿" size="sm" />
              </div>
              <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
                <KTextField label="Titel" variant="filled" />
                <KTextField label="Beschreibung" variant="filled" />
              </div>
            </div>
          </DemoBox>
          <DemoBox label="Side Sheet (Desktop)">
            <div style={{ display: "flex", gap: 0, height: 200, borderRadius: T.shapeXl, overflow: "hidden", border: `1.5px solid ${T.outlineVariant}` }}>
              <div style={{ flex: 1, background: T.surface, padding: 16 }}>
                <div style={{ fontWeight: 800, color: T.onSurface }}>Hauptinhalt</div>
                <div style={{ fontSize: 12, color: T.onSurfaceVariant, marginTop: 4 }}>Side Sheet ist geöffnet →</div>
              </div>
              <div style={{ width: 220, background: T.surfaceContainerLow, padding: 16, borderLeft: `1px solid ${T.outlineVariant}` }}>
                <div style={{ fontWeight: 800, color: T.onSurface, marginBottom: 12 }}>✿ Details</div>
                {["Farbe", "Größe", "Material"].map((f, i) => (
                  <div key={i} style={{ fontSize: 12, color: T.onSurfaceVariant, padding: "8px 0", borderBottom: `1px solid ${T.outlineVariant}` }}>{f}</div>
                ))}
              </div>
            </div>
          </DemoBox>
        </div>
      );

      case "menus": return (
        <div>
          <SectionHeader id="menus" icon="📂" title="Menus & Tabs" sub="M3: Dropdown Menu, Exposed Dropdown, Primary Tabs, Secondary Tabs, Segmented Button. Alle interaktiv." />
          <DemoBox label="Dropdown Menu (klickbar)">
            <KMenuDemo />
          </DemoBox>
          <DemoBox label="Primary Tabs">
            <KTabs items={[
              { icon: "🌸", label: "Pastel" },
              { icon: "🌑", label: "Dark" },
              { icon: "🤖", label: "Tech" },
              { icon: "💜", label: "Yume" },
            ]} />
          </DemoBox>
          <DemoBox label="Secondary Tabs (ohne Icons)">
            <KTabs items={[
              { label: "Alle" }, { label: "Beliebt" }, { label: "Neu" }, { label: "Angebote" },
            ]} />
          </DemoBox>
          <DemoBox label="Segmented Button">
            <KSegmented options={[{ label: "Tag", icon: "☀️" }, { label: "Woche", icon: "📅" }, { label: "Monat", icon: "📆" }]} />
            <KSegmented options={[{ label: "Liste" }, { label: "Raster" }, { label: "Karten" }]} defaultIndex={1} />
          </DemoBox>
        </div>
      );

      case "progress": return (
        <div>
          <SectionHeader id="progress" icon="⏳" title="Progress Indicators" sub="M3 hat Linear und Circular Progress, jeweils Determinate und Indeterminate. Kawaii: Gradient-Track, ✿-Thumb." />
          <DemoBox label="Linear Progress — Determinate">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[20, 55, 80, 100].map(v => (
                <div key={v} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <KLinearProgress value={v} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.primary }}>{v}%</span>
                </div>
              ))}
            </div>
          </DemoBox>
          <DemoBox label="Linear Progress — Indeterminate">
            <KLinearProgress indeterminate />
          </DemoBox>
          <DemoBox label="Circular Progress — Determinate">
            {[25, 50, 75, 100].map(v => (
              <div key={v} style={{ textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <KCircularProgress value={v} size={56} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: T.primary }}>{v}%</div>
                </div>
              </div>
            ))}
          </DemoBox>
          <DemoBox label="Circular Progress — Indeterminate">
            <KCircularProgress indeterminate size={48} />
            <KCircularProgress indeterminate size={36} />
            <KCircularProgress indeterminate size={24} />
          </DemoBox>
        </div>
      );

      case "snackbadge": return (
        <div>
          <SectionHeader id="snackbadge" icon="🔔" title="Snackbar & Badges" sub="M3 Snackbar: kurze Feedbackmeldungen, elev5, Inverse Surface. Badges: Large (mit Zahl) und Small (Punkt)." />
          <DemoBox label="Badges — Large, Small, Zero">
            <KBadge count={3} icon="🔔" />
            <KBadge count={12} icon="💌" />
            <KBadge count={99} icon="🌸" />
            <KBadge count={150} icon="⭐" />
            <KBadge count={0} icon="🎀" />
          </DemoBox>
          <DemoBox label="Snackbar — verschiedene Typen (klickbar)">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <KSnackbar visible message="✿ Erfolgreich gespeichert!" action="Rückgängig" icon="🌸" />
              <KSnackbar visible message="Verbindung wiederhergestellt 💜" />
              <KSnackbar visible message="⚠ Speichern fehlgeschlagen" action="Erneut versuchen" />
            </div>
          </DemoBox>
          <DemoBox label="Snackbar Live-Demo">
            <KBtn variant="filled" label="Snackbar auslösen 🔔" icon="✿" onClick={showSnack} />
            <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 999 }}>
              <KSnackbar visible={snackVisible} message="🌸 Kawaii Design System aktiviert!" action="Super!" icon="✿" />
            </div>
          </DemoBox>
        </div>
      );

      case "datepicker": return (
        <div>
          <SectionHeader id="datepicker" icon="📅" title="Date & Time Picker" sub="M3: Date Picker (Modal + Docked), Time Picker. Kawaii: Blüten-Highlight für Today, Pill-Shape für selected Day." />
          <DemoBox label="Date Picker (Docked)">
            <KDatePicker />
          </DemoBox>
          <DemoBox label="Time Picker (konzeptuell)">
            <div style={{ background: T.surfaceContainerLowest, borderRadius: T.shapeXxl, padding: "24px", width: 280, boxShadow: T.elev3 }}>
              <div style={{ fontWeight: 800, color: T.onSurface, marginBottom: 16 }}>⏰ Zeit wählen</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
                {["14", ":", "30"].map((part, i) => (
                  <div key={i} style={{
                    background: i === 1 ? "transparent" : T.primaryContainer,
                    borderRadius: i === 1 ? 0 : T.shapeLg,
                    padding: i === 1 ? "0 4px" : "12px 20px",
                    fontWeight: 900, fontSize: i === 1 ? 32 : 40, color: i === 1 ? T.onSurface : T.onPrimaryContainer,
                    cursor: i !== 1 ? "pointer" : "default",
                  }}>{part}</div>
                ))}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {["AM","PM"].map((p, i) => (
                    <button key={i} style={{ background: i === 1 ? T.primaryContainer : "transparent", border: `1.5px solid ${T.outlineVariant}`, borderRadius: T.shapeSm, padding: "6px 10px", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: T.fontBody, color: i === 1 ? T.onPrimaryContainer : T.onSurface }}>{p}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
                <KBtn variant="text" label="Abbrechen" size="sm" />
                <KBtn variant="filled" label="OK ✿" size="sm" />
              </div>
            </div>
          </DemoBox>
        </div>
      );

      case "carousel": return (
        <div>
          <SectionHeader id="carousel" icon="🎠" title="Carousel" sub="M3 Carousel: Multi-Browse und Hero Layouts. Kawaii: weiche Einblende-Transition, Petal-Dot-Indikatoren, Bounce beim Slide." />
          <DemoBox label="Hero Carousel (voll interaktiv)">
            <KCarousel />
          </DemoBox>
          <DemoBox label="Multi-Browse Carousel">
            <div style={{ display: "flex", gap: 12, overflow: "hidden", width: "100%" }}>
              {[
                { bg: "#fce4ec", e: "🌸", t: "Sakura" },
                { bg: "#ede7f6", e: "💜", t: "Yume" },
                { bg: "#e0f7f4", e: "🌿", t: "Mint" },
                { bg: "#fff9c4", e: "⭐", t: "Star" },
              ].map((item, i) => (
                <div key={i} style={{ background: item.bg, borderRadius: T.shapeXl, padding: "20px 16px", minWidth: 120, textAlign: "center", flexShrink: 0, boxShadow: T.elev1 }}>
                  <div style={{ fontSize: 36 }}>{item.e}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: T.onSurface, marginTop: 6 }}>{item.t}</div>
                </div>
              ))}
            </div>
          </DemoBox>
        </div>
      );

      case "search": return (
        <div>
          <SectionHeader id="search" icon="🔍" title="Search" sub="M3 hat Search Bar und Search View. Kawaii: Petal-Focus-State, Mic-Icon in Primary-Color, Vorschläge als weiche Chips." />
          <DemoBox label="Search Bar (Standard)">
            <KSearchBar variant="bar" />
          </DemoBox>
          <DemoBox label="Search View (mit Suggestions)">
            <div style={{ width: 320 }}>
              <div style={{ background: T.surfaceContainerHigh, borderRadius: `${T.shapeFull} ${T.shapeFull} 0 0`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, border: `2px solid ${T.primary}` }}>
                <span style={{ fontSize: 16 }}>←</span>
                <input defaultValue="Kawa" style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14, fontFamily: T.fontBody, color: T.onSurface }} />
                <span style={{ cursor: "pointer", fontSize: 13, opacity: 0.5 }}>✕</span>
              </div>
              <div style={{ background: T.surfaceContainerLow, borderRadius: `0 0 ${T.shapeXl} ${T.shapeXl}`, overflow: "hidden", boxShadow: T.elev3 }}>
                {["Kawaii Design", "Kawaii Fonts", "Kawaii UI Kit", "Kawaii Icons"].map((s, i) => (
                  <div key={i} style={{ padding: "12px 20px", display: "flex", gap: 12, cursor: "pointer", fontSize: 14, color: T.onSurface, fontWeight: 600, alignItems: "center" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainerLow}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ opacity: 0.5 }}>🔍</span>{s}<span style={{ marginLeft: "auto", opacity: 0.4, fontSize: 12 }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </DemoBox>
        </div>
      );

      case "dividers": return (
        <div>
          <SectionHeader id="dividers" icon="✦" title="Dividers" sub="M3 hat Full-width und Inset Dividers. Kawaii fügt Label-Divider und dekorative ✦-Trennlinien hinzu." />
          <DemoBox label="Divider Varianten">
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: T.onSurfaceVariant, marginBottom: 8 }}>Full-width</div>
                <KDivider variant="full" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: T.onSurfaceVariant, marginBottom: 8 }}>Inset (72px Left)</div>
                <KDivider variant="inset" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: T.onSurfaceVariant, marginBottom: 8 }}>Mit Label</div>
                <KDivider label="✦ NEUE SECTION ✦" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: T.onSurfaceVariant, marginBottom: 8 }}>Kawaii Dekor-Divider</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${T.outlineVariant})` }} />
                  <span style={{ fontSize: 16 }}>🌸</span>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${T.outlineVariant}, transparent)` }} />
                </div>
              </div>
            </div>
          </DemoBox>
        </div>
      );

      case "tooltips": return (
        <div>
          <SectionHeader id="tooltips" icon="💭" title="Tooltips" sub="M3 hat Plain Tooltip und Rich Tooltip. Kawaii: Inverse Surface mit Petal-Akzent, Bounce-Eingang, Positions oben/unten/links/rechts." />
          <DemoBox label="Plain Tooltips — alle Positionen (hover)">
            <KTooltip text="✿ Oben platziert" pos="top">
              <KBtn variant="filledTonal" label="Top ▲" />
            </KTooltip>
            <KTooltip text="✿ Unten platziert" pos="bottom">
              <KBtn variant="filledTonal" label="Bottom ▼" />
            </KTooltip>
            <KTooltip text="← Links" pos="left">
              <KBtn variant="filledTonal" label="Left ◄" />
            </KTooltip>
            <KTooltip text="Rechts →" pos="right">
              <KBtn variant="filledTonal" label="Right ►" />
            </KTooltip>
          </DemoBox>
          <DemoBox label="Rich Tooltip (konzeptuell)">
            <div style={{ background: T.inverseSurface, borderRadius: T.shapeLg, padding: "14px 16px", maxWidth: 240, boxShadow: T.elev2 }}>
              <div style={{ fontWeight: 800, color: T.inversePrimary, marginBottom: 6, fontSize: 14 }}>🌸 Kawaii Tooltip</div>
              <div style={{ fontSize: 12, color: T.inverseOnSurface, lineHeight: 1.6, marginBottom: 8 }}>Rich Tooltips können längere Erklärungen und einen optionalen Link-Button enthalten.</div>
              <button style={{ background: "none", border: "none", color: T.inversePrimary, fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: T.fontBody }}>Mehr erfahren →</button>
            </div>
          </DemoBox>
        </div>
      );

      default: return <div style={{ color: T.onSurface }}>Section wird geladen…</div>;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; transition: background-color 350ms ease, color 350ms ease, border-color 350ms ease, box-shadow 350ms ease; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${T.background}; }
        ::-webkit-scrollbar-thumb { background: ${T.surfaceContainerHighest}; border-radius: 999px; }
        @keyframes dialogIn { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes menuIn { from { opacity: 0; transform: scaleY(0.8); transform-origin: top; } to { opacity: 1; transform: none; } }
        @keyframes shuffleSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: T.background, fontFamily: T.fontBody, fontSize: 14 }}>
        {/* Sidebar */}
        <div style={{ width: 226, flexShrink: 0, background: T.surfaceContainerLow, borderRight: `2px solid ${T.outlineVariant}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          <div style={{ padding: "20px 16px 16px", borderBottom: `2px solid ${T.outlineVariant}` }}>
            <div style={{ fontSize: 22, marginBottom: 2 }}>🌸</div>
            <div style={{ fontWeight: 900, fontSize: 14, color: T.onSurface, lineHeight: 1.2 }}>Kawaii DS</div>
            <div style={{ fontSize: 10, color: T.outline, fontWeight: 700, letterSpacing: "0.08em", marginTop: 2 }}>M3-PARITY · V2.0</div>
          </div>
          <div style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} style={{
                width: "100%", background: "none", border: "none", cursor: "pointer",
                padding: "9px 16px", textAlign: "left", display: "flex", gap: 10, alignItems: "center",
                fontSize: 12.5, fontWeight: activeSection === item.id ? 800 : 600,
                color: activeSection === item.id ? T.primary : T.onSurfaceVariant,
                background: activeSection === item.id ? T.primaryContainer : "transparent",
                borderLeft: `3px solid ${activeSection === item.id ? T.primary : "transparent"}`,
                fontFamily: T.fontBody,
                transition: "all 150ms",
              }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto", maxWidth: 900 }}>
          {renderContent()}
        </div>
      </div>

      {/* ── Shuffle FAB ─────────────────────────────────────── */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
        {activeCombo && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: T.inverseSurface, borderRadius: T.shapeFull,
            padding: "5px 14px 5px 8px", boxShadow: T.elev2,
            opacity: shuffleHover ? 1 : 0.85,
            transition: "opacity 200ms",
          }}>
            {activeCombo.map((c, i) => (
              <div key={i} style={{
                width: 16, height: 16, borderRadius: "50%", background: c,
                border: "1.5px solid rgba(255,255,255,0.35)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            ))}
            <span style={{ fontSize: 10, fontWeight: 700, color: T.inverseOnSurface, marginLeft: 4, letterSpacing: "0.04em" }}>
              Aktive Palette
            </span>
          </div>
        )}
        <button
          onClick={shuffleTheme}
          onMouseEnter={() => setShuffleHover(true)}
          onMouseLeave={() => setShuffleHover(false)}
          title="Zufällige Farbpalette"
          style={{
            width: 56, height: 56, borderRadius: "50%",
            background: shuffleHover ? T.primaryContainer : T.primary,
            color: shuffleHover ? T.onPrimaryContainer : T.onPrimary,
            border: `2px solid ${shuffleHover ? T.primary : "transparent"}`,
            cursor: "pointer",
            boxShadow: shuffleHover ? T.elev5 : T.elev3,
            fontSize: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: shuffleHover ? "scale(1.08) rotate(30deg)" : "scale(1)",
            transition: `all 250ms ${T.easeBounce}`,
            outline: "none",
          }}
        >
          ⇄
        </button>
      </div>
    </>
  );
}
