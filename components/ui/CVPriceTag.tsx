interface CVPriceTagProps {
  price: number
  disc?: number
  large?: boolean
}

export default function CVPriceTag({ price, disc = 0, large }: CVPriceTagProps) {
  const final = disc ? Math.round(price * (100 - disc)) / 100 : price
  return (
    <div className="flex items-baseline gap-1.5">
      <span
        className={`font-sans font-bold tracking-tight text-[20px]`}
        style={{ color: 'var(--cv-ink)', letterSpacing: '-0.3px' }}
      >
        <span className='text-[20px]'>$</span>
        {final}
      </span>
      {disc > 0 && (
        <span
          className={`font-sans line-through text-[20px]`}
          style={{ color: 'var(--cv-ink-muted)', textDecorationThickness: '1px' }}
        >
          ${price}
        </span>
      )}
    </div>
  )
}
