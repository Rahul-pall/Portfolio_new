# Rahul Pal — Portfolio

A 3D portfolio built with Next.js 15 (App Router), Tailwind CSS v4 and React Three Fiber. It is exported as a static site.

## What's inside

| Area | Packages |
| --- | --- |
| Hero 3D scene: hologram core, stars, particle cloud, orbit rings | `three`, `@react-three/fiber`, `@react-three/drei`, `maath` |
| Hologram material (fresnel + scanlines + pulse) | `three-custom-shader-material` |
| Neon glow, chromatic aberration, film noise, vignette | `@react-three/postprocessing`, `postprocessing` |
| Bouncy click / hover on the core | `@react-spring/three` |
| Keyboard + screen-reader access to the 3D core | `@react-three/a11y` |
| Skill tiles you can throw around | `@react-three/rapier` |
| Scroll-driven camera, timeline fill | `gsap` (ScrollTrigger) |
| Smooth scrolling | `lenis` |
| UI reveals, filters, command palette, counters | `motion` |
| Live scene tuning: open the site with `?debug` | `leva` |
| Optional Spline scene ("Lab" section) | `@splinetool/react-spline`, `@splinetool/runtime` |

You can also press `Ctrl K` to open a command palette, and every project has its own case-study page at `/projects/<slug>/`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
npm start        # serve ./out locally
```

## Edit content

All the text, projects, experience and skills live in `lib/data.ts`. Project screenshots are in `public/projects/`.

## Spline (optional)

1. Design a scene on spline.design.
2. Go to Export → Code → React and copy the `.splinecode` URL.
3. Put the URL in `.env.local`:

```
NEXT_PUBLIC_SPLINE_SCENE=https://prod.spline.design/xxxx/scene.splinecode
```

The "Lab" section only appears when this is set.

## Deploy

Run `npm run build`, then upload the contents of `out/` to cPanel `public_html` (or to a subdomain folder). The same folder also deploys as-is to Vercel, Netlify or GitHub Pages. Set `NEXT_PUBLIC_SITE_URL` to the final domain so social preview images resolve correctly.
