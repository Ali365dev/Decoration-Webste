// Keyboard and screen reader support for the up/down reorder buttons.

const LIVE_ID = 'storefront-settings-live'

/** Says a short message to screen readers without moving focus. */
export const announce = message => {
  if (typeof document === 'undefined') return
  let region = document.getElementById(LIVE_ID)
  if (!region) {
    region = document.createElement('div')
    region.id = LIVE_ID
    region.setAttribute('aria-live', 'polite')
    region.setAttribute('role', 'status')
    Object.assign(region.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap'
    })
    document.body.appendChild(region)
  }
  region.textContent = ''
  window.setTimeout(() => {
    region.textContent = message
  }, 50)
}

/**
 * After a move, keeps focus on the moved item's move button. When that button is now disabled
 * (the item reached the top or bottom), focuses the other one instead of dropping focus.
 */
export const focusMoved = (group, index, direction) => {
  if (typeof window === 'undefined') return
  window.requestAnimationFrame(() => {
    const find = dir => document.querySelector(`[data-reorder="${group}:${index}:${dir}"]`)
    const same = find(direction)
    const other = find(direction === 'up' ? 'down' : 'up')
    const target = same && !same.disabled ? same : other
    if (target && !target.disabled) target.focus()
  })
}

export const moveProps = ({ group, index, count, name, direction, onMove }) => {
  const to = direction === 'up' ? index - 1 : index + 1

  return {
    'data-reorder': `${group}:${index}:${direction}`,
    'aria-label': `Move ${name} ${direction}`,
    disabled: direction === 'up' ? index === 0 : index === count - 1,
    onClick: () => {
      onMove(index, to)
      announce(`${name} moved to position ${to + 1} of ${count}`)
      focusMoved(group, to, direction)
    }
  }
}
