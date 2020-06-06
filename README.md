# airplaneBooking

Final project SAN 2019/20

Page is available at: https://mamucha.github.io/airplaneBooking/

**Commands:**
- `npm i`: install package
- `gulp`: start local server [localhost:3000](http://localhost:3000)


More information about the project:

- [BEM](#bem)
- [Media queries](#media-queries)
- [File structure](#file-structure)
- [Gulp](#gulp)

## BEM

[BEM methodology](https://en.bem.info) has been used in this project.

### Types of modifiers are used:

- Namespaces <br>
  Namespaces are used to add more scalability and maintainability to the code and to make it more self documented. There are few prefixed terms in use.

**Layouts**

```html
l-header, l-section
```

**Component**

```html
c-button, c-resulFlight, c-back
```

**Helper**

```html
h-active
```

- a boolean flag<br>
  Original block/element name + double dash + mod name<br>
  **.prefix-block--mod** or **.prefix=block\_\_elem--mod**
- a key/value pair<br>
  Original block/element name + double dash + mod key name + single underscore + mod value<br>
  **.prefix-block--key_value** or **.prefix-block\_\_elem--key_value**

For example:

```html
<section class="l-section l-section--result">...</section>
<button class="c-button c-button__search c-button__search--clear">...</button>
<div class="c-flightResult">...</div>
<div class="c-flightResult__title">...</div>
```

## Media queries

Inspired by Dominique Briggs' [solution](https://medium.com/front-end-developers/the-solution-to-media-queries-in-sass-5493ebe16844)

Example: <br>
\_block.scss

```css
@mixin c-block\@screen_large {
    .c-flightResult { styles }
```

\_media-queries.scss

```css
@media only screen and (min-width: 1024px) {
  @include c-flightResult\@screen_large;
```

## File structure

The Sass architecture in this project is a modification of solution introduced in Hugo Giraudel's Sass Guidelines:

-> https://sass-guidelin.es/#architecture

```
src/
|
|--html/
|   |-- index.html                  # Template html
|
|--js/
|   |--app.js                       # Compile js.files
|
|--scss/
    |-- abstracts/                  # Global Mixins, Variables and Fonts
    |   |-- _abstracts-dir.scss
    |
    |-- base/                       # Base styles, Typography, Reset
    |   |-- _base-dir.scss
    |
    |-- componets/                  # Blocks, Elements and Modifiers
    |   |-- _components-dir.scss/
    |
    |-- layouts/                    # Larger layout components and media-queries styles.
    |   |-- _layouts-dir.scss
    |
    |-- vendor/
    |   |-- _normalize.scss         # Normalize.css v8.0.1
    |
    |-- style.scss                  # Main Scss file compiles to style.css

```

## Gulp

Gulp is a build system for automating tasks.

- Minification (Compress/Uglyfy)
- Compile Sass, LESS files for you
- Combining multiple js/css files into single file respectively
- Converting SVG icons to fonts
- Live browser reload
- CSS browser prefix can be automated for eg.

setting the working environment -> http://domanart.pl/gulp/
