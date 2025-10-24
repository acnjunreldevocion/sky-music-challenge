const CardWrapper = ({ children, idx }: { children: React.ReactNode, idx: number }) => (
  <div
    key={idx}
    className="min-w-[170px] max-w-[170px] snap-start first:pl-4 last:pr-4"
  >
    {children}
  </div>
)

export default CardWrapper