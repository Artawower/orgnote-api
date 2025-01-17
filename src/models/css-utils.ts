import { ThemeVariable } from './theme-variables';

export type GetCssVar = (varName: string) => string;

export type GetCssTheme = (variableNames: string[]) => {
  [key in ThemeVariable]?: string;
};

export type GetNumericCssVar = (varName: string) => number;

export type GetCssProperty = (element: Element, propertyName: string) => string;

export type GetCssNumericProperty = (
  element: Element,
  propertyName: string
) => number;

export type ApplyCSSVariables<T extends string> = (variables: {
  [key in T]?: string | number;
}) => void;

export type ResetCSSVariables<T extends string> = (variables: {
  [key in T]?: string | number;
}) => void;
