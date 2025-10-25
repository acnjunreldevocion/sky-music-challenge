const ConnectionError = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-linear-to-r from-[#fd7f00] to-[#000ef5]">
      <div className="text-center text-white">
        <h2 className="text-2xl font-semibold mb-2">⚠️ Unable to load albums</h2>
        <p className="text-sm text-gray-300">
          Please check your connection or try again later.
        </p>
      </div>
    </main>
  )
}

export default ConnectionError