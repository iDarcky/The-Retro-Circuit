# The Retro Circuit - Resume & Interview Guide

This document is designed to help you articulate your work on **The Retro Circuit** as a Product Manager. It highlights how you conceptualized, designed, and shipped a complex, full-stack application from zero to one in just 3 months—acting as the sole PM while leveraging an AI (Jules/Google AI Studio) as your engineering team.

---

## 01. The "Elevator Pitch" (Executive Summary)

*Use this in a cover letter, LinkedIn "About" section, or when asked, "Tell me about a project you're proud of."*

> "I identified a significant fragmentation problem in the retro gaming hardware market—consumers couldn't easily compare complex device specifications and variants. To solve this, I led the zero-to-one product development of **The Retro Circuit**, a specialized comparison engine. Acting as the sole Product Manager, I leveraged AI (Google AI Studio) as my engineering counterpart to architect, build, and ship a full-stack, edge-native web application (Next.js, Supabase, Vercel) in just 3 months. I managed the entire product lifecycle: from defining the relational data schema to mitigate 'signal noise,' to establishing a strict 'Swiss Industrial' design system, and building a custom CMS/Admin Command Center to manage our product roadmap and content."

---

## 02. Impact-Driven Bullet Points

*Use these in your Work Experience or Projects section. They follow the standard PM format: "Accomplished [X] as measured by [Y], by doing [Z]."*

### Product Strategy & Execution
* **Zero-to-One Delivery:** Directed the end-to-end product lifecycle of a specialized hardware comparison engine (The Retro Circuit), launching the MVP in 3 months by utilizing an AI agent (Google AI Studio) as an engineering counterpart for rapid prototyping and deployment.
* **Solving User Problems ("Signal Noise"):** Architected a complex relational database schema (Manufacturers -> Consoles -> Variants) to solve market fragmentation, allowing users to accurately compare specific hardware SKUs rather than generic product lines.
* **Roadmap & Transparency:** Conceptualized and shipped a public-facing Roadmap and Changelog system, increasing user trust and establishing a transparent feature-delivery pipeline, managed via a custom-built Admin Command Center.
* **Product Discovery (The Finder):** Designed and launched "The Finder," an intelligent quiz-based wizard that guides users to optimal hardware purchases based on budget, form factor, and desired emulation targets.

### Technical Acumen & Architecture Management
* **Modern Tech Stack Selection:** Defined the technical architecture requirements for a high-performance, secure, and scalable platform, selecting an edge-native stack: Next.js 16 (React Server Components), Supabase (PostgreSQL/Auth), and Vercel.
* **Security & Infrastructure Setup:** Championed enterprise-grade security practices, including the implementation of Upstash Redis for API rate limiting, strict Row Level Security (RLS) policies in Supabase, and automated CI/CD deployment pipelines via GitHub.
* **Design System & UX Consistency:** Established a strict "Swiss Industrial" design system (prioritizing information density and high-contrast typography over decoration), ensuring a cohesive user experience and reducing engineering overhead during AI-assisted development.
* **Platform Operations (Admin Hub):** Designed and managed a restricted-access Command Center for seamless CRUD operations, allowing non-technical operators to manage product data, variants, and platform metadata without database intervention.

---

## 03. The Skills Matrix

*Add these to your "Skills" section.*

**Product Management:** Zero-to-One Product Development, MVP Scoping, Agile/Lean Methodology, Roadmap Prioritization, Requirements Definition, User Persona/Problem Space Definition ("Signal Noise"), CMS/Admin Panel Design.
**Technical Capabilities:** AI-Assisted Development (Prompt Engineering, Agent Management), Technical Architecture Strategy, Relational Database Modeling (PostgreSQL).
**Tools & Technologies:** Google AI Studio (LLM Engineering), Next.js / React, Vercel (Edge Infrastructure), Supabase (BaaS), Upstash Redis (Rate Limiting), GitHub, Google Analytics, Zoho Mail & Resend.
**Design & UX:** Design System Governance ("Swiss Industrial"), Information Architecture, High-Density UI Planning.

---

## 04. The "Story" (Interview Talking Points)

*When an interviewer asks you to go deeper into the project, focus on these specific PM challenges and solutions:*

### 1. The Challenge of "Signal Noise"
* **The Situation:** The market was flooded with handhelds that shared names but had wildly different specs (e.g., Retroid Pocket 4 vs. Retroid Pocket 4 Pro - 8GB RAM).
* **The PM Action:** You recognized this wasn't just a UI problem; it was a data architecture problem. You insisted on separating the concept of a "Console" (the marketing name) from the "Variant" (the actual hardware SKU).
* **The Result:** The Retro Circuit provides precision comparisons (like GSMArena) rather than confusing aggregations, solving the core user pain point.

### 2. Managing an AI as an "Engineering Team"
* **The Situation:** You are a PM who can't code natively, but you needed to ship a complex product fast.
* **The PM Action:** You treated the AI (Jules/Google AI Studio) like a senior developer. Instead of writing code, you wrote incredibly clear specifications, defined the design system (docs/DESIGN.md), set up the architecture constraints, and managed the deployment pipeline. You provided the *context* and the *requirements* (the "What" and "Why"), and let the AI figure out the "How."
* **The Result:** You shipped a Next.js 16 app in 3 months—a timeline that would typically require a dedicated frontend and backend engineer.

### 3. The "Command Center" (Admin Hub)
* **The Situation:** A comparison engine is useless without accurate, up-to-date data. Hardcoding data wasn't scalable.
* **The PM Action:** You prioritized building an internal tool (`/admin`) early in the roadmap. You designed it with Role-Based Access Control (RBAC) and validation rules (e.g., a console can't be published without an image).
* **The Result:** This allowed you (the operator) to manage the massive influx of hardware data, new variants, and roadmap updates seamlessly without needing to run database queries.

### 4. Shipping Modern, Secure Technology
* **The Situation:** You wanted the platform to be professional-grade, not just a hobby project.
* **The PM Action:** You selected a modern "Edge-Native" stack. You integrated Supabase for robust relational data and authentication. You ensured the site was fast (Vercel) and secure (Upstash Redis for rate limiting, Supabase RLS policies). You also set up proper analytics (Google Analytics) and transactional emails (Zoho/Resend).
* **The Result:** You didn't just build a prototype; you built a scalable, secure, production-ready platform that demonstrates a deep understanding of modern web architecture.
