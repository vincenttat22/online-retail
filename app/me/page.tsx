import CVTabBar from '@/components/ui/CVTabBar'
import SettingsPanel from '@/components/ui/SettingsPanel'

export default function MePage() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center pb-28 px-6 text-center">
        <div className="font-mono text-[10px] tracking-[2px] mb-2" style={{ color: 'var(--cv-ink-muted)' }}>
          MY ACCOUNT · 我的
        </div>
        <div className="font-serif text-2xl font-bold mb-3" style={{ color: 'var(--cv-ink)' }}>
          即将开放
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--cv-ink-soft)' }}>
          会员中心正在建设中<br />
          请添加微信客服提前登记
        </p>
      </div>
      <CVTabBar />
      <SettingsPanel />
    </>
  )
}
