import {createComponent} from 'https://codepen.io/pippikittycat/pen/MYbbYzB.js'

import styles from "https://codepen.io/pippikittycat/pen/KwNgxXZ.css" with {type: "css"};

createComponent({
  tagName: 'light-tag-box',
  attributes: ['text'],
  stylesheet: styles,

  render: ({text}) => `
    <div class="flex row almond-bg fit-content circle-corners decreasing-brown arial-nova">
<p class="no-margin small-padding">${text}</p>
</div>
  `,
});