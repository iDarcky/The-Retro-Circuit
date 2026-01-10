# Design System: Color Palette

This document defines the semantic color palette used across the Retro Circuit application.
Source of truth: `styles/globals.css` and `tailwind.config.js`.

## Accent Colors (By Role)

| Semantic Role | Color Name | Hex Code | CSS Variable | Usage |
|:--- |:--- |:--- |:--- |:--- |
| **Primary** | Cyan | `#00D9FF` | `--color-primary` | Main UI elements, active states, borders |
| **Secondary** | Green | `#00FF88` | `--color-secondary` | Positive actions, success states, "Go" signals |
| **Accent** | Pink | `#FF6B9D` | `--color-accent` | Special highlights, brand accents, "Hot" signals |
| **Warning** | Yellow | `#FFC857` | `--color-warning` | Cautionary alerts, warnings |

## Backgrounds

| Semantic Role | Hex Code | CSS Variable | Usage |
|:--- |:--- |:--- |:--- |
| **Primary** | `#0a0e1a` | `--bg-primary` | Main application background (Deep Blue/Black) |
| **Secondary** | `#161b22` | `--bg-secondary` | Sidebar, header, secondary containers |
| **Card** | `rgba(255, 255, 255, 0.04)` | `--bg-card` | Cards, panels, elevated surfaces |

## Text

| Semantic Role | Hex Code | CSS Variable | Usage |
|:--- |:--- |:--- |:--- |
| **Primary** | `#e0e0e0` | `--text-primary` | Headings, main body text |
| **Secondary** | `#8b949e` | `--text-secondary` | Subtitles, metadata, less prominent text |
| **Muted** | `#6e7681` | `--text-muted` | Disabled text, placeholders, low priority info |

## Borders

| Semantic Role | Color | CSS Variable | Usage |
|:--- |:--- |:--- |:--- |
| **Subtle** | `rgba(255, 255, 255, 0.1)` | `--border-subtle` | Dividers, subtle containers |
| **Normal** | `rgba(255, 255, 255, 0.15)` | `--border-normal` | Standard inputs, cards |
| **Strong** | `rgba(255, 255, 255, 0.3)` | `--border-strong` | Active inputs, focused elements |

---

*Last Updated: February 2025*
