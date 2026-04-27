interface CVIconProps {
  name: string
  size?: number
  stroke?: string
  sw?: number
}

export default function CVIcon({ name, size = 18, stroke = 'currentColor', sw = 1.7 }: CVIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24' as string,
    fill: 'none' as const,
    stroke,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (name) {
    case 'home':
      return <svg {...props}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>
    case 'grid':
      return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
    case 'gift':
      return <svg {...props}><rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18M12 8v13M8 8a2.5 2.5 0 1 1 0-5c2 0 4 5 4 5M16 8a2.5 2.5 0 1 0 0-5c-2 0-4 5-4 5"/></svg>
    case 'user':
      return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
    case 'search':
      return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></svg>
    case 'cart':
      return <svg {...props}><path d="M3 4h2l2.5 12h11l2-9H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/></svg>
    case 'heart':
      return <svg {...props}><path d="M12 21s-7-4.5-9-9.5C1.5 7 5 4 8 5.5c1.7 1 3 3 4 4 1-1 2.3-3 4-4 3-1.5 6.5 1.5 5 6-2 5-9 9.5-9 9.5z"/></svg>
    case 'chev-r':
      return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>
    case 'chev-l':
      return <svg {...props}><path d="M15 6l-6 6 6 6"/></svg>
    case 'plus':
      return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>
    case 'minus':
      return <svg {...props}><path d="M5 12h14"/></svg>
    case 'filter':
      return <svg {...props}><path d="M3 5h18M6 12h12M10 19h4"/></svg>
    case 'sliders':
      return <svg {...props}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="14" cy="18" r="2"/></svg>
    case 'wechat':
      return <svg {...props}><path d="M9 4C5 4 2 6.7 2 10c0 1.7.8 3.2 2.2 4.3L3.5 17l3-1.5c.7.2 1.5.3 2.5.3l.5 0"/><path d="M15 9c-3.6 0-6.5 2.4-6.5 5.4S11.4 19.8 15 19.8c.7 0 1.4-.1 2-.3l2.5 1.2-.6-2c1.3-1 2.1-2.3 2.1-3.7C21 11.4 18.6 9 15 9z"/></svg>
    case 'spark':
      return <svg {...props}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>
    case 'bell':
      return <svg {...props}><path d="M6 17h12l-1.5-2V11a4.5 4.5 0 0 0-9 0v4z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
    case 'check':
      return <svg {...props}><path d="M5 12l4 4 10-10"/></svg>
    case 'x':
      return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>
    case 'clock':
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
    case 'tag':
      return <svg {...props}><path d="M3 13l8-8h8v8l-8 8z"/><circle cx="15" cy="9" r="1.2" fill={stroke}/></svg>
    case 'flame':
      return <svg {...props}><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4-1-3 1-5 3-6z"/></svg>
    case 'settings':
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    default:
      return null
  }
}
