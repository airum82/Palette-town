const generateButton = $('.generate-palette');


const addColors = () => {
  let color = '#';
  const lockedColors = $('.lock').length;
  const letters = '0123456789ABCDEF';
  for(let i = 0; i < 6 - lockedColors; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color
}

const createPalette = () => {
  for(let i = 1; i < 6; i++) {
    $('.color-palette').append(
      `<div class=${'color' + i}>
        <h3></h3>
        <button class="color-lock">Lock</button>
      </div>`
    );
    const color = addColors();
    $(`.color${i}`).css('background-color', color);
    $(`.color${i}`).children('h3').html(color);
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

// const gatherLockedColors = () => {
//   let lockedColors = [];
//   $('.lock').each(div => {
//     lockedColors.push(div.children('h3').innerText())
//   })
//   console.log(lockedColors);
// }
