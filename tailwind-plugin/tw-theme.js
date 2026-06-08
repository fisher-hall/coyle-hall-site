const plugin = require("tailwindcss/plugin");
const fs = require("fs");
const path = require("path");
const themePath = path.join(__dirname, "../data/theme.json");
const themeRead = fs.readFileSync(themePath, "utf8");
const themeConfig = JSON.parse(themeRead);

// Helper to extract a clean font name.
const findFont = (fontStr) =>
  fontStr.replace(/\+/g, " ").replace(/:[^:]+/g, "");

// Set font families dynamically, filtering out 'type' keys
const fontFamilies = Object.entries(themeConfig.fonts.font_family)
  .filter(([key]) => !key.includes("type"))
  .reduce((acc, [key, font]) => {
    acc[key] =
      `${findFont(font)}, ${themeConfig.fonts.font_family[`${key}_type`] || "sans-serif"}`;
    return acc;
  }, {});

const defaultColorGroups = [
  { colors: themeConfig.colors.default.theme_color, prefix: "" },
  { colors: themeConfig.colors.default.text_color, prefix: "" },
];
const darkColorGroups = [];
if (themeConfig.colors.darkmode?.theme_color) {
  darkColorGroups.push({
    colors: themeConfig.colors.darkmode.theme_color,
    prefix: "darkmode-",
  });
}
if (themeConfig.colors.darkmode?.text_color) {
  darkColorGroups.push({
    colors: themeConfig.colors.darkmode.text_color,
    prefix: "darkmode-",
  });
}

const getVars = (groups) => {
  const vars = {};
  groups.forEach(({ colors, prefix }) => {
    Object.entries(colors).forEach(([k, v]) => {
      const cssKey = k.replace(/_/g, "-");
      vars[`--color-${prefix}${cssKey}`] = v;
    });
  });
  return vars;
};

// Prefer canonical CSS variables from assets/css/colors.css when available.
const colorsPath = path.join(__dirname, "../assets/css/colors.css");
let cssContent = "";
try {
  cssContent = fs.readFileSync(colorsPath, "utf8");
} catch (e) {
  cssContent = "";
}
const cssVarRegex = /--([a-z0-9\-\_]+)\s*:\s*([^;]+);/gi;
const cssVars = {};
let _m;
while ((_m = cssVarRegex.exec(cssContent)) !== null) {
  cssVars[_m[1]] = _m[2].trim();
}
const cssVarOr = (name, fallback) => (cssVars[name] ? `var(--${name})` : fallback);

// Build theme color variables using the user's mapping and prefer colors.css tokens.
const defaultVars = {
  '--color-primary': cssVarOr('coyle-dark-green', themeConfig.colors.default.theme_color.primary),
  '--color-body': themeConfig.colors.default.theme_color.body || '#fff',
  '--color-border': themeConfig.colors.default.theme_color.border || '#eaeaea',
  '--color-light': themeConfig.colors.default.theme_color.light || '#ffffff',
  '--color-dark': themeConfig.colors.default.theme_color.dark || '#020202',
  '--color-text': cssVarOr('color-lightmode-gray', themeConfig.colors.default.text_color.text),
  '--color-text-dark': themeConfig.colors.default.text_color.text_dark || '#020202',
  '--color-text-light': themeConfig.colors.default.text_color.text_light || '#717171',
};

const darkVars = {
  '--color-darkmode-primary': cssVarOr('coyle-light-green', themeConfig.colors.darkmode?.theme_color?.primary || '#0A8A3F'),
  '--color-darkmode-body': themeConfig.colors.darkmode?.theme_color?.body || '#000000',
  '--color-darkmode-border': themeConfig.colors.darkmode?.theme_color?.border || '#3E3E3E',
  '--color-darkmode-light': themeConfig.colors.darkmode?.theme_color?.light || '#222222',
  '--color-darkmode-dark': themeConfig.colors.darkmode?.theme_color?.dark || '#ffffff',
  '--color-darkmode-text': cssVarOr('color-darkmode-gray', themeConfig.colors.darkmode?.text_color?.text || '#B4AFB6'),
  '--color-darkmode-text-dark': themeConfig.colors.darkmode?.text_color?.text_dark || '#ffffff',
  '--color-darkmode-text-light': themeConfig.colors.darkmode?.text_color?.text_light || '#B4AFB6',
};

const baseSize = Number(themeConfig.fonts.font_size.base);
const scale = Number(themeConfig.fonts.font_size.scale);
const calculateFontSizes = (base, scale) => {
  const sizes = {};
  let currentSize = scale;
  for (let i = 6; i >= 1; i--) {
    sizes[`h${i}`] = `${currentSize}rem`;
    sizes[`h${i}-sm`] = `${currentSize * 0.9}rem`;
    currentSize *= scale;
  }
  sizes.base = `${base}px`;
  sizes["base-sm"] = `${base * 0.8}px`;
  return sizes;
};
const fontSizes = calculateFontSizes(baseSize, scale);

const fontVars = {};
Object.entries(fontSizes).forEach(([key, value]) => {
  fontVars[`--text-${key}`] = value;
});
Object.entries(fontFamilies).forEach(([key, font]) => {
  fontVars[`--font-${key}`] = font;
});

const baseVars = { ...fontVars, ...defaultVars };

// Build a colorsMap including both sets
const colorsMap = {};
[...defaultColorGroups, ...darkColorGroups].forEach(({ colors, prefix }) => {
  Object.entries(colors).forEach(([key]) => {
    const cssKey = key.replace(/_/g, "-");
    colorsMap[prefix + cssKey] = `var(--color-${prefix}${cssKey})`;
  });
});

module.exports = plugin.withOptions(() => {
  return function ({ addBase, addUtilities, matchUtilities }) {
    // Default vars on :root; dark vars on .dark
    addBase({
      ":root": baseVars,
      ".dark": darkVars,
    });

    const fontUtils = {};
    Object.keys(fontFamilies).forEach((key) => {
      fontUtils[`.font-${key}`] = { fontFamily: `var(--font-${key})` };
    });
    Object.keys(fontSizes).forEach((key) => {
      fontUtils[`.text-${key}`] = { fontSize: `var(--text-${key})` };
    });
    addUtilities(fontUtils, {
      variants: ["responsive", "hover", "focus", "active", "disabled"],
    });

    matchUtilities(
      {
        bg: (value) => ({ backgroundColor: value }),
        text: (value) => ({ color: value }),
        border: (value) => ({ borderColor: value }),
        fill: (value) => ({ fill: value }),
        stroke: (value) => ({ stroke: value }),
      },
      { values: colorsMap, type: "color" },
    );

    matchUtilities(
      {
        from: (value) => ({
          "--tw-gradient-from": value,
          "--tw-gradient-via-stops":
            "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
          "--tw-gradient-stops":
            "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
        }),
        to: (value) => ({
          "--tw-gradient-to": value,
          "--tw-gradient-via-stops":
            "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
          "--tw-gradient-stops":
            "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
        }),
        via: (value) => ({
          "--tw-gradient-via": value,
          "--tw-gradient-via-stops":
            "var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)",
        }),
      },
      { values: colorsMap, type: "color" },
    );
  };
});
