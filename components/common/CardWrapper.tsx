const CardWrapper = ({ children, idx }: { children: React.ReactNode, idx: number }) => (
  <div
    key={idx}
    className="min-w-[170px] max-w-[170px] snap-start"
  >
    {children}
  </div>
)

export default CardWrapper