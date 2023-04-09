window.onload = (e) => {
  window.onresize = (e) => {
    const svg = document.querySelector('svg');
    const { width, height, } = document.getBoundingClientRect()
    svg.width.baseVal.value = width;
    svg.height.baseVal.value = height;
    console.log('sex');
  }

}

    console.log('sex');
