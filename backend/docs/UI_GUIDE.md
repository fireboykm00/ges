## 🧩 UNIVERSAL UI STYLE SYSTEM

### (Minimal, Premium, and Scalable)

---

### 🎨 **Color System**

| Purpose                    | Variable                                           | Example                         | Description                         |
| -------------------------- | -------------------------------------------------- | ------------------------------- | ----------------------------------- |
| **Base Background**        | `--color-bg`                                       | `#FFFFFF`                       | Clean white foundation.             |
| **Surface / Card**         | `--color-surface`                                  | `#FAFAFA`                       | Light gray for subtle depth.        |
| **Border / Divider**       | `--color-border`                                   | `#E5E5E5`                       | Neutral separator, non-distracting. |
| **Primary Text**           | `--color-text`                                     | `#111111`                       | Strong dark gray, not pure black.   |
| **Secondary Text**         | `--color-text-muted`                               | `#666666`                       | For sublabels or descriptions.      |
| **Accent / Action**        | `--color-accent`                                   | `#000000`                       | High contrast for buttons, icons.   |
| **Hover / Active**         | `--color-hover`                                    | `#F5F5F5`                       | Gentle hover state background.      |
| **Success / Info / Error** | `--color-success`, `--color-info`, `--color-error` | `#22C55E`, `#3B82F6`, `#EF4444` | Optional for dashboards.            |

---

### 🧱 **Layout Tokens**

| Purpose             | Variable       | Value                        | Description                         |
| ------------------- | -------------- | ---------------------------- | ----------------------------------- |
| **Page Padding**    | `--space-page` | `4rem`                       | Generous whitespace around content. |
| **Card Padding**    | `--space-card` | `1.5rem`                     | Space inside cards/containers.      |
| **Grid Gap**        | `--space-gap`  | `2rem`                       | Default gap between sections.       |
| **Container Width** | `--max-width`  | `1200px`                     | Keeps layout centered and elegant.  |
| **Border Radius**   | `--radius`     | `0.5rem`                     | Lightly rounded for modern feel.    |
| **Shadow**          | `--shadow`     | `0 1px 3px rgba(0,0,0,0.05)` | Barely visible, for elevation.      |

---

### ✍️ **Typography**

| Role                 | Font                                    | Size        | Weight  | Style                            |
| -------------------- | --------------------------------------- | ----------- | ------- | -------------------------------- |
| **Headings (H1–H6)** | `Inter`, `Poppins`, or `Helvetica Neue` | 2rem → 1rem | 600     | Slight tracking (0.05em)         |
| **Body**             | `Inter`, `Open Sans`, `Roboto`          | 1rem        | 400     | Crisp and neutral                |
| **Small / Muted**    | same                                    | 0.875rem    | 400     | color: `var(--color-text-muted)` |
| **Buttons / Labels** | uppercase                               | 0.875rem    | 500–600 | letter-spacing: 0.1em            |

---

### 🧭 **Component Style Rules**

#### Buttons

```css
.btn {
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  background: var(--color-hover);
}

.btn-primary {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: white;
}
```

#### Cards / Panels

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-card);
  box-shadow: var(--shadow);
}
```

#### Inputs / Upload Boxes

```css
.input,
.upload-box {
  border: 1px dashed var(--color-border);
  padding: 1rem;
  border-radius: var(--radius);
  color: var(--color-text-muted);
  background: white;
  transition: border 0.2s ease;
}

.input:focus,
.upload-box:hover {
  border-color: var(--color-accent);
}
```

#### Navbars / Headers

```css
.navbar {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
  padding: 1rem 2rem;
}

.nav-link {
  color: var(--color-text);
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.nav-link:hover {
  color: var(--color-accent);
}
```

---

### 🧠 **UI Personality Summary**

> “Neutral foundation, premium finish, adaptive structure.”
> Everything should look **breathable**, **mathematically aligned**, and **visually balanced** — perfect for **dashboards, SaaS apps, eCommerce, or landing pages**.

---

### ⚡ Tailwind Example Preset

You can mirror the same style in Tailwind by adding this theme to your config:

```js
theme: {
  extend: {
    colors: {
      bg: "#ffffff",
      surface: "#fafafa",
      border: "#e5e5e5",
      text: "#111111",
      muted: "#666666",
      accent: "#000000",
      hover: "#f5f5f5",
    },
    borderRadius: {
      lg: "0.5rem",
    },
    boxShadow: {
      soft: "0 1px 3px rgba(0,0,0,0.05)",
    },
  },
}
```
