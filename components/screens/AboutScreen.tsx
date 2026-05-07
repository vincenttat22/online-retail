'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import CVIcon from '@/components/ui/CVIcon'

const SOCIAL_LINKS = [
  {
    platform: '小红书·RedNote',
    handle: '@766045814',
    desc: '生活方式·选品笔记',
    badgeBg: '#fe2c55',
    badgeText: '红',
    href: '#',
  },
  {
    platform: '商务合作',
    handle: 'admin@cvco.shop',
    desc: '品牌·批发·分销',
    badgeBg: 'var(--cv-accent)',
    badgeText: '@',
    href: 'mailto:admin@cvco.shop',
  },
]

export default function AboutScreen() {
  const { theme } = useTheme()
  const [idQrError, setIdQrError] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('carmenvanness')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="pb-28 md:pb-0 animate-cv-fade md:px-6 xl:px-10 md:py-6 xl:py-9">
      <div className="max-w-2xl mx-auto">

      {/* ── HEADER ── */}
      <div className="px-4 md:px-0 pt-14 md:pt-0 pb-3.5 md:pb-6 flex items-center gap-2.5 md:block">
        <Link href="/" className="md:hidden w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: theme.surface, color: theme.ink }}>
          <CVIcon name="chev-l" size={16} />
        </Link>
        <div>
          <div className="font-mono text-[10px] tracking-[2px]" style={{ color: theme.inkMuted }}>ABOUT · 关于</div>
          <h1 className="m-0 font-serif font-black tracking-tight text-[22px] md:text-[32px] xl:text-[44px]" style={{ color: theme.ink, letterSpacing: 'clamp(-0.3px, -0.05em, -1px)' }}>
            关于我们
          </h1>
        </div>
      </div>

      {/* ── CONNECT SECTION ── */}
      <div className="px-4 md:px-0 mt-2 md:mt-3">
        <div className="font-mono text-[10px] tracking-[2px] mb-2" style={{ color: theme.inkMuted }}>
          CONNECT · 联系我们
        </div>
        <div className="font-serif font-extrabold text-[20px] md:text-[24px] xl:text-[28px] mb-4 md:mb-5" style={{ color: theme.ink }}>
          加入·一起逛
        </div>

        {/* WeChat ID Card */}
          <div
            className="rounded-[20px] md:rounded-[22px] p-5 md:p-6 xl:p-7 flex flex-col gap-3.5"
            style={{ background: theme.surface, border: `0.5px solid ${theme.line}` }}
          >
            <div className="font-mono text-[10px] tracking-widest" style={{ color: theme.inkMuted }}>
              WECHAT ID · 微信号
            </div>
            <div className="font-serif font-extrabold text-[18px] leading-snug" style={{ color: theme.ink }}>
              一对一咨询
            </div>
            <span
              className="self-start px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: '#e6f9ee', color: '#07c160' }}
            >
              客服回复
            </span>
            <div className="flex justify-center">
              {!idQrError ? (
                <div className="relative w-[220px] h-[220px]">
                  <Image
                    src="/IMG_0549.jpeg"
                    alt="微信号二维码"
                    fill
                    className="object-contain rounded-xl"
                    onError={() => setIdQrError(true)}
                  />
                </div>
              ) : (
                <div
                  className="w-[220px] h-[220px] rounded-xl flex items-center justify-center"
                  style={{ background: theme.bg, border: `1px dashed ${theme.line}` }}
                >
                  <span className="font-mono text-[10px] text-center leading-relaxed px-3" style={{ color: theme.inkMuted }}>
                    扫码图片<br />即将上线
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-2.5">
              <span className="font-mono text-[13px]" style={{ color: theme.inkSoft }}>
                长按复制: carmenvanness
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer border-0"
                style={{
                  background: copied ? '#e6f9ee' : theme.surface,
                  color: copied ? '#07c160' : theme.ink,
                  border: `0.5px solid ${copied ? '#07c160' : theme.line}`,
                }}
              >
                <CVIcon name={copied ? 'check' : 'wechat'} size={14} stroke="currentColor" />
                {copied ? '已复制 ✓' : '复制微信号'}
              </button>
            </div>
          </div>
      </div>

      {/* ── FOLLOW SECTION ── */}
      <div className="px-4 md:px-0 mt-8 md:mt-10 xl:mt-12">
        <div className="font-mono text-[10px] tracking-[2px] mb-3" style={{ color: theme.inkMuted }}>
          FOLLOW · 在别处找到我们
        </div>
        <div
          className="rounded-[20px] md:rounded-[22px] overflow-hidden px-4 md:px-5 xl:px-6"
          style={{ background: theme.surface, border: `0.5px solid ${theme.line}` }}
        >
          {SOCIAL_LINKS.map((item, i) => (
            <a
              key={item.platform}
              href={item.href}
              className="flex items-center gap-3.5 py-4 transition-opacity active:opacity-70"
              style={{
                borderBottom: i < SOCIAL_LINKS.length - 1 ? `0.5px solid ${theme.line}` : 'none',
                textDecoration: 'none',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[13px] font-bold"
                style={{ background: item.badgeBg }}
              >
                {item.badgeText}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: theme.ink }}>
                  {item.platform}
                  <span className="font-normal ml-1.5 text-[12px]" style={{ color: theme.inkSoft }}>
                    {item.handle}
                  </span>
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: theme.inkMuted }}>{item.desc}</div>
              </div>
              <CVIcon name="chev-r" size={15} stroke={theme.inkMuted} />
            </a>
          ))}
        </div>
      </div>

      </div>
    </div>
  )
}
