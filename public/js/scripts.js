const generateButton = $('.generate-palette');
let projects = []

$(document).ready(() => {
  fetch('http://localhost:3000/api/v1/folders')
    .then(response => response.json())
    .then(result => displayProjects(result))
})

const displayProjects = (folders) => {
  if(folders.length) {
    folders.forEach(folder => {
      projects.push(folder);
      $('.project-list').append(
        `<section class=${folder.name} id=${folder.project_id}>
          <h4>${folder.name}</h4>
          <section></section>
         </section>`
      )
      $('select').append(
        `<option value=${folder.name}>
          ${folder.name}
        </option>`  
      )
    })
    fetchPalettes()
  }
}

const fetchPalettes = () => {
  return fetch('http://localhost:3000/api/v1/palettes')
    .then(response => response.json())
    .then(palettes => displayProjectPalettes(palettes))
}

const displayProjectPalettes = (palettes) => {
  console.log(palettes)
  palettes.forEach(palette => {
    createPaletteArticle(palette.project_id, palette.name);
    const palettePath = `.project-list #${palette.project_id} .${palette.name}`;
    console.log(palettePath)
    Object.keys(palette).reduce((colors, prop) => {
      if(prop.includes('color')) {
        colors.push(palette[prop])
      }
      return colors
    }, []).forEach((color, index) => {
      $(palettePath).prepend(
        `<div class=${index}>
          </div>`)
      $(`${palettePath} .${index}`).css('background-color', color)
    })
    $(palettePath).prepend(`<p>${palette.name}</p>`);
  })
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
    $(`.color-palette .color${i + reasignPrevention}`).css('background-color', color);
    $(`.color-palette .color${i + reasignPrevention}`).children('h3').html(color);
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
    `<section class=${$('.project-name').val()}>
      <h4>${$('.project-name').val()}</h4>
      <section class="project-palettes"></section>
     </section>`
  )
  $('select').append(
    `<option value=${$('.project-name').val()}>
      ${$('.project-name').val()}
    </option>`
  )
  project = {
    "name": $('.project-name').val(),
    "project_id": Date.now(),
  }
  projects.push(project)
  fetch('http://localhost:3000/api/v1/newFolder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(project)
  }).then(response => console.log(response))
  $('.project-name').val('');
}

$('.create').on('click', createProject);

const createPaletteArticle = (project_id, paletteName) => {
  $(`.project-list #${project_id} section`)
    .prepend(`<article class=${paletteName}></article>`)
}

const savePalette = function() {
  event.preventDefault();
  const currentFolder = $('select').val()
  const paletteName = $('.palette-name').val();
  createPaletteArticle(currentFolder, paletteName)
  $('.color-palette .color').clone().prependTo(
    `.project-list .${currentFolder} .${paletteName}`);
  $(`.project-list .${currentFolder} .${paletteName}`).prepend(`<p>${paletteName}</p>`);
  const colors = grabText(paletteName);
  sendPaletteToProject(paletteName, colors, selectProject());
}

const selectProject = () => {
  return projects.find(project => {
    return project.name === $('select').val();
  }).project_id
}

const sendPaletteToProject = (name, colors, project_id) => {
  const folder = projects.find(
    project => project.name === $('select').val())
  const palette = {
    name,
    project_id,
    color1: colors[0],
    color2: colors[1],
    color3: colors[2],
    color4: colors[3],
    color5: colors[4]
  }
  fetch(`http://localhost:3000/api/v1/folders/${project_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(palette)
  }).then(response =>  console.log(response))
    .catch(error => console.log(error))
}

const grabText = (paletteName) => {
  const colorCodes = []
  $(`.project-list .${paletteName} h3`).each((index, h3) => {
    colorCodes.push(h3.innerText);
  })
  return colorCodes;
}

$('.save-palette').on('click', savePalette);
