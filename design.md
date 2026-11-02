# Design reference

Source: https://bareezehome.com.pk/
Page: Bareeze Home

Measured from 299 rendered elements at 1512 x 857px. This is a sample of the current document and state, not the original design source.

## Color palette

Only observed CSS colors are listed. Usage labels describe where a color was found. Hex is an sRGB preview; retain the original CSS value for its color space and transparency.

Usage | Original CSS value | sRGB hex | Observed root properties | Occurrences
--- | --- | --- | --- | ---
Text | rgb(17, 17, 17) |  |  | 246
Text | rgb(85, 85, 85) |  |  | 33
Text | rgb(255, 255, 255) |  |  | 19
Text | rgb(255, 0, 0) |  |  | 1
Surface | rgb(245, 245, 245) |  |  | 85
Surface | rgb(255, 255, 255) |  |  | 7
Surface | rgb(17, 17, 17) |  |  | 1
Border | rgb(222, 222, 222) |  |  | 6
Border | rgb(235, 235, 235) |  |  | 1

## Typography

Role | Family | Size | Weight | Line height | Tracking | Text transform
--- | --- | --- | --- | --- | --- | ---
Subheading | Montserrat | 16px | 400 | 20.8px | normal | none
Body | Montserrat | 16px | 400 | 28px | normal | none
Small text | Montserrat | 12px | 500 | 21px | normal | uppercase
Button | Montserrat | 16px | 400 | 28px | normal | none

## Spacing

Value | Occurrences
--- | ---
6px | 1
10px | 29
13.6px | 12
15px | 22
16px | 1
20px | 2
30px | 1
55px | 12
60px | 4

## Layout gaps

No values observed in this sample.

## Corner radii

Value | Occurrences
--- | ---
30px | 36

## Shadows

No values observed in this sample.

## Motion durations

Value | Occurrences
--- | ---
0.4s | 101
0.5s | 85
0.2s | 4

## Motion easing

Value | Occurrences
--- | ---
ease | 186
ease-in-out | 4

### Accessible keyframe names

- ticker
- swiper-preloader-spin
- fadeInLeftShort
- fadeOutRightShort
- bls-spin
- modal-open
- modal-closing
- rise-up
- fadeIn
- shakeY
- shakeX
- animateUpToDown

## Component recipes

Computed styles for the captured state. Selectors identify sampled elements; text and placeholders come from the page. Form values are excluded. These style specimens do not reconstruct child markup or uncaptured interaction states.

### Button 1

```css
button {
  align-items: normal;
  background-color: rgba(0, 0, 0, 0);
  background-image: none;
  border-radius: 30px;
  border-top-color: rgb(17, 17, 17);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgb(17, 17, 17);
  display: inline-block;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: 400;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 28px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

### Button 2

```css
button {
  align-items: normal;
  background-color: rgb(255, 255, 255);
  background-image: none;
  border-radius: 30px;
  border-top-color: rgb(222, 222, 222);
  border-top-style: solid;
  border-top-width: 1px;
  box-shadow: none;
  color: rgb(17, 17, 17);
  display: inline-block;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 21px;
  padding-bottom: 13.6px;
  padding-left: 55px;
  padding-right: 55px;
  padding-top: 13.6px;
  text-transform: uppercase;
}
```

### Button 3

```css
button {
  align-items: normal;
  background-color: rgb(17, 17, 17);
  background-image: none;
  border-radius: 50%;
  border-top-color: rgb(85, 85, 85);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgb(85, 85, 85);
  display: inline-block;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: 400;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 28px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

### Input 1

```css
input {
  align-items: normal;
  background-color: rgb(255, 255, 255);
  background-image: none;
  border-radius: 30px;
  border-top-color: rgb(235, 235, 235);
  border-top-style: solid;
  border-top-width: 1px;
  box-shadow: none;
  color: rgb(85, 85, 85);
  display: block;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 400;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: normal;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  text-transform: none;
}
```

## Layout measurements

Element | Width | Display | Columns | Gap | Padding (T R B L)
--- | --- | --- | --- | --- | ---
section | 1512px | block | none | normal | 0px 0px 0px 0px
header | 1512px | block | none | normal | 0px 0px 0px 0px
section | 1225px | block | none | normal | 0px 0px 0px 0px
main | 1512px | block | none | normal | 0px 0px 0px 0px
section | 1512px | block | none | normal | 0px 0px 6px 0px
section | 1512px | block | none | normal | 0px 0px 0px 0px
section | 1512px | block | none | normal | 0px 0px 30px 0px
section | 1512px | block | none | normal | 0px 0px 0px 0px
section | 1512px | block | none | normal | 0px 0px 0px 0px
section | 1512px | block | none | normal | 0px 0px 0px 0px

## Responsive conditions

- `(min-width: 1200px)`
- `(max-width: 1199px)`
- `(max-width: 767px)`
- `(min-width: 576px)`
- `(min-width: 768px)`
- `(min-width: 992px)`
- `(min-width: 1400px)`
- `print`
- `(min-width: 1025px)`
- `(max-width: 1024px)`
- `(max-width: 991px)`
- `(max-width: 1023px)`
- `only screen and (max-width: 575px)`
- `only screen and (min-width: 992px)`
- `only screen and (min-width: 1025px)`
- `only screen and (max-width: 413px)`
- `(min-width: 414px) and (max-width: 1024px)`
- `(min-width: 1200px) and (max-width: 1439px)`
- `only screen and (max-width: 1199px) and (min-width: 768px)`
- `only screen and (max-width: 767px) and (min-width: 576px)`

## CSS custom properties

Names and values read from the root element; no new token names or ramps were generated.

Property | Value
--- | ---
--bls__product-price-weight | 500
--heading-font-weight | 500
--header-color | #111111
--base-line-height | 1.75
--animation-fading | animateFading 0.35s ease
--bls__section-heading-weight | 500
--primary-color | #f05e2d
--btn-primary-bg | #111111
--btn-text-transform | uppercase
--spacing-title | 4rem 0
--header_border_color | #ebebeb
--bls__product-name-size | 16px
--base-font-weight | 400
--input-placeholder-color | #999999
--overlay-bg | rgba(0, 0, 0, 0.5)
--bls__product-price-color | #555555
--btn-border-radius | 30px
--font-icon | "blueskytechco"
--bls__product-name-color | #111111
--heading-font-family | Montserrat
--btn-secondary-color-hover | #ffffff
--btn-secondary-bg-hover | #111111
--btn-secondary-color | #111111
--bls__product-price-sale-weight | 400
--full-width-padding | 3rem
--bls-transform | scale(1.05)
--btn-secondary-border-color | #DEDEDE
--navigation-font-size | 16px
--btn-primary-color | #ffffff
--btn-link-color | #111111
--product-images-style-radius | 10px
--base-font-size | 16px
--input-height | 50px
--bls-box-shadow | 0 5px 30px rgba(0, 0, 0, 0.05)
--btn-width-border | 1px
--swiper-arrow-width | 5rem
--base-color | #555555
--base-body-bg-color | rgba(0,0,0,0)
--btn-font-weight | 500
--input-padding | 1rem 2rem
--swiper-pagination-bullet-inactive-opacity | 0.2
--animation-downtoup | animateDownToUp 0.35s ease
--body-custom-width-container | 1260px
--navigation-font-family | Montserrat
--heading-letter-spacing | 0px
--light-grey-color | #f5f5f5
--input-font-size | calc(16px - 2px)
--btn-font-size | 12px
--swiper-theme-color | #111
--page-title-size | 36px
--bls__product-name-weight | 400
--swiper-pagination-color | #111111
--submenu-bg | #ffffff
--loader-width | 16px
--input-border-color | #dedede
--bls-transition | all 0.4s
--color-white | #ffffff
--bls__product-price-sale-color | #757575
--swiper-arrow-height | 5rem
--page-tile-padding-desktop | 6rem

## Capture coverage

- 3 stylesheet(s) could not be inspected. Computed styles are still measured.
- Sampling excludes hidden elements and Sitepeel tools. Offscreen rendered elements may be included. Counts refer to the sample, not the entire website.
- Colors are CSS values, not a screenshot pixel palette. Images, compositing and gradients can affect their visible appearance.
- Hover, focus, active states, other viewport sizes, iframe documents and shadow trees need separate captures.
- No inferred brand personality, invented colors, placeholder copy or unobserved code is presented as a page measurement.
