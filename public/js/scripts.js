const generateButton = $('.generate-palette');
let projects = []

$(document).ready(() => {
  fetch('http://localhost:3000/folders')
    .then(response => response.json())
    .then(result => displayProjects(result.folders))
})

const displayProjects = (folders) => {
  if(folders.length) {
    folders.forEach(folder => {
      projects.push(folder);
      $('.project-list').append(
        `<article class=${folder.name} id=${folder.id}>
          <h4>${folder.name}</h4>
          <section></section>
         </article>`
      )
      $('select').append(
        `<option value=${folder}>
          ${folder}
        </option>`  
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
      <section></section>
     </article>`
  )
  $('select').append(
    `<option value=${$('.project-name').val()}>
      ${$('.project-name').val()}
    </option>`
  )
  project = {
    "name": $('.project-name').val(),
    "id": Date.now(),
    "palettes": {}
  }
  projects.push(project)
  fetch('http://localhost:3000/newFolder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(project)
  }).then(response => console.log(response))
  $('.project-name').val('');
}

$('.create').on('click', createProject);

const savePalette = function() {
  event.preventDefault();
  const paletteName = $('.palette-name').val();
  const colors = grabText();
  sendPaletteToProject(paletteName, colors);
  $('.color-palette .color').clone().prependTo(`.project-list .${$('select').val()} section`);
  $(`.project-list .${$('select').val()} section`).prepend(`<p>${paletteName}<p>`);
}

const sendPaletteToProject = (name, colors) => {
  const folder = projects.find(
    project => project.name === $('select').val())
  fetch(`http://localhost:3000/folders/${folder.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ [name]: colors })
  }).then(response =>  console.log(response))
    .catch(error => console.log(error))
}

const grabText = () => {
  const colorCodes = []
  $('.color h3').each((index, h3) => {
    colorCodes.push(h3.innerText);
  })
  return colorCodes;
}

$('.save-palette').on('click', savePalette);
