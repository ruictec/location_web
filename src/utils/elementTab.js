export function resolveElTab(tab) {
  if (!tab || typeof tab !== 'object') {
    return { name: '', index: '' }
  }
  const name = tab.paneName ?? tab.props?.name ?? tab.name ?? ''
  const index =
    tab.index != null && tab.index !== ''
      ? String(tab.index)
      : name === 'first'
        ? '0'
        : name === 'second'
          ? '1'
          : String(name)
  return { name, index }
}
