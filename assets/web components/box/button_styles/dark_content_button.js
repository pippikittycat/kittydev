import {createComponent} from 'https://codepen.io/pippikittycat/pen/MYbbYzB.js'

import styles from "https://codepen.io/pippikittycat/pen/KwNgxXZ.css" with {type: "css"};

createComponent({
  tagName: 'dark-content-box',
  attributes: ['text', 'svg', 'url-link'],
  stylesheet: styles,
  render: ({text, urlLink, svg}) => {return `
    <div>
    ${urlLink ? `<a href="${urlLink}" class="no-text-decoration fit-content flex row irish-coffee-bg rounded-corners large-padding soft-pillow arial-nova svg-gap dark-button">` : ''}
${svg ? `${svg}` : ''}
${text ? `<p>${text}</p>` : ''}
</a>
</div>
  `},
  error: ({text, svg}) => {
    if ((!text || text == undefined) && (!svg || svg == undefined))
    {
      console.error(`Error: text is ${text}, svg is ${svg}. One needs to be populated in order to render.`)
    }
  },
});