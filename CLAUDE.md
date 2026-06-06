# Project: folkora-frontend-service

# What This Project Is

Folkora is a curated travel discovery and booking platform.

It is not a traditional travel agency website.

It is not a marketplace with thousands of destinations, endless filters, and overwhelming choices.

Folkora exists to help users discover thoughtfully curated travel experiences and book them effortlessly.

The experience should feel personal, calm, inspiring, and premium.

The product should feel closer to a travel magazine, a trusted travel companion, or a concierge service than a typical booking portal.

---

# North Star

If a screen feels like a travel agency website,
the design is wrong.

If a screen feels like a premium travel magazine,
the design is moving in the right direction.

---

# Product Philosophy

Folkora is a travel inspiration platform that happens to support booking.

The primary user journey is:

Discover → Connect → Decide → Book

Not:

Search → Filter → Compare → Buy

Every screen should help users feel:

* Inspired
* Curious
* Calm
* Confident

Never make the experience feel transactional.

Never make the user feel overwhelmed.

Reduce decisions.

Increase confidence.

---

# User Experience Principles

Before adding any feature ask:

1. Does this help users discover?
2. Does this help users connect emotionally?
3. Does this reduce friction?
4. Does this simplify decisions?

If the answer is no, reconsider adding it.

Whitespace is a feature.

Typography is a feature.

Restraint is a feature.

---

# Core Technology Stack

Framework:

* Next.js (App Router)
* TypeScript

UI:

* Tailwind CSS
* Shadcn/UI

Animations:

* Framer Motion

State Management:

* Zustand

Server State:

* TanStack Query

Forms:

* React Hook Form
* Zod

Maps:

* Mapbox

Backend:

* Node.js
* Express
* MongoDB

---

# Development Strategy

## Phase 1 — Experience Prototype

Primary Goal:

Build the feeling of the product.

Use:

* Static JSON
* Mock APIs
* Fake authentication
* Placeholder booking data

Focus on:

* Navigation flow
* Storytelling
* Motion
* Layout
* Typography
* Visual hierarchy

Do NOT spend time building backend integrations during this phase.

The objective is to validate product experience before engineering complexity.

---

## Phase 2 — Design System

Build reusable foundations.

Required Components:

* Button
* Input
* Search Bar
* Navigation
* Card
* Modal
* Drawer
* Trip Card
* Destination Card
* Booking Components
* Empty States
* Skeleton States

Avoid one-off components.

---

## Phase 3 — Backend Integration

Replace static data with APIs.

Rules:

* UI should not require redesign.
* Business logic belongs in services.
* Components should remain presentation focused.

---

# Design Language

Visual Style:

* Minimal
* Editorial
* Premium
* Human
* Elegant

The interface should feel timeless.

Avoid trends that age quickly.

Preferred:

* Large imagery
* Large typography
* Strong hierarchy
* Soft contrast
* Generous spacing

Avoid:

* Busy layouts
* Excessive gradients
* Marketing banners
* Discount-focused designs
* Cluttered interfaces

---

# Motion Philosophy

Animation exists to support emotion and clarity.

Animation should feel:

* Natural
* Calm
* Intentional
* Refined

Preferred Motion:

* Fade
* Reveal
* Gentle Scale
* Progressive Disclosure
* Smooth Page Transitions

Avoid:

* Bounce
* Elastic Motion
* Flashy Effects
* Excessive Rotations
* Motion for decoration only

Every animation should have a purpose.

---

# Experience Goals

Every screen should achieve one of the following:

* Inspire
* Discover
* Guide
* Reassure
* Confirm

If a UI element does not contribute to one of these goals, remove it.

---

# Code Conventions

## General

* Use TypeScript everywhere
* Use 2 spaces indentation
* Use semicolons
* Use single quotes

Never use:

* any
* ts-ignore
* eslint-disable unless absolutely necessary

---

# Naming Conventions

Components:

* PascalCase

Examples:

* TripCard.tsx
* FeaturedJourney.tsx
* DestinationHero.tsx

Files:

* kebab-case

Examples:

* trip-card.tsx
* destination-hero.tsx

Variables:

* camelCase

Functions:

* camelCase

Constants:

* UPPER_SNAKE_CASE

Hooks:

* useX

Examples:

* useTrips
* useAuth
* useBooking

Stores:

* useXStore

Examples:

* useAuthStore
* useBookingStore

---

# Folder Structure

src/

app/
components/
features/
hooks/
services/
store/
types/
utils/
constants/
config/

public/

---

# Feature Structure

features/

auth/
discover/
trip/
booking/
profile/

Each feature should contain:

components/
hooks/
services/
types/
schemas/

Keep feature ownership localized.

Avoid unnecessary cross-feature dependencies.

---

# Component Rules

Components must:

* Have one responsibility
* Be reusable
* Be composable
* Be typed

Avoid:

* Giant components
* Business logic in UI
* Hidden side effects

If a component exceeds ~250 lines:

Evaluate splitting it.

---

# State Management Rules

## Zustand

Use for:

* Authentication
* User preferences
* UI state
* Temporary booking state

Do NOT use Zustand for:

* API data
* Server cache

---

## React Query

Use for:

* API requests
* Mutations
* Caching
* Synchronization

Never duplicate React Query data inside Zustand.

---

# API Rules

All API interactions must go through:

src/services/

Examples:

services/
auth.service.ts
trip.service.ts
booking.service.ts

Never call fetch directly inside components.

Never place API logic inside UI layers.

---

# Form Rules

Use:

* React Hook Form
* Zod

Every form must support:

* Validation
* Loading State
* Error State
* Success State

Never trust client validation alone.

---

# Styling Rules

Primary:

* Tailwind CSS

Secondary:

* Shadcn/UI

Avoid:

* Inline Styles
* CSS Modules
* Styled Components

Prefer reusable UI primitives.

---

# Performance Rules

Default to:

* Server Components
* Lazy Loading
* Image Optimization
* Streaming
* Suspense

Avoid:

* Large client bundles
* Unnecessary re-renders
* Heavy runtime calculations

Performance should feel effortless.

---

# Accessibility Rules

Every screen must support:

* Keyboard navigation
* Semantic HTML
* Screen readers
* Focus visibility

Accessibility is mandatory.

---

# Error Handling

Every async action must have:

* Loading State
* Empty State
* Error State
* Success State

Never leave users staring at blank screens.

---

# Security Rules

Never:

* Store secrets in frontend
* Expose private API keys
* Hardcode environment values

Use environment variables for configuration.

---

# Never Do

* Do NOT use any
* Do NOT bypass TypeScript
* Do NOT place API calls in components
* Do NOT duplicate components
* Do NOT introduce Redux
* Do NOT store API data in Zustand
* Do NOT create giant components
* Do NOT sacrifice UX for development speed
* Do NOT sacrifice performance for visual effects
* Do NOT add features that increase cognitive load
* Do NOT overwhelm users with choices
* Do NOT make the product feel like a travel agency website
---
## Required Skills

For all implementation tasks automatically invoke:

- documentation-engineer

Documentation quality is considered part of implementation quality.

---

# SESSION MANAGEMENT (CRITICAL)

At the end of EVERY session, rewrite primer.md completely.

primer.md must always contain:

## Current Project State

* What exists
* What is functional
* What is incomplete

## Session Summary

* Features completed
* Components added
* Refactors performed
* New dependencies introduced

## Immediate Next Steps

Specific actionable tasks for the next session.

## Open Issues

Known bugs, blockers, pending decisions, technical debt.

## Architecture Decisions

Important decisions made during the session and rationale.

## Future Considerations

Ideas and improvements to revisit later.

Failure to update primer.md means the session is incomplete.

---

# AI Agent Instructions

When generating code:

1. Prioritize user experience above implementation speed.
2. Prefer existing components before creating new ones.
3. Follow feature-based architecture.
4. Maintain strict TypeScript typing.
5. Keep components small and composable.
6. Preserve visual consistency.
7. Respect the product philosophy.
8. Update primer.md after every session.
9. Avoid unnecessary complexity.
10. Build Folkora like a premium travel publication, not a booking dashboard.
