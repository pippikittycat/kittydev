// Fetch global CSS stylesheet once and share across all ShadowDOM roots
let globalStyleSheet = null;

const globalStyleSheetPromise = fetch('./assets/global.css')
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
    })
    .then(cssText => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(cssText);
        globalStyleSheet = sheet; // Cache synchronously once parsed
        return sheet;
    })
    .catch(e => {
        console.error('Failed to load global.css into Shadow DOM stylesheet', e);
        return null;
    });

export function createComponent({
    tagName,
    attributes = [],
    render,
    error
}) {
    customElements.define(
        tagName,
        class extends HTMLElement {
            static get observedAttributes() {
                return attributes;
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
                // 1. Render HTML immediately (synchronously) on Frame 0
                this.update();

                // 2. Attach global CSS stylesheet when ready
                if (globalStyleSheet) {
                    this.shadowRoot.adoptedStyleSheets = [globalStyleSheet];
                } else {
                    globalStyleSheetPromise.then(sheet => {
                        if (sheet && this.isConnected) {
                            this.shadowRoot.adoptedStyleSheets = [sheet];
                        }
                    });
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (this.isConnected && oldValue !== newValue) {
                    this.update();
                }
            }

            update() {
                const attrs = Object.fromEntries(
                    attributes.map(attr => [
                        attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
                        this.getAttribute(attr) ?? ''
                    ])
                );

                if (typeof error === 'function') {
                    error(attrs);
                }

                // Pure HTML injection without blocking delays
                this.shadowRoot.innerHTML = render(attrs);
            }
        }
    );
}