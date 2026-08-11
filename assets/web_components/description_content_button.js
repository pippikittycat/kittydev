import { createComponent } from './factory_code.js'

/* FIXED: This uses CSS module assertions, which can cause browsers like Firefox/standard dev setups to crash on this line
and half the file exe before createComponent can run. Should already be loaded in HTML header anyways
import styles from '../global.css' with { type: 'css' };*/

// FIXED: Unecessary variant maps. This component is unlikely to need multiple variants ever- maybe for what the content is, but that can be a future project
// I am going to hard code all the values for now. Subject to change for later
// However, since this is a link-button use case, the dependency on having a URL link will stay

createComponent({
    tagName: 'desc-button',
    attributes: ['title', 'description', 'left-svg', 'right-svg', 'url-link'],
    render: ({ title, description, urlLink, leftSvg, rightSvg }) => {

        const content = `
        <div class="ldescbtn-bgc flex rounded-corners ldescbtn-brc">
            <div class="p-lg gap-lg flex column">
                <div class="flex row space-between">
                ${leftSvg ? `
        <svg class="icon ldescbtn-left-sc" aria-hidden="true">
          <use href="${leftSvg}"></use>
        </svg>
      ` : ''}
                ${rightSvg ? `
        <svg class="icon ldescbtn-right-sc" aria-hidden="true">
          <use href="${rightSvg}"></use>
        </svg>
      ` : ''}
                </div>
                <div class="flex column gap-2xs">
                ${title ? `<p class="arial-nova ldescbtn-title-tc medium-text">${title}</p>` : ''}
                ${description ? `<p class="arial-nova ldescbtn-desc-tc">${description}</p>` : ''}
                </div>
            </div>
        </div>
    `;

        return urlLink
            ? `<a class="no-text-decoration" href="${urlLink}">${content}</a>`
            : content;
    }
});
/*
// Shared utility classes
const boxBaseUtilities = 'fit-content flex row rounded-corners  space-between p-lg';
const urlUtilities = ' block fit-content';

const content = `
    <div class="${boxBaseUtilities} ${boxColorUtilities}">
        <div class="flex row items-center gap-md">
            ${leftSvg ? `<div>${leftSvg}</div>` : ''}
            <div class="flex column">
                ${title ? `<p class="${textBaseUtilities} ${titleColorUtilities}">${title}</p>` : ''}
                ${description ? `<p class="${textBaseUtilities} ${descColorUtilities}">${description}</p>` : ''}
            </div>
        </div>
        ${rightSvg ? `<div class="flex items-center">${rightSvg}</div>` : ''}
    </div>
`;*/