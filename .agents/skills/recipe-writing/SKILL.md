---
name: recipe-writing
description: Create or revise YAML recipes for this Astro blog's recipe pages. Use for work under src/content/recipes, including ingredients, steps, publication fields, and choosing the portrait or duet page layout; do not use for ordinary Markdown posts.
---

# Recipe Writing

Write usable Chinese recipes in the repository's existing YAML format. Read
`src/utils/recipes/schema.ts` and `src/content/recipes/README.md` when the data
contract matters; inspect existing recipes to match voice, category, and tags.
Start from [assets/example-recipe.yaml](assets/example-recipe.yaml) for a new
file. Its values are an example, not facts about another dish.

## Workflow

1. Establish the dish, servings, ingredients, method, and available photos from
   the user's information. Ask for missing quantities or steps when guessing
   would change the recipe materially. Do not invent a tested result, provenance,
   cooking time, or photo.
2. Use a unique lowercase kebab-case filename in `src/content/recipes/`. Put
   images in `src/assets/images/recipes/<slug>/`; image fields contain only the
   filename. Describe what each photo shows in `alt`.
3. Select a page layout from the table below based on the actual photos and the
   desired placement. Do not specify `detail` for `portrait`; `duet` requires
   two different image files.
4. Write `schemaVersion: 1` and the `recipe`, `presentation`, `ingredients`,
   `steps`, and `publication` sections. Use an allowed category from the schema.
   Give each ingredient a unique kebab-case `id`; specify either positive
   `amount` with `unit`, or `note`, never both. Every `steps[].uses` ID must
   exist in `ingredients`.
5. Keep the text operational: name preparation, heat, timing or visible doneness
   cues when known; make portions and quantities consistent across ingredients
   and steps. Preserve the author's dish and method. Mark an incomplete recipe
   `draft` rather than filling gaps with invented details.
6. Publish only when requested or already authorized: set `status: published`
   and choose an unused positive integer `order`. Set `featured` deliberately.
   A draft may omit `order`. Check existing orders in `src/content/recipes/`.
7. Validate the new or changed file with `pnpm type-check` and `pnpm build`.
   Inspect desktop and mobile rendering when changing layout or photos.

## Page layouts

`presentation.template` chooses the page structure; `variant` chooses image
placement on desktop. On narrow screens, the layout stacks vertically.

| template | variant | Desktop arrangement | Required photos |
| --- | --- | --- | --- |
| `portrait` | `image-left` | Large cover left; title and recipe text right | `cover` |
| `portrait` | `image-right` | Large cover right; title and recipe text left | `cover` |
| `duet` | `large-left-small-top` | Large cover left; detail above title right | `cover`, `detail` |
| `duet` | `large-left-small-bottom` | Large cover left; title above detail right | `cover`, `detail` |
| `duet` | `large-right-small-top` | Large cover right; detail above title left | `cover`, `detail` |
| `duet` | `large-right-small-bottom` | Large cover right; title above detail left | `cover`, `detail` |

The cover uses a 4:5 frame and the duet detail uses a 4:3 frame, both cropped
from the image center. The recipe index uses the cover separately at 4:3, or
16:9 for the lead card. Choose photos whose subject survives these crops.

The source of truth for allowed fields and variants is
`src/utils/recipes/schema.ts`; page placement is implemented in
`src/components/recipes/PortraitRecipe.astro`,
`src/components/recipes/DuetRecipe.astro`, and `src/layouts/RecipeLayout.astro`.
