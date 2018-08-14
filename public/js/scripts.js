const generateButton = $('.generate-palette');


const addColors = () => {
  let color = '#';
  const letters = '0123456789ABCDEF';
  for(let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color
}

const preventColorReasign = lockedColors => {
  if (lockedColors > 0) {
    return Date.now();
  }
  return 0;
}

const createPalette = () => {
  const lockedColors = $('.lock').length;
  for(let i = 1; i < 6 - lockedColors; i++) {
    const reasignPrevention = preventColorReasign(lockedColors)
    $('.color-palette').append(
      `<div class=color${i + reasignPrevention}>
        <h3></h3>
        <button class="color-lock">Lock</button>
      </div>`
    );
    const color = addColors();
    $(`.color${i + reasignPrevention}`).css('background-color', color);
    $(`.color${i + reasignPrevention}`).children('h3').html(color);
  }
  $('.color-palette div').addClass('color');
};

createPalette();

generateButton.on('click', () => {
  event.preventDefault();
  $('.color-palette').html($('.lock') || '');
  createPalette();
})

$('.color-palette .color-lock').on('click', (e) => {
  const className = $(e.target).parent().attr('class');
  const colorContainer = $(e.target).parent();
  if(className.includes('lock')) {
    colorContainer.removeClass('lock')
  } else {
    colorContainer.addClass('lock')
  }
  console.log($('.lock'))
})
