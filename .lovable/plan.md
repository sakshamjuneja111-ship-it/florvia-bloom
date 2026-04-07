## Goal

Refine the existing Florvia site, not rebuild it.

Keep the current structure exactly as it is:

`Navbar → ScrollJourney → Products → Brand Story → Footer`

The objective is to heavily polish the experience so the entire page feels like **one continuous cinematic world** rather than a sequence of swapped images and separate website sections.

## What is currently breaking the illusion

- `ScrollJourney` feels too chapter-based right now, with 7 labeled scenes, very long pacing, and independent motions that make the visuals feel stacked instead of connected.
- The chapter dots, repeated overlay text, and end flash make the journey feel segmented rather than like one continuous camera move.
- The transition into `ProductsSection` is too abrupt, so it feels like the user exits the cinematic world and lands in a separate content block.
- The lower sections use harder background and card changes, which weakens the premium, luxury continuity.

## Direction

Keep the same story and structure, but make the experience feel more cinematic, bright, bloomy, realistic, and seamless.

The user should feel like they are **moving through one living world**:  
**mountains → descent into garden → pathway / gate approach → gate opens → products**

Everything should feel blended, atmospheric, soft, and high-end — never like stacked sections or obvious image swaps.

## Implementation plan

### 1. Tighten the journey into fewer, smoother beats

- Keep the same story progression.
- Compress the current 7 phases into about 4 larger cinematic beats.
- Shorten the scroll so the pacing feels cleaner, more natural, and less stretched.
- Use one consistent motion language throughout: slow forward movement, subtle vertical drift, soft overlap, and minimal sideways motion.

### 2. Make all scenes feel like one environment

- Rework transitions so scenes feather into each other instead of fading like separate slides.
- Add atmospheric blending layers between scenes: haze, soft shadow, warm bloom, depth fog, and light spill.
- Keep motion elegant and realistic. Avoid overly dramatic or fake-looking parallax.

### 3. Unify the image treatment and lighting

- Apply one shared cinematic grade across all journey imagery and the products hero so everything feels visually related to the main mountain scene.
- Use consistent lighting logic throughout: bright natural light, soft bloom, richer depth, and subtle vignette.
- If any image still feels out of place after grading, replace only that outlier while preserving the existing concept and sequence.

### 4. Remove anything that makes the experience feel segmented

- Remove or heavily soften chapter dots and scene labels.
- Reduce overlay copy so the visuals carry the storytelling more naturally.
- Keep only very subtle progress or guidance cues if needed.

### 5. Blend the gate exit directly into products

- Make the end of `ScrollJourney` and the start of `ProductsSection` feel like one continuous handoff.
- Replace the abrupt white-out effect with a softer luminous threshold.
- Make the products world feel like the natural continuation beyond the gate.
- Let the top of the products area inherit the same light, mood, and depth before transitioning into the product grid.

### 6. Polish the rest of the page to preserve the same luxury world

- Soften hard section and background changes in `ProductsSection`, `BrandStory`, and `Footer`.
- Upgrade surfaces so they feel airy, refined, and premium instead of like separate blocks or cards.
- Keep the layout, but make the full page feel art-directed from top to bottom as one unified experience.

## Technical focus

### `src/components/ScrollJourney.tsx`

- shorten total scroll length
- merge scene timings into fewer phases
- simplify transforms and remove distracting lateral movement
- add atmospheric bloom, haze, and soft light overlays
- make the gate opening and exit softer, smoother, and more realistic

### `src/components/ProductsSection.tsx`

- overlap the section more naturally with the gate reveal
- make the intro feel like the same cinematic world before the cards begin
- soften reveal timing and visual contrast

### `src/components/BrandStory.tsx`, `src/components/Footer.tsx`, `src/components/Navbar.tsx`

- reduce abrupt visual shifts
- keep the nav more subtle during the cinematic intro
- continue the same premium palette, lighting, and softness

### `src/index.css` and `src/pages/Index.tsx`

- add reusable atmosphere, bloom, haze, and lighting utilities
- create more continuous page-wide background blending
- improve softness, light, and overall section continuity

## Expected result

The final experience should feel like a **bright, bloomy, realistic luxury cinematic journey**.

The user should feel like they are moving through one continuous world — from mountains into the botanical garden, through the gate, and naturally into the products — with fewer obvious scene swaps, less “website section” feeling, and a much more premium, film-like flow.

Important:

- refine the existing project, do not rebuild it
- preserve the current structure and story
- focus on polishing, blending, continuity, lighting, pacing, and atmosphere
- avoid anything that feels overly flashy, artificial, or disconnected