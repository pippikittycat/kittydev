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
    updateTarget, // Optional targeted update hook: (shadowRoot, name, newValue, attrs) => void
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
                this._isMounted = false;
            }

            connectedCallback() {
                // 1. Initial full render on mounnt
                if (!this._isMounted) {
                    const attrs = this._getParsedAttributes();

                    if (typeof error === 'function') {
                        error(attrs);
                    }

                    // Render initial HTML structure
                    this.shadowRoot.innerHTML = render(attrs);
                    this._isMounted = true;

                    // Apply any attributes that were set before connected Callback
                    attributes.forEach(attr => {
                        const val = this.getAttribute(attr);
                        if (val !== null) {
                            this._applyUpdate(attr, val, attrs);
                        }
                    });
                }

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
                // Only run targeted updated IF the element is already mounted
                if (this._isMounted && oldValue !== newValue){
                    const attrs = this._getParsedAttributes();

                    if (typeof error === 'function') {
                        error(attrs);
                    }
                    
                    this._applyUpdate(name, newValue, attrs);
                }
            }

            _applyUpdate(name, newValue, attrs) {
                if (typeof updateTarget === 'function') {
                    updateTarget(this.shadowRoot, name, newValue, attrs);
                } else {
                    this._patchDOM(name, newValue, attrs);
                }
            }

            _getParsedAttributes() {
                return Object.fromEntries(
                    attributes.map(attr => [
                        attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
                        this.getAttribute(attr) ?? ''
                    ])
                );
            }

            // Lightweight fallback patch: updates attributes, input values, or text content
            _patchDOM(attrName, newValue, attrs) {
                const camelName = attrName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

                //Target elements explicitly marked for this attribute
                const boundElements = this.shadowRoot.querySelectorAll(`[data-bind="${attrName}"], [data-bind="${camelName}"], [data-bind*="${attrName}"]`);

                boundElements.forEach(el => {
                    // Check if binding species an explicit target property (data-bind="src:imageUrl" or similar)
                    const bindAttr = el.getAttribute('data-bind') || '';
    
                    if (bindAttr.includes(':')) {
                        // Handles explicit mappings like data-bind="src: imageUrl" or data-bind="class: activeClass"
                    const [targetProp] = bindAttr.split(':').map(s => s.trim());
                    if (targetProp in el) {
                        el[targetProp] = newValue;
                    } else {
                        el.setAttribute(targetProp, newValue);
                    }
                    return;
                    }

                    // Standard auto detection for Inputs vs Text vs Common Attributes
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        if (el.value !== newValue) el.value = newValue;
                    } else if (el.tagName === 'IMG' && (attrName === 'src' || attrName === 'alt')) {
                        el.setAttribute(attrName, newValue);
                    } else if (el.tagName === 'A' && attrName === 'href') {
                        el.setAttribute('href', newValue);
                    } else {
                        el.textContent = newValue;
                    }
                });
            }
        }
    );
}