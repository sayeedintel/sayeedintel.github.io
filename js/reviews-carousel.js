/* Reviews carousel — arrow buttons scroll the hardcoded review cards
   left/right. No data fetching here; the reviews themselves live directly
   in index.html. */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('reviewsTrack');
  const left = document.getElementById('reviewsArrowLeft');
  const right = document.getElementById('reviewsArrowRight');
  if (!track || !left || !right) return;

  const scrollByCard = (direction) => {
    const card = track.querySelector('.review-card');
    const gap = 24;
    const distance = card ? card.getBoundingClientRect().width + gap : 320;
    track.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  left.addEventListener('click', () => scrollByCard(-1));
  right.addEventListener('click', () => scrollByCard(1));
});
