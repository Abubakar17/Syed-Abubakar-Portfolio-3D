# Syed Muhammad Abubakar — 3D portfolio

A walkable low-poly data center aisle. Each glowing rack is a CV section; open one and the content
appears in a terminal-style overlay. A **Classic view** shows everything as a normal scrollable page. It is
the default when `prefers-reduced-motion` is set, on low-end devices, and when WebGL2 is unavailable.

## Update your CV

All content lives in **`src/content/cv.ts`**: profile, about, experience, projects, papers, education,
honors, skills and contact. The 3D code reads the `sections` array, so racks, labels, deep links and
the Classic page all update when you edit it.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ at /Syed-Abubakar-Portfolio/
```

## Deep links

`#/about`, `#/experience`, `#/projects`, `#/education`, `#/skills`, `#/contact`.
Case studies: `#/projects/deepdive`, `#/projects/aal`, `#/projects/lidar` (legacy `#/deepdive` etc. still work).
Force a mode with `?view=classic` or `?view=3d`.

## Controls

WASD / arrow keys walk · Enter opens the nearest rack · click/tap any glowing rack · Esc or
"Back to aisle" returns. On touch devices an on-screen joystick appears.

## Deploy (GitHub Pages)

Push to `main`. `.github/workflows/deploy.yml` builds with `BASE_PATH=/<repo-name>/` and publishes
`dist/`. In the repo settings, set **Pages → Source** to **GitHub Actions**.

## Structure

```
src/
  content/cv.ts      all CV data
  sections/          section components (shared by overlay + classic view)
  ui/                hero, overlay, loading screen, joystick, classic view, view toggle
  lib/               zustand store, hash routing, device detection, input
  scene/             (lazy chunk) World, Aisle, SectionRacks, Avatar, CameraRig, Director, Portal
public/models/robot.glb   meshopt-compressed avatar (183 KB)
raw-models/               uncompressed source model; re-run `npm run compress-models`
```

## Credits

Avatar: "RobotExpressive" by Tomás Laulhé (Quaternius), CC0, from the three.js examples.
