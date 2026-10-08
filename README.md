# Mr. Sweeps Chimney Cleaning — Website

A modern, responsive redesign of the Mr. Sweeps Chimney Cleaning website.
Protecting homes in the DFW Metroplex since 1982.

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies.
Open `index.html` in a browser or serve the directory statically.

```bash
python3 -m http.server 8000
```

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Single-page site (hero, about, services, process, why us, CTA, contact) |
| `styles.css` | All styling — design tokens, layout, responsive breakpoints |
| `script.js` | Mobile nav, scroll-spy, reveal animations, form validation + submission |
| `favicon.svg` | Chimney/ember mark |
| `robots.txt`, `sitemap.xml` | SEO |
| `images/source/` | Authentic photography from the original site |

## Content

All copy, services and contact details come from the client's existing site.
Phone: **817-692-5624**. Service area: the DFW Metroplex.

## Forms

The quote request form posts to LeadrVision:

```
POST https://vision.leadrai.com/api/forms/142eddfdd7ad452b4cd6256fb1d52d35
```

It works without JavaScript (plain POST, returns to the page with `?submitted=1`)
and is progressively enhanced with a `fetch()` submission to the same endpoint
that renders the confirmation inline. Hidden `_form`, `_page` and `_gotcha`
fields are included on both paths.

## Images

Only two images from the original site carried real content — a rooftop chimney
cap installation photo and the company logo. Both are kept. The remaining
entries in the source list were transparent 1×1 placeholders and were removed;
sections without suitable photography are built without images by design.
