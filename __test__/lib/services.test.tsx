import { fetchJSON } from '@/lib/services'

describe('lib/services', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('fetchJSON returns parsed JSON on success', async () => {
    const mockData = { hello: 'world' }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    }) as unknown as typeof fetch

    const res = await fetchJSON('/some-url')
    expect(res).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledWith('/some-url', expect.any(Object))
  })

  it('fetchJSON returns null on non-ok response and logs error', async () => {
    const mockError = jest.spyOn(console, 'error').mockImplementation(() => { })

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    }) as unknown as typeof fetch

    const res = await fetchJSON('/bad')
    expect(res).toBeNull()
    expect(global.fetch).toHaveBeenCalledWith('/bad', expect.any(Object))
    expect(mockError).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching data from /bad:'),
      expect.any(Error)
    )

    mockError.mockRestore()
  })

  it('fetchJSON returns null when fetch throws an error', async () => {
    const mockError = jest.spyOn(console, 'error').mockImplementation(() => { })

    global.fetch = jest.fn().mockRejectedValue(new Error('Network error')) as unknown as typeof fetch

    const res = await fetchJSON('/network-error')
    expect(res).toBeNull()
    expect(global.fetch).toHaveBeenCalledWith('/network-error', expect.any(Object))
    expect(mockError).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching data from /network-error:'),
      expect.any(Error)
    )

    mockError.mockRestore()
  })
})
