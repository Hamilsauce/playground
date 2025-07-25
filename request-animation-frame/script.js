const element = document.querySelector('#box');
let start, previousTimeStamp;
let done = false;
let modifier = 1
function step(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start;

  if (previousTimeStamp !== timestamp) {
    // Math.min() is used here to make sure the element stops at exactly 200px
    const count = Math.min(0.1 * elapsed, 200) * modifier;
    element.style.transform = `translateX(${count}px)`;
    // if (count === 200) done = true;
  }

  if (elapsed < 2000) {
    // Stop the animation after 2 seconds
    previousTimeStamp = timestamp;
    if (!done) {
      modifier = 1

      window.requestAnimationFrame(step);
    }
    else {
     modifier = -1
 window.requestAnimationFrame(step);

    }
  }
}

window.requestAnimationFrame(step);