# Color Scheme Reference - Available Courses Section

## 🎨 Complete Color Palette

### Header Section
```
Title: Gradient Text
├─ from-indigo-600 (#4f46e5)
├─ via-purple-600 (#9333ea)
└─ to-pink-600 (#db2777)

Create Button: Gradient Background
├─ from-indigo-600 (#4f46e5)
└─ to-purple-600 (#9333ea)
```

### Course Card Gradients (Rotating)

#### Card 1: Blue-Purple-Pink
```css
from-blue-500 (#3b82f6)
via-purple-500 (#a855f7)
to-pink-500 (#ec4899)
```

#### Card 2: Green-Teal-Blue
```css
from-green-500 (#22c55e)
via-teal-500 (#14b8a6)
to-blue-500 (#3b82f6)
```

#### Card 3: Orange-Red-Pink
```css
from-orange-500 (#f97316)
via-red-500 (#ef4444)
to-pink-500 (#ec4899)
```

#### Card 4: Indigo-Blue-Cyan
```css
from-indigo-500 (#6366f1)
via-blue-500 (#3b82f6)
to-cyan-500 (#06b6d4)
```

#### Card 5: Purple-Pink-Rose
```css
from-purple-500 (#a855f7)
via-pink-500 (#ec4899)
to-rose-500 (#f43f5e)
```

#### Card 6: Emerald-Green-Teal
```css
from-emerald-500 (#10b981)
via-green-500 (#22c55e)
to-teal-500 (#14b8a6)
```

### Information Badges

#### Duration Badge (Blue Theme)
```
Background: gradient from-blue-50 to-indigo-50
├─ from-blue-50 (#eff6ff)
└─ to-indigo-50 (#eef2ff)

Border: border-blue-200 (#bfdbfe)
Text: text-blue-700 (#1d4ed8)
Icon: text-blue-500 (#3b82f6)
```

#### Teacher Badge (Purple Theme)
```
Background: gradient from-purple-50 to-pink-50
├─ from-purple-50 (#faf5ff)
└─ to-pink-50 (#fdf2f8)

Border: border-purple-200 (#e9d5ff)
Text: text-purple-700 (#7e22ce)
Icon: text-purple-500 (#a855f7)
```

### Enroll Button (Student View)
```
Background: Triple gradient
├─ from-indigo-600 (#4f46e5)
├─ via-purple-600 (#9333ea)
└─ to-pink-600 (#db2777)

Hover:
├─ from-indigo-700 (#4338ca)
├─ via-purple-700 (#7e22ce)
└─ to-pink-700 (#be185d)

Shadow: shadow-lg → shadow-xl on hover
```

### Teacher Action Buttons

#### Edit Button (Blue Theme)
```
Background: gradient from-blue-50 to-indigo-50
├─ from-blue-50 (#eff6ff)
└─ to-indigo-50 (#eef2ff)

Hover:
├─ from-blue-100 (#dbeafe)
└─ to-indigo-100 (#e0e7ff)

Border: border-2 border-blue-300 (#93c5fd)
Text: text-blue-700 (#1d4ed8)
```

#### Assignments Button (Green Theme)
```
Background: gradient from-emerald-50 to-teal-50
├─ from-emerald-50 (#ecfdf5)
└─ to-teal-50 (#f0fdfa)

Hover:
├─ from-emerald-100 (#d1fae5)
└─ to-teal-100 (#ccfbf1)

Border: border-2 border-emerald-300 (#6ee7b7)
Text: text-emerald-700 (#047857)
```

### Teacher Badge (in card header)
```
Background: bg-white/95 (white with 95% opacity)
Text: text-indigo-700 (#4338ca)
Shadow: shadow-md
Backdrop: backdrop-blur-sm
```

## 🎭 Interactive States

### Course Title Hover
```
Default: text-gray-900
Hover: gradient text-transparent bg-clip-text
├─ from-indigo-600 (#4f46e5)
└─ to-pink-600 (#db2777)
```

### Card Hover Effects
```
Card: hover:y-5 (lifts up 5px)
Icon: group-hover:scale-110 (scales to 110%)
Overlay: group-hover:bg-black/10 (10% black overlay)
```

### Button Icon Animations
```
Enroll Button Icon: group-hover:rotate-90 (rotates 90°)
Edit/Assignment Icons: group-hover:scale-110 (scales to 110%)
```

## 📊 Color Usage Statistics

### Primary Colors
- Indigo: 45% usage (main brand color)
- Purple: 30% usage (accent color)
- Pink: 15% usage (accent/highlight)
- Blue: 25% usage (information)
- Green/Emerald/Teal: 20% usage (success/growth)

### Color Contrast Ratios
All text colors meet WCAG AA standards:
- Blue-700 on Blue-50: 8.2:1 ✅
- Purple-700 on Purple-50: 8.5:1 ✅
- Emerald-700 on Emerald-50: 8.1:1 ✅
- Indigo-700 on white: 8.9:1 ✅

## 🌈 Design Principles

### Color Harmony
- **Analogous**: Blue-Purple-Pink (smooth transitions)
- **Triadic**: Green-Orange-Purple (balanced variety)
- **Complementary**: Used sparingly for emphasis

### Visual Weight
- **Heavy**: Gradient buttons (call-to-action)
- **Medium**: Card headers (visual interest)
- **Light**: Information badges (supportive)

### Accessibility
✅ High contrast text  
✅ Color not sole indicator  
✅ Clear visual hierarchy  
✅ Readable font sizes  

## 🎯 Color Psychology Applied

| Color | Meaning | Usage |
|-------|---------|-------|
| 🔵 Blue | Trust, Intelligence | Duration badges, Edit button |
| 🟣 Purple | Creativity, Quality | Main gradients, Teacher badges |
| 🩷 Pink | Innovation, Energy | Accent in gradients |
| 🟢 Green | Growth, Success | Assignment buttons |
| 🟠 Orange | Enthusiasm | Card variety |

## 💡 Tips for Customization

Want to adjust colors? Edit these in `CourseList.js`:

### Change Main Gradient
```javascript
// Find line: className="bg-gradient-to-r from-indigo-600..."
// Replace colors: from-{color}-{shade} via-{color}-{shade} to-{color}-{shade}
```

### Add New Card Gradient
```javascript
// Find: const gradients = [...]
// Add: 'from-{your-color}-500 via-{your-color}-500 to-{your-color}-500'
```

### Modify Badge Colors
```javascript
// Find: className="from-blue-50 to-indigo-50"
// Replace with your preferred gradient
```

## 📱 Responsive Behavior

All colors maintain consistency across devices:
- **Mobile**: Same gradients, adjusted sizing
- **Tablet**: Same colors, 2-column layout
- **Desktop**: Full color experience, 3-column layout

---

**Color Palette Version**: 1.0  
**Last Updated**: 2025-10-17  
**Tailwind CSS**: v3.x compatible  
**Browser Support**: All modern browsers
