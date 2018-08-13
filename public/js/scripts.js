const addColors = () => {
  let color = '#';
  const letters = '0123456789ABCDEF';
  for(let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color
}

const createPalette = (() => {
  for(let i = 1; i < 6; i++) {
    $('.color-palette').append(
      `<div class=${'color' + i}>
        <h3></h3>
        <button>Lock</button>
      </div>`
    );
    const color = addColors();
    $(`.color${i}`).css('background-color', color);
    $(`.color${i}`).children('h3').html(color);
  }
  $('.color-palette div').addClass('color');
})();
