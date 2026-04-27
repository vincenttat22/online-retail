interface CVMemberPillProps {
  small?: boolean
}

export default function CVMemberPill({ small }: CVMemberPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold tracking-wide ${small ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'}`}
      style={{
        background: 'var(--cv-gold-soft)',
        color: 'var(--cv-gold)',
        border: '0.5px solid color-mix(in srgb, var(--cv-gold) 20%, transparent)',
      }}
    >
      <span
        className="w-1 h-1 rounded-full shrink-0"
        style={{ background: 'var(--cv-gold)' }}
      />
      会员价
    </span>
  )
}
