import { createComponent } from './factory_code.js'

/* FIXED: This uses CSS module assertions, which can cause browsers like Firefox/standard dev setups to crash on this line
and half the file exe before createComponent can run. Should already be loaded in HTML header anyways
import styles from '../global.css' with { type: 'css' };*/

// Declared once in memory, shared across all <tag-box> instances
const VARIANT_MAP = {
  light: 'bg-primary text-tertiary lborder',
  dark: 'bg-tertiary text-highlight dborder'
};

createComponent({
  tagName: 'content-box',
  attributes: ['text', 'svg', 'url-link', 'variant'],
  render: ({ text, urlLink, svg, variant }) => {
    // Shared utility classes used by all boxes
    const baseUtilities = 'fit-content flex row bevel-corners small-text arial-nova py-xs px-lg gap-sm';

    // Url link classes (typically same)
    const urlUtilities = 'no-text-decoration block fit-content';
    
    // Fallback to 'light' if variant is missing or unrecognized
    const colorUtilities = VARIANT_MAP[variant] || VARIANT_MAP.light;

    return `
    ${urlLink ? `<a class="${urlUtilities}" href="${urlLink}">` : ''}
      <div class="${baseUtilities} ${colorUtilities}">
      ${svg ? `${svg}` : ''}
      ${text ? `<p>${text}</p>` : ''}
      </div>
    ${urlLink ? '</a>' : ''}
  `;
},
  error: ({ text, svg }) => {
  // Check if text is missing, null, undefined, or just empty whitespace
  // Safely coerce to string before trimming to avoid type errors
  const isTextMissing = !text || String(text).trim() === '';
  const isSvgMissing = !svg || String(svg).trim() === '';

  // Trigger error ONLY if BOTH are missing
  if (isTextMissing && isSvgMissing) {
    console.error(
      `Error: Both 'text' and 'svg' are missing or empty. At least one must be provided to render <content-box>.`
      );
    }
  },
});