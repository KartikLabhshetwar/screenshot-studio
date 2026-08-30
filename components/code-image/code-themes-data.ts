export interface SyntaxPalette {
  foreground: string;
  constant?: string;
  string?: string;
  comment?: string;
  keyword?: string;
  parameter?: string;
  function?: string;
  stringExpression?: string;
  punctuation?: string;
  link?: string;
  number?: string;
  property?: string;
}

export interface CodeThemeSource {
  id: string;
  name: string;
  from: string;
  to: string;
  light: SyntaxPalette;
  dark: SyntaxPalette;
}

export const CODE_THEME_SOURCES: CodeThemeSource[] = [
  {
    id: "sand",
    name: "Sand",
    from: "#EED5B6",
    to: "#AF8856",
    light: { foreground: "#262217", constant: "#A28C4E", string: "#A28C4E", comment: "#C4B39C", keyword: "#906937", parameter: "#DA8744", function: "#DA8744", stringExpression: "#C57416", punctuation: "#DA8744", link: "#DA8744", number: "#A28C4E", property: "#A28C4E" },
    dark: { foreground: "#FFFFFF", constant: "#C2B181", string: "#C2B181", comment: "#837E77", keyword: "#D3B48C", parameter: "#F4A361", function: "#F4A361", stringExpression: "#EED5B8", punctuation: "#F4A361", link: "#F4A361", number: "#C2B181", property: "#C2B181" },
  },
  {
    id: "forest",
    name: "Forest",
    from: "#506853",
    to: "#213223",
    light: { foreground: "#262217", constant: "#55725A", string: "#828069", comment: "#869288", keyword: "#6A8458", parameter: "#6B8F71", function: "#4B8042", stringExpression: "#9D891C", punctuation: "#78876E", link: "#78876E", number: "#78876E", property: "#2E382F" },
    dark: { foreground: "#FFFFFF", constant: "#6B8F71", string: "#C9C8BC", comment: "#555E56", keyword: "#AAB4A3", parameter: "#6B8F71", function: "#87B882", stringExpression: "#CCBD6E", punctuation: "#AAB4A3", link: "#AAB4A3", number: "#AAB4A3", property: "#C9C7BC" },
  },
  {
    id: "mono",
    name: "Mono",
    from: "#333",
    to: "#181818",
    light: { foreground: "#111111", constant: "#666666", string: "#666666", comment: "#999999", keyword: "#666666", parameter: "#666666", function: "#111111", stringExpression: "#666666", punctuation: "#666666", link: "#666666", number: "#111111", property: "#666666" },
    dark: { foreground: "#ffffff", constant: "#a7a7a7", string: "#a7a7a7", comment: "#666666", keyword: "#a7a7a7", parameter: "#a7a7a7", function: "#ffffff", stringExpression: "#a7a7a7", punctuation: "#a7a7a7", link: "#a7a7a7", number: "#ffffff", property: "#a7a7a7" },
  },
  {
    id: "breeze",
    name: "Breeze",
    from: "#CF2F98",
    to: "#6A3DEC",
    light: { foreground: "#434447", constant: "#0B7880", string: "#886594", comment: "#8C828B", keyword: "#496EB8", parameter: "#C44170", function: "#C44170", stringExpression: "#886594", punctuation: "#C44170", link: "#625B6B", number: "#24805E", property: "#0B7880" },
    dark: { foreground: "#FFFFFF", constant: "#49E8F2", string: "#E9AEFE", comment: "#8A757D", keyword: "#6599FF", parameter: "#F8518D", function: "#F8518D", stringExpression: "#E9AEFE", punctuation: "#F8518D", link: "#ECFEEF", number: "#55E7B2", property: "#49E8F2" },
  },
  {
    id: "candy",
    name: "Candy",
    from: "#A58EFB",
    to: "#E9BFF8",
    light: { foreground: "#434447", constant: "#2286A6", string: "#B2762E", comment: "#8D949B", keyword: "#DC155E", parameter: "#009033", function: "#009033", stringExpression: "#B2762E", punctuation: "#d15a8b", link: "#d15a8b", number: "#676DFF", property: "#2286A6" },
    dark: { foreground: "#FFFFFF", constant: "#1AC8FF", string: "#DFD473", comment: "#807796", keyword: "#FF659C", parameter: "#1AC8FF", function: "#73DFA5", stringExpression: "#DFD473", punctuation: "#FF659C", link: "#FF659C", number: "#7A7FFD", property: "#1AC8FF" },
  },
  {
    id: "crimson",
    name: "Crimson",
    from: "#FF6363",
    to: "#733434",
    light: { foreground: "#685B5B", constant: "#C94F0A", string: "#836250", comment: "#978A8A", keyword: "#BE3B3B", parameter: "#9E7070", function: "#9E7070", stringExpression: "#836250", punctuation: "#BE3B3B", link: "#BE3B3B", number: "#C94F0A", property: "#D15510" },
    dark: { foreground: "#FEFDFD", constant: "#D15510", string: "#EBB99D", comment: "#895E60", keyword: "#EB6F6F", parameter: "#C88E8E", function: "#C88E8E", stringExpression: "#EBB99D", punctuation: "#EB6F6F", link: "#EB6F6F", number: "#FDA97A", property: "#D15510" },
  },
  {
    id: "falcon",
    name: "Falcon",
    from: "#BDE3EC",
    to: "#363654",
    light: { foreground: "#464C65", constant: "#839AA7", string: "#506483", comment: "#9DA4AD", keyword: "#5C827D", parameter: "#6A7C9F", function: "#6A7C9F", stringExpression: "#46615D", punctuation: "#5C827D", link: "#5C827D", number: "#AE6A65", property: "#839AA7" },
    dark: { foreground: "#FFFFFF", constant: "#799DB1", string: "#6A8697", comment: "#6D7E88", keyword: "#9AB6B2", parameter: "#6D88BB", function: "#6D88BB", stringExpression: "#789083", punctuation: "#9AB6B2", link: "#9AB6B2", number: "#BD9C9C", property: "#799DB1" },
  },
  {
    id: "meadow",
    name: "Meadow",
    from: "#59D499",
    to: "#A0872D",
    light: { foreground: "#54594D", constant: "#B6781B", string: "#837E50", comment: "#72806E", keyword: "#049649", parameter: "#798B52", function: "#798B52", stringExpression: "#837E50", punctuation: "#049649", link: "#049649", number: "#2C8801", property: "#B6781B" },
    dark: { foreground: "#FFFFFF", constant: "#E4B165", string: "#E9EB9D", comment: "#708B6C", keyword: "#6DD79F", parameter: "#B3D767", function: "#B3D767", stringExpression: "#E9EB9D", punctuation: "#6DD79F", link: "#6DD79F", number: "#46B114", property: "#E4B165" },
  },
  {
    id: "midnight",
    name: "Midnight",
    from: "#4CC8C8",
    to: "#202033",
    light: { foreground: "#434447", constant: "#766599", string: "#5F758F", comment: "#78808C", keyword: "#587678", parameter: "#2F788F", function: "#2F788F", stringExpression: "#5F758F", punctuation: "#587678", link: "#5A797A", number: "#2D8264", property: "#766599" },
    dark: { foreground: "#FFFFFF", constant: "#9681C2", string: "#6D86A4", comment: "#4A4C56", keyword: "#7DA9AB", parameter: "#51D0F8", function: "#51D0F8", stringExpression: "#6D86A4", punctuation: "#7DA9AB", link: "#7DA9AB", number: "#75D2B1", property: "#9681C2" },
  },
  {
    id: "raindrop",
    name: "Raindrop",
    from: "#8EC7FB",
    to: "#1C55AA",
    light: { foreground: "#687077", constant: "#007BA1", string: "#507683", comment: "#6E7780", keyword: "#008DAC", parameter: "#4F9488", function: "#4F9488", stringExpression: "#507683", punctuation: "#008DAC", link: "#008DAC", number: "#7459E1", property: "#007BA1" },
    dark: { foreground: "#E4F2FF", constant: "#008BB7", string: "#9DD8EB", comment: "#6C808B", keyword: "#2ED9FF", parameter: "#1AD6B5", function: "#1AD6B5", stringExpression: "#9DD8EB", punctuation: "#2ED9FF", link: "#2ED9FF", number: "#9984EE", property: "#008BB7" },
  },
  {
    id: "sunset",
    name: "Sunset",
    from: "#FFCF73",
    to: "#FF7A2F",
    light: { foreground: "#737568", constant: "#AD5A78", string: "#8C703C", comment: "#7A7055", keyword: "#A1642C", parameter: "#807410", function: "#807410", stringExpression: "#8C703C", punctuation: "#A1642C", link: "#A1642C", number: "#856F00", property: "#AD5A78" },
    dark: { foreground: "#FFFFFF", constant: "#E978A1", string: "#F9D38C", comment: "#878572", keyword: "#FFAF65", parameter: "#E2D66B", function: "#E2D66B", stringExpression: "#F9D38C", punctuation: "#FFAF65", link: "#FFAF65", number: "#E7CF55", property: "#E978A1" },
  },
  {
    id: "bitmap",
    name: "Bitmap",
    from: "#881616",
    to: "#F1393F",
    light: { foreground: "#685B5B", constant: "#C90028", string: "#836250", comment: "#B83737", keyword: "#D63838", parameter: "#5E4040", function: "#C90028", stringExpression: "#836250", punctuation: "#BE3B3B", link: "#BE3B3B", number: "#C94F0A", property: "#D15510" },
    dark: { foreground: "#FEFDFD", constant: "#E42B37", string: "#E42B37", comment: "#996B6D", keyword: "#EB6F6F", parameter: "#C88E8E", function: "#E42B37", stringExpression: "#EBB99D", punctuation: "#EB6F6F", link: "#EB6F6F", number: "#E42B37", property: "#E42B37" },
  },
  {
    id: "ice",
    name: "Ice",
    from: "#fff",
    to: "#80deea",
    light: { foreground: "#1C1B29", constant: "#00B0E9", string: "#6ABAD8", comment: "#BDC0C1", keyword: "#81909D", parameter: "#1E3C78", function: "#1E3C78", stringExpression: "#7BBCD8", punctuation: "#1E3C78", link: "#1E3C78", number: "#00B0E9", property: "#00B0E9" },
    dark: { foreground: "#FFFFFF", constant: "#92DEF6", string: "#92DEF6", comment: "#5C6A70", keyword: "#BFC4C9", parameter: "#778CB6", function: "#778CB6", stringExpression: "#89C3DC", punctuation: "#778CB6", link: "#778CB6", number: "#00B0E9", property: "#00B0E9" },
  },
  {
    id: "noir",
    name: "Noir",
    from: "#B1B1B1",
    to: "#181818",
    light: { foreground: "#111111", constant: "#666666", string: "#666666", comment: "#999999", keyword: "#666666", parameter: "#666666", function: "#111111", stringExpression: "#666666", punctuation: "#666666", link: "#666666", number: "#111111", property: "#666666" },
    dark: { foreground: "#ffffff", constant: "#a7a7a7", string: "#a7a7a7", comment: "#666666", keyword: "#a7a7a7", parameter: "#a7a7a7", function: "#ffffff", stringExpression: "#a7a7a7", punctuation: "#a7a7a7", link: "#a7a7a7", number: "#ffffff", property: "#a7a7a7" },
  },
];
