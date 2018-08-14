const generateButton = $('.generate-palette');

$(document).ready(() => {
  fetch('http://localhost:3000/folders')
    .then(response => response.json())
    .then(result => displayProjects(result.folders))
})

const displayProjects = (folders) => {
  if(folders.length) {
    folders.forEach(folder => {
      $('.project-list').append(
        `<article class=${folder}>
          <h4>${folder}</h4>
          <ul></ul>
         </article>`
      )
    })
  }
}

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
  addLockOption();
})

const addLockOption = () => {
  $('.color-palette .color-lock').on('click', (e) => {
    const className = $(e.target).parent().attr('class');
    const colorContainer = $(e.target).parent();
    if(className.includes('lock')) {
      colorContainer.removeClass('lock')
      $(e.target).html('Lock')
    } else {
      colorContainer.addClass('lock')
      $(e.target).html('Unlock');
    }
  })
}

addLockOption();

const createProject = () => {
  $('.project-list').append(
    `<article class=${$('.project-name').val()}>
      <h4>${$('.project-name').val()}</h4>
      <ul></ul>
     </article>`
  )
  fetch('http://localhost:3000/newFolder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ "name": $('.project-name').val() })
  }).then(response => console.log(response))
  $('.project-name').val('');
}

$('.create').on('click', createProject);

const savePalette = function() {
  event.preventDefault();
  const colors = grabText();
  $('.color').clone().appendTo('.project-list article');
}

const grabText = () => {
  const colorCodes = []
  $('.color h3').each((index, h3) => {
    colorCodes.push(h3.innerText);
  })
  return colorCodes;
}

$('.save-palette').on('click', savePalette);
