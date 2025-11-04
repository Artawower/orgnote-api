import { Nullable } from '../types/nullable';
import { ThemeVariable } from './theme-variables';

export type GetCssVar = (varName: string) => Nullable<string>;

export type GetCssTheme = (variableNames: string[]) => {
  [key in ThemeVariable]?: string;
};

export type GetNumericCssVar = (varName: string) => Nullable<number>;

export type GetCssProperty = (
  element: Element,
  propertyName: string
) => Nullable<string>;

export type GetCssNumericProperty = (
  element: Element,
  propertyName: string
) => Nullable<number>;

export type ApplyCSSVariables<T extends string> = (variables: {
  [key in T]?: string | number;
}) => void;

export type ResetCSSVariables<T extends string> = (variables: {
  [key in T]?: string | number;
}) => void;
