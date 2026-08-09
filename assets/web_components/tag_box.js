import { createComponent } from './factory_code.js'

/* FIXED: This uses CSS module assertions, which can cause browsers like Firefox/standard dev setups to crash on this line
and half the file exe before createComponent can run. Should already be loaded in HTML header anyways
import styles from '../global.css' with { type: 'css' };*/

// Declared once in memory, shared across all <tag-box> instances
const VARIANT_MAP = {
  light: 'bg-primary text-primary',
  dark: 'bg-accent text-accent',
  penumbra: 'bg-secondary text-secondary',
  status: 'mistletoe-bg text-status bg-alpha-25'
};

createComponent({
  tagName: 'tag-box',
  attributes: ['text', 'svg', 'variant'],
  render: ({text, svg, variant}) => {
    // Shared utility classes used by all boxes
    const baseUtilities = 'fit-content flex row items-center circle-corners arial-nova gap-xs py-2xs px-xs';

    // Fallback to 'light' if variant is missing or unrecognized
    const colorUtilities = VARIANT_MAP[variant] || VARIANT_MAP.light;
    
    return `
    <div class="${baseUtilities} ${colorUtilities}">
    ${svg ? `${svg}` : ''}
    ${text ? `<p>${text}</p>` : ''}
    </div>
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
      `Error: Both 'text' and 'svg' are missing or empty. At least one must be provided to render <tag-box>.`
      );
    }
  },
});