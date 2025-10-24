const ScrollContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <div className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide pb-4 snap-x snap-mandatory">
      {children}
    </div>
  </div>
)

export default ScrollContainer