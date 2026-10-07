import React from 'react';

/* Avatar profil fiksi (ilustrasi, bukan foto orang nyata), dipakai di bagian testimoni landing. */

/* Avatar profil fiksi (ilustrasi, bukan foto orang nyata). */
export const AVATAR_PARTS = {
  bun: [
    <path key="sh" d="M4 58 C6 44 16 40 28 40 C40 40 50 44 52 58Z" fill="#7A2E4A" />,
    <path key="hb" d="M14 30 C12 16 18 10 28 10 C38 10 44 16 42 30 L42 44 C40 50 16 50 14 44Z" fill="#2A1A14" />,
    <circle key="bun" cx="28" cy="10" r="6" fill="#2A1A14" />,
    <ellipse key="face" cx="28" cy="28" rx="10.5" ry="12" fill="#E8B896" />,
    <path key="fr" d="M17 25 C18 15 25 13 30 15 C36 16 39 21 39 26 C34 21 26 20 17 25Z" fill="#2A1A14" />,
    <circle key="e1" cx="24" cy="29" r="1.2" fill="#1A120E" />,
    <circle key="e2" cx="32" cy="29" r="1.2" fill="#1A120E" />,
    <path key="sm" d="M24 35 Q28 38 32 35" stroke="#8A3B3B" strokeWidth="1.4" strokeLinecap="round" fill="none" />,
    <circle key="ea1" cx="17.5" cy="33" r="1.4" fill="#F5C542" />,
    <circle key="ea2" cx="38.5" cy="33" r="1.4" fill="#F5C542" />
  ],
  beard: [
    <path key="sh" d="M4 58 C6 44 16 40 28 40 C40 40 50 44 52 58Z" fill="#2F4A6B" />,
    <ellipse key="face" cx="28" cy="27" rx="10" ry="11.5" fill="#B97A56" />,
    <path key="hair" d="M18 22 C18 12 24 9 29 9 C36 9 39 14 38 22 C34 17 24 16 18 22Z" fill="#1A1410" />,
    <path key="beard" d="M18 30 C18 42 24 44 28 44 C32 44 38 42 38 30 C36 36 32 38 28 38 C24 38 20 36 18 30Z" fill="#1A1410" />,
    <path key="br" d="M21 21 Q24 19.5 26 21 M30 21 Q32 19.5 35 21" stroke="#1A1410" strokeWidth="1.4" strokeLinecap="round" fill="none" />,
    <circle key="e1" cx="24" cy="25" r="1.2" fill="#1A120E" />,
    <circle key="e2" cx="32" cy="25" r="1.2" fill="#1A120E" />
  ],
  curly: [
    <path key="sh" d="M4 58 C6 44 16 40 28 40 C40 40 50 44 52 58Z" fill="#2F6B5A" />,
    <g key="hair" fill="#1C1410">
      <circle cx="15" cy="20" r="5" />
      <circle cx="21" cy="12" r="5.5" />
      <circle cx="30" cy="10" r="5.5" />
      <circle cx="39" cy="14" r="5" />
      <circle cx="42" cy="22" r="4" />
      <circle cx="14" cy="28" r="4" />
    </g>,
    <ellipse key="face" cx="28" cy="27" rx="10.5" ry="11.5" fill="#D9A07A" />,
    <g key="gl" fill="none" stroke="#111827" strokeWidth="1.4">
      <circle cx="24" cy="26" r="3.6" />
      <circle cx="32" cy="26" r="3.6" />
    </g>,
    <circle key="e1" cx="24" cy="26" r="1" fill="#111827" />,
    <circle key="e2" cx="32" cy="26" r="1" fill="#111827" />,
    <path key="sm" d="M24 33 Q28 36 32 33" stroke="#7A3B2A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  ],
  cap: [
    <path key="sh" d="M4 58 C6 44 16 40 28 40 C40 40 50 44 52 58Z" fill="#B5452C" />,
    <ellipse key="face" cx="28" cy="29" rx="10" ry="11" fill="#C98B63" />,
    <path key="cap" d="M16 22 C16 12 22 8 28 8 C34 8 40 12 40 22Z" fill="#E11D3A" />,
    <rect key="brim" x="13" y="20" width="30" height="4" rx="2" fill="#B81530" />,
    <circle key="e1" cx="24" cy="30" r="1.2" fill="#1A120E" />,
    <circle key="e2" cx="32" cy="30" r="1.2" fill="#1A120E" />,
    <path key="sm" d="M24 36 Q28 39 32 36" stroke="#5B2A1A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  ],
  bob: [
    <path key="sh" d="M4 58 C6 44 16 40 28 40 C40 40 50 44 52 58Z" fill="#5B3A6E" />,
    <path key="hb" d="M14 30 C12 16 18 10 28 10 C38 10 44 16 42 30 L42 38 C36 40 20 40 14 38Z" fill="#4A2C1C" />,
    <ellipse key="face" cx="28" cy="28" rx="10" ry="11.5" fill="#F0C9A8" />,
    <path key="fr" d="M17 26 C18 16 24 14 28 15 C34 15 39 19 39 26 L36 22 C30 20 24 21 17 26Z" fill="#4A2C1C" />,
    <circle key="e1" cx="24" cy="28" r="1.2" fill="#1A120E" />,
    <circle key="e2" cx="32" cy="28" r="1.2" fill="#1A120E" />,
    <path key="sm" d="M24 34 Q28 37 32 34" stroke="#8A3B3B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  ]
};

export function FictionalAvatar({ kind, bg, size }) {
  const clipId = "av-clip-" + kind;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <clipPath id={clipId}><circle cx="28" cy="28" r="28" /></clipPath>
      </defs>
      <g clipPath={"url(#" + clipId + ")"}>
        <rect width="56" height="56" fill={bg} />
        {AVATAR_PARTS[kind]}
      </g>
    </svg>
  );
}

