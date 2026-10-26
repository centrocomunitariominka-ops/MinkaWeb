export const DEFAULT_HERO_BACKGROUND = "#f18d21";

export function getHeroBackgroundCss(value) {
  return value || DEFAULT_HERO_BACKGROUND;
}

export const DEFAULT_HERO_GRADIENT =
  "linear-gradient(150deg, var(--yellow) 0%, var(--orange) 75%)";
