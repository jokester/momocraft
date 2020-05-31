declare module 'accept-language-parser' {
  interface ParsedLanguage {
    code: string;
    region?: string;
    quality: number;
  }
  export function parse(acceptHeader: string): ParsedLanguage[];
}
