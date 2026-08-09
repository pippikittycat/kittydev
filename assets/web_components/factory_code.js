//reusable factory function that generates a web component from just a tag name, HTML string, and an optional CSS string
//import it into any file to define a component without needing to write boilerplate code
//accepts single options object so arguments can be skipped or added without breaking existing calls

export function createComponent({
    tagName, // the HTML tag name (must contain hyphen if multiple words)
    attributes = [], // list of HTML attributes to watch for changes, defaults to empty array if none are needed
    stylesheet = null, //adoptedStyleSheets = shared CSSStyleSheet object, parsed once and reused across all instances
    css = '', // fallback inline css string, used when there is no external stylesheet
    render, // (attrs) -> HTML string (only thing actually written per component)
    error,
}) {
    customElements.define(
        tagName,
        //anonymous class (no name needed since customElements.define registers it under tagName)
        class extends HTMLElement {

            //tells browser which attributes to watch (without this, attributeChangedCallback will never fire)
            static get observedAttributes() {
                return attributes;
            }

            constructor() {
                super(); //always required first, sets up HTMLElement internals
                this.attachShadow({mode: 'open'}); // 'open means external JS can still access shadowRoot, 'closed' would block it

                //only attach stylesheet if one was provided (avoids overwriting the default empty adoptedStyleSheets)
                if(stylesheet) {
                    this.shadowRoot.adoptedStyleSheets = [stylesheet];
                }
            }

            // fires when element is inserted into the page, safe to render here because DOM is ready
            // note: NOT called when the element is CREATED, only when it's actually ADDED to the document
            // FIXED: Fixed typo missing 'ed'
            connectedCallback(){
                this._update();
            }

            //fires whenever a watched attribute changes (the if guard avoids re-rendering when the value didn't actually change)
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue !== newValue) this._update();
            }
            
            _update(){
                 // build a plain object of { attrName: value } from observed attributes
                // .map() produces an array of pairs, Object.fromEntries() converts those pairs into a plain object
                const attrs = Object.fromEntries(
                    attributes.map(attr => {
                      let attrValue = this.getAttribute(attr);
                      
                      if (!error) {
                        attrValue = attrValue ?? ''
                      }
                      
                      return [ // for each attribute, produce a [key, value] pair
                        // convert kebab-case to camelCase so the render function can destructure cleanly
                        // e.g. 'image-url' becomes 'imageUrl'
                        attr.replace(/-([a-z])/g, (_,c) => c.toUpperCase()), //replace the - with _ (which is not rendered) and make the letter after - Uppercase, and do this to every single match
                        attrValue //make the attribute value able to be read by web component
                        // read the attribute's current value off the element
                        // ?? '' means: if getAttribute returns null (attribute not set), use empty string instead
                        // prevents "null" or "undefined" from appearing as text in the rendered HTML
                      ];
                    })
                );
                
                if (error) error(attrs);
              
                // rewrite the entire shadow DOM on every update
                // the css ternary only injects a <style> tag if inline css was provided — avoids an empty <style> tag
                // render(attrs) calls the user-supplied function and injects the returned HTML string
                // Injects global.css so Shadow DOM inherits all utility classes
                this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="/assets/global.css">
                ${css ? `<style>${css}</style>` : ''}
                ${render(attrs)}
                `;
            }
        }
    );

}