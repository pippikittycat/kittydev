# Personal Portfolio Website

Hi!
This is my modular website, featuring a custom web-components framework, built to showcase my portfolio, professional experience, and blogs!

## Features & Architecture

- **Custom Web Component Creation:** Creation of a factory code script allows one to skip boilerplate code entirely and create theme-aware buttons and tag boxes (Light, Dark, and Penumbra variants).
- **Centralized Asset Management:** Dedicated asset pipeline managing global typography, design tokens, responsive background generation scripts, and a custom SVG icon library.
- **Multi-Page Layout:** Clean routing structures prepared for the Home page, Professional Experience, Portfolio pieces, and technical Blog posts.

## Tech Stack

- **Frontend:** Semantic HTML5, Vanilla JavaScript (ES6+)
- **Styling:** Custom CSS3 with global design variables
- **Icons:** Optimized SVG vectors

## Repository Structure As Of: `August 9, 2026`

```text
├── assets/                                  # Overall asset folder
│   ├── web components/                      # Custom reusable UI elements
│   │   ├── tag_box.js
│   │   ├── content_box.js
│   │   ├── description_content_box.js
│   │   └── factory_script.js                # Web component boilerplate code template
│   ├── svg library/                         # General SVG library 
│   │   ├── circle-fill.svg
│   │   ├── envelope.svg
│   │   ├── github.svg
│   │   ├── grid.svg
│   │   ├── linkedin.svg
│   │   ├── pencil.svg
│   │   ├── rocket-takeoff.svg
│   │   └── envelope-fill.svg
│   ├── global.css                          # Site-wide typography and color variables
│   ├── import_script.js                    # Imports all scripts into a single file for HTML ease
│   ├── theme_toggle.js                     # Enables theme toggling from light to dark mode
│   └── background_generation_script.js     # Dynamic background effects
├── blogs_page/
│   └── index.html
├── experience_page/
│   └── index.html
├── portfolio_page/
│   └── index.html
├── stylesheet_page/                        # Visual guide to color palette/fonts
│   └── index.html
├── index.html                              # Home page
├── CNAME                                   # Custom domain
└── README.md                               # Project documentation
```

## Roadmap

- [x] ~~Connect custom web components to core HTML layout.~~
- [x] ~~Implement dark/light theme switching functionality.~~
- [ ] **IN PROGRESS:** Set up a CSS grid framework (with media breakpoints) for a responsive website layout between desktops, tablets, and phones.
- [ ] **IN PROGRESS:** Make website accessible for users that complies with WCAG 2.1 AA and/or WCAG 2.2 AAA.
- [ ] Populate each page with their respective content.
- [ ] Create a backend for storing blog posts that can be edited, created, and deleted only by me.
