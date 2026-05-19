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

## Repository Structure As Of: `May 18, 2026`

```text
├── assets/                                  # Overall asset folder
│   ├── web components/                      # Custom reusable UI elements
│   │   ├── box/                             # Contains all box web components
│   │   │   ├── button styles/
│   │   │   │   ├── dark_content_button.js
│   │   │   │   └── light_content_button.js
│   │   ├── tag_box_styles
│   │   │   ├── dark_tag_box.js
│   │   │   ├── light_tag_box.js
│   │   │   └── penumbra_tag_box.js
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
│   ├── background_img.jpg
│   └── background_generation.js            # Dynamic background effects
├── blogs_page/
│   └── index.html
├── experience_page/
│   └── index.html
├── home_page/
│   └── index.html
├── portfolio_page/
│   └── index.html
├── stylesheet_page/
│   └── index.html
└── README.md                                # Project documentation
```

## Roadmap

- [ ] Connect custom web components to core HTML layout.
- [ ] Implement dark/light theme switching functionality.
- [ ] Populate each page with their respective content.
- [ ] Create a backend for storing blog posts that can be edited, created, and deleted only by me.
- [ ] Set up a CSS grid framework (with media breakpoints) for a responsive website layout between desktops, tablets, and phones.
- [ ] Make website accessible for users that complies with WCAG 2.1 AA and/or WCAG 2.2 AAA.
