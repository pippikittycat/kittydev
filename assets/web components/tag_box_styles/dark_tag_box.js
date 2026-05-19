import {createComponent} from 'https://codepen.io/pippikittycat/pen/MYbbYzB.js'

import styles from "https://codepen.io/pippikittycat/pen/KwNgxXZ.css" with {type: "css"};

createComponent({
  tagName: 'dark-tag-box',
  attributes: ['text'],
  stylesheet: styles,

  render: ({text}) => `
    <div class="flex row medium-roast-bg fit-content circle-corners soft-pillow arial-nova">
  <p class="no-margin small-padding">${text}</p>
</div>
  `,
});