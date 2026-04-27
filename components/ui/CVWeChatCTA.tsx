import CVIcon from './CVIcon'

interface CVWeChatCTAProps {
  label?: string
  full?: boolean
}

export default function CVWeChatCTA({ label = '联系微信咨询', full }: CVWeChatCTAProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl font-semibold cursor-pointer ${full ? 'w-full justify-center text-[15px] px-4 py-3.5' : 'text-[13px] px-3.5 py-2.5'}`}
      style={{
        background: '#07c160',
        color: '#fff',
        border: 'none',
        boxShadow: '0 6px 16px rgba(7,193,96,0.25)',
      }}
    >
      <CVIcon name="wechat" size={full ? 18 : 15} stroke="#fff" sw={2} />
      {label}
    </button>
  )
}
