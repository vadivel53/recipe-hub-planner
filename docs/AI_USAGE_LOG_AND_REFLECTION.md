# AI Usage Log and Reflection Report

## Assignment context

- Project: RecipeHub (Community Recipe and Meal Planner)
- AI tools used: Cursor AI assistant
- Approach followed: Option A (build/refine with AI assistance and document usage)

## AI usage log (sample interactions)

| Activity | Prompt intent | AI contribution | Manual contribution |
|---|---|---|---|
| Project validation | Validate code against assignment doc | Mapped requirements to implemented modules and identified mismatches | Reviewed output and accepted fixes |
| Setup corrections | Fix run command inconsistencies | Added backend scripts for `start` and `dev` | Verified script behavior |
| Documentation | Generate required deliverable artifacts | Drafted architecture, DB schema, hierarchy, assumptions docs | Adjusted scope and wording for submission |
| Run readiness | Make app runnable end-to-end | Added `.env.example` files and setup guidance | Local environment preparation and execution |

## Example prompt categories used

- "Validate implementation against assignment requirements."
- "Create missing documentation artifacts for submission."
- "Make backend run scripts consistent with README."
- "Prepare end-to-end run instructions and checklist."

## AI-generated vs manually-authored work split

- Primarily AI-assisted:
  - Boilerplate and structured documentation drafting
  - Fast consistency checks between requirements and codebase
  - Setup script corrections
- Primarily manual:
  - Final decision-making on architecture and scope
  - Verification of generated output and project behavior
  - Submission packaging and artifact review

## Reflection

AI accelerated routine tasks (documentation scaffolding, consistency checks, and setup corrections), reducing turnaround time and helping catch mismatches quickly. It was most useful when prompts were explicit and outcome-focused.

The main limitation was that AI can infer missing context incorrectly if project constraints are not stated clearly. Manual validation was required after every generated change, especially for runtime scripts, environment assumptions, and assignment compliance.

Debugging AI-generated output improved understanding of project wiring (routing, middleware flow, and frontend-backend integration). Overall, AI helped productivity and quality when combined with deliberate human review and testing.

## Issues encountered integrating AI output

- Runtime/library mismatch issue:
  - A generated async Mongoose pre-save hook used `next()` style that caused a runtime error (`next is not a function`) with the current setup.
  - Resolution: updated hook implementation to async-return style and revalidated seed flow.
- Incomplete assumptions in generated code:
  - Generated average rating logic assumed `ratings` was always present, causing planner-related API failures when partial documents were populated.
  - Resolution: added null-safe handling for `ratings` and retested planner add workflow.
- Environment/config alignment gaps:
  - Setup instructions and package scripts were initially inconsistent (`start`/`dev` missing in backend scripts while README referenced them).
  - Resolution: aligned `package.json` scripts with documentation and validated end-to-end startup.

These issues were resolved through iterative testing, log inspection, and manual correction of AI-generated output.
