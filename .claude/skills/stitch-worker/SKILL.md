---

name: stitch-worker
description: Use this skill when importing, auditing, refactoring, or productionizing Stitch MCP designs. Verifies MCP connectivity, preserves raw imports, performs structured frontend audits, applies standardized UI improvements, and validates accessibility, responsiveness, animations, performance, and code quality while maintaining source fidelity.
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Stitch Worker

## When To Use

Use this skill when:

* Importing a design from Stitch MCP
* Auditing Stitch-generated code
* Refactoring imported Stitch projects
* Converting Stitch designs into production-ready code
* Performing UI consistency reviews
* Running accessibility audits
* Standardizing animations, typography, colors, and spacing
* Preparing imported designs for production deployment

---

## Core Principle

The Stitch MCP output is the source of truth.

Never:

* Recreate designs manually
* Infer missing layouts
* Replace imported assets
* Approximate missing UI

Always work from the MCP import.

---

## Workflow

### 1. Verify Stitch MCP Connection

Before performing any action:

* Verify MCP connectivity
* Verify authentication
* Verify project access

If verification fails:

* Report the exact error
* Stop immediately
* Do not continue
* Do not generate fallback implementations

---

### 2. Discover Projects

Retrieve all available Stitch projects.

Display:

* Project name
* Project ID
* Last modified date
* Description (if available)

Number every project.

Stop and wait for user selection.

---

### 3. Discover Designs

After project selection:

Retrieve all available designs.

Display:

* Design name
* Design ID
* Last modified date
* Description (if available)

Stop and wait for user confirmation.

---

### 4. Import Design

Import:

* Components
* Layouts
* Assets
* Images
* Styles
* Themes
* Metadata

Save raw import to:

/imported

Rules:

* Preserve exactly as imported
* No cleanup
* No formatting
* No optimization
* No restructuring

---

### 5. Import Verification

Display the complete imported file tree.

Example:

/imported
├── assets
├── components
├── layouts
├── styles
└── metadata

Stop and wait for user approval.

---

### 6. Audit Phase

Audit the imported codebase before writing any new code.

Check:

1. Fonts
2. Typography
3. Colors
4. Animations
5. Interactive states
6. Spacing
7. Z-index
8. Responsive behavior
9. Component structure
10. Performance
11. Accessibility
12. Dead code

Status values:

* ✅ OK
* ⚠️ Minor
* 🔴 Critical

Display:

* Critical issue count
* Minor issue count
* Audit summary

Wait for approval before modifications.

---

### 7. Apply Fixes

Apply fixes in this exact order:

1. Design tokens
2. Typography system
3. Color consistency
4. Spacing normalization
5. Component cleanup
6. Animation standardization
7. Responsive improvements
8. Accessibility improvements
9. Environment cleanup
10. Console verification

Do not reorder steps.

---

### 8. Verification

Generate:

* Final audit report
* Final diff summary
* Change summary

Every audit category must pass before completion.

---

## Required Animation Standards

### Section Entrance

Initial:

* opacity: 0
* blur: 12px
* y: 28

Animate:

* opacity: 1
* blur: 0
* y: 0

Duration:

* 0.7s

### Headline Animation

Animate each word individually.

Stagger:

* 100ms

### Grid Animation

Child stagger:

* 0.09s

### Card Hover

* y: -7
* scale: 1.018

### Button Hover

* scale: 1.05

Button tap:

* scale: 0.97

### Reduced Motion

Respect user accessibility preferences.

Use reduced-motion alternatives when available.

---

## Accessibility Standards

Ensure:

* Alt text exists
* Aria labels exist
* Keyboard navigation works
* Focus states are visible
* Contrast meets WCAG AA

---

## Production Standards

Enforce:

* Design tokens
* Consistent typography
* Semantic color system
* Responsive layouts
* Accessible interactions
* Clean component architecture
* Optimized assets
* Environment-based configuration

---

## Non-Negotiable Rules

Never modify:

/imported

Never:

* Skip audit
* Skip approval checkpoints
* Continue after MCP failure
* Replace imported assets
* Recreate imported designs

Always preserve source fidelity.
