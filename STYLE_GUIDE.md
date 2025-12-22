
# Unmute Design System
## Premium Apple-Level Craft

### Design Philosophy
- **Trust-first**: Every interaction builds confidence
- **Calm**: No FOMO mechanics, no red dots, no anxiety
- **Privacy-by-default**: Visible only when Open
- **Warm minimalism**: Soft colors, generous whitespace

---

## Color Tokens

### Primary Brand
- **Primary**: `#5A9B8F` - Main teal accent
- **Primary Dark**: `#3F7269` - Darker teal for gradients/pressed states
- **Primary Light**: `#A8C9C1` - Lighter teal for highlights

### Backgrounds
- **Background**: `#FDFCFB` - Main app background (warm white)
- **Surface**: `#F9F6F3` - Cards, inputs (warm off-white)
- **Surface 2**: `#F5F1ED` - Disabled states, subtle backgrounds

### Text Hierarchy
- **Text Primary**: `#2D2A27` - Main text (warm dark gray, NOT black)
- **Text Secondary**: `#5A5248` - Supporting text
- **Text Tertiary**: `#6B6259` - De-emphasized text
- **Placeholder**: `#CEC7BE` - Input placeholders, disabled text

### Borders & Dividers
- **Border**: `#E8DFD8` - Soft, warm border color

### Status Colors
- **Danger**: `#B42318` - Use subtly for critical actions
- **Danger BG**: `#FEE4E2` - Background for danger states
- **Success**: `#10B981` - Positive feedback
- **Warning**: `#F59E0B` - Testing/accent features

### Special
- **Info BG**: `#E8F3F1` - Highlight boxes, secondary surfaces

---

## Typography

**Font**: System font (Inter-like)

### Scale
- **H1**: 34px / 40px line-height, Semibold (600), -0.5 letter-spacing
  - Use for: Main screen titles
- **H2**: 24px / 30px line-height, Semibold (600), -0.3 letter-spacing
  - Use for: Section headers, card titles
- **Body**: 16px / 26px line-height, Regular (400), 0 letter-spacing
  - Use for: Main content, descriptions
- **Caption**: 13px / 18px line-height, Regular (400), 0 letter-spacing
  - Use for: Helper text, metadata, timestamps

### Rules
- No random font sizes
- Maintain hierarchy: H1 > H2 > Body > Caption
- Use Semibold (600) for emphasis, not Bold (700)

---

## Spacing Scale

```
xs:      4px
sm:      8px
md:     12px
lg:     16px
xl:     20px
xxl:    24px
xxxl:   32px
huge:   40px
massive: 48px
```

### Application
- Screen padding: 24px horizontal
- Card padding: 20-24px
- Button padding: 16px vertical, 24px horizontal
- Gap between elements: 12-16px typically

---

## Border Radius

```
xs:   4px
sm:   8px
md:  12px
lg:  16px
xl:  20px
xxl: 24px
round: 9999px (fully rounded)
```

### Application
- Buttons: 20px (xl)
- Cards: 20px (xl)
- Inputs: 20px (xl)
- Chips: 9999px (round/pill)
- Small icons: 12-16px

---

## Shadows

Soft, subtle shadows using warm shadow color `rgba(45, 42, 39, 0.08)`

### Presets
- **sm**: offset (0, 1), opacity 0.5, radius 2
- **md**: offset (0, 2), opacity 0.6, radius 4
- **lg**: offset (0, 4), opacity 0.7, radius 8
- **xl**: offset (0, 8), opacity 0.8, radius 12

### Application
- Cards: sm or md
- Buttons: md
- Floating elements: lg
- Modals: xl

---

## Components

### Buttons

#### Primary (Gradient)
- Background: Linear gradient `#5A9B8F` → `#3F7269`
- Text: White, Semibold 16px
- Padding: 16px vertical, 24px horizontal
- Border radius: 20px
- Shadow: md
- Min height: 56px
- States: default, pressed (scale 0.98), disabled (opacity 0.4), loading

#### Secondary (Flat)
- Background: Surface `#F9F6F3`
- Border: 1.5px solid `#E8DFD8`
- Text: Text Primary, Semibold 16px
- Same padding/radius as Primary
- States: default, pressed (border → Primary), disabled

#### Tertiary (Text Link)
- Background: Transparent
- Text: Primary color, Semibold 13px
- Underline on text
- No border, minimal padding

#### Danger
- Background: `#B42318`
- Text: White, Semibold 16px
- Same structure as Primary
- Use sparingly

### Cards
- Background: Surface `#F9F6F3`
- Border: 1px solid `#E8DFD8`
- Border radius: 20px
- Padding: 20-24px
- Shadow: sm or md

### Inputs
- Background: Surface `#F9F6F3`
- Border: 1.5px solid `#E8DFD8`
- Border radius: 20px
- Padding: 16px vertical, 20px horizontal
- Focus state: Border → Primary, subtle shadow

### Chips
- Border radius: 9999px (pill)
- Padding: 8px vertical, 16px horizontal
- Default: Surface background, Border
- Selected: Info BG background, Primary border, Primary text (Semibold)
- Removable: Include "x" icon on right

### Toggle/Open Ring
- Size: 220px diameter
- Breathing animation: 4.5s duration
  - Scale: 1 → 1.03 → 1
  - Opacity: 0.18 → 0.28 → 0.18
- Gradient when Open: `#4A7D73` → `#5A9B8F`
- Disabled when Closed: Surface 2 background
- Premium feel: calm, not "glowy"

### Bottom Fixed CTA
- Position: Sticky at bottom
- Background: Background color
- Border top: 1px solid Border
- Padding: 20px horizontal, 24px vertical
- Shadow: Subtle top shadow

---

## Icon System

**Style**: Stroke icons (Lucide-like)
- Stroke weight: 2px
- Rounded joins and caps

### Sizes
- **Inline**: 20px (within text/buttons)
- **Standard**: 24px (UI elements)
- **Hero**: 32px (feature highlights)

### Usage
- Use IconSymbol component
- Emoji only inside interest tiles/chips
- Consistent stroke weight across all icons

---

## Screen Patterns

### Onboarding
- 1-screen layouts (no unnecessary scrolling)
- Large hero icon at top (140px circle)
- Title (H1) + Subtitle (Body)
- Clear hierarchy with generous whitespace
- Bottom fixed CTA with pagination dots
- Back button: 40px circle, Primary background, top-left

### Main Open/Closed Screen
- Centered circular control (220px)
- Breathing animation when Open
- Timer display: "Session ends at [time]" (not "auto-closes")
- Actions: "Close now" • "Extend +30 min"
- Reassurance text without clutter
- Interest chips below

### Match Flows
- Modal presentation (slide up)
- Drag handle at top
- Close button: top-right, 32px circle
- Profile section: Avatar (80px) + Name + Location
- Shared interests: Pill chips
- Info boxes: Icon + Text, Info BG background
- Bottom CTA: Fixed, Primary button + Secondary option

---

## Microcopy Guidelines

### Tone
- Confident, not technical
- Warm, not corporate
- Clear, not vague

### Examples
- ✅ "Session ends in 44 min"
- ❌ "Session auto-closes in 44 minutes"

- ✅ "You're open to connect"
- ❌ "Status: Open"

- ✅ "Say hi for real"
- ❌ "Initiate real-world interaction"

---

## Animation

### Timing
- Fast: 150ms (micro-interactions)
- Standard: 300ms (transitions)
- Slow: 500ms (page transitions)
- Breathing: 4500ms (Open ring)

### Easing
- Spring: damping 20, stiffness 120
- Use native driver when possible

---

## Accessibility

### Tap Targets
- Minimum: 44px × 44px
- Buttons: 56px height minimum
- Icons: 32px minimum for interactive

### Contrast
- Text Primary on Background: High contrast
- Text Secondary on Background: Readable
- No "washed out" text
- Test all text for readability

---

## Platform Considerations

### iOS
- Use SF Symbols via IconSymbol
- Native feel with system fonts
- Haptic feedback on interactions

### Android
- Material icons via IconSymbol
- Consistent with iOS design
- Slightly more padding at top (notch)

---

## Don'ts

❌ No black backgrounds (light theme only)
❌ No FOMO mechanics (badges, red dots, streaks)
❌ No exact location sharing
❌ No in-app chat history
❌ No follower counts
❌ No random font sizes
❌ No harsh shadows
❌ No overly bright/saturated colors
❌ No anxiety-inducing UI patterns

---

## Implementation Checklist

- [ ] All colors from design tokens
- [ ] Typography scale applied consistently
- [ ] Spacing scale used (no magic numbers)
- [ ] Border radius consistent
- [ ] Shadows soft and subtle
- [ ] Buttons follow component spec
- [ ] Cards follow component spec
- [ ] Inputs follow component spec
- [ ] Icons consistent stroke weight
- [ ] Tap targets minimum 44px
- [ ] Microcopy confident and clear
- [ ] Animations smooth and purposeful
- [ ] No FOMO mechanics
- [ ] Privacy-first messaging
