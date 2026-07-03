export default function initAboutGallery() {
  const viewport = document.querySelector('[data-gallery-viewport]')
  const track = document.querySelector('[data-gallery-track]')
  const prevButton = document.querySelector('[data-gallery-prev]')
  const nextButton = document.querySelector('[data-gallery-next]')

  if (!viewport || !track || !prevButton || !nextButton) return
  if (track.dataset.initialized === 'true') return

  const originalCards = Array.from(track.children)
  if (originalCards.length === 0) return

  track.dataset.initialized = 'true'

  const cards = () => Array.from(track.children)
  const originalCount = originalCards.length
  const createDuplicateSet = () =>
    originalCards.map((card) => {
      const clone = card.cloneNode(true)
      clone.setAttribute('data-duplicate', 'true')
      return clone
    })

  track.replaceChildren(
    ...createDuplicateSet(),
    ...originalCards,
    ...createDuplicateSet(),
  )

  let currentIndex = originalCount
  let isAnimating = false

  const getStep = () => {
    const currentCards = cards()
    if (currentCards.length < 2) return 0
    const firstCard = currentCards[0]
    const secondCard = currentCards[1]
    const firstRect = firstCard.getBoundingClientRect()
    const secondRect = secondCard.getBoundingClientRect()
    return secondRect.left - firstRect.left
  }

  const applyPosition = (animate) => {
    const step = getStep()
    track.style.transition = animate ? 'transform 0.45s ease' : 'none'
    track.style.transform = `translateX(${-currentIndex * step}px)`
  }

  const move = (direction) => {
    if (isAnimating) return
    isAnimating = true
    currentIndex += direction
    applyPosition(true)
  }

  prevButton.addEventListener('click', () => move(-1))
  nextButton.addEventListener('click', () => move(1))

  track.addEventListener('click', (event) => {
    const card = event.target.closest('.about-gallery-card')
    if (!card) return

    const cardId = card.getAttribute('data-card-id')
    if (!cardId) return

    const willFlip = !card.classList.contains('is-flipped')
    for (const sameCard of track.querySelectorAll(`[data-card-id="${cardId}"]`)) {
      sameCard.classList.toggle('is-flipped', willFlip)
    }
  })

  track.addEventListener('transitionend', () => {
    if (currentIndex < originalCount) {
      currentIndex += originalCount
      applyPosition(false)
    } else if (currentIndex >= originalCount * 2) {
      currentIndex -= originalCount
      applyPosition(false)
    }
    isAnimating = false
  })

  let resizeFrame = 0
  const handleResize = () => {
    cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(() => applyPosition(false))
  }

  window.addEventListener('resize', handleResize)
  applyPosition(false)
}
