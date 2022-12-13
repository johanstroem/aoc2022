function getCharValue(char: string) {
    const UPPERCASE_RANGE = [...Array(91).keys()].slice(65);
    const LOWERCASE_RANGE = [...Array(123).keys()].slice(97);
  
    const charCodeValue = char.charCodeAt(0);
    if (UPPERCASE_RANGE.includes(charCodeValue)) return charCodeValue - 38;
    if (LOWERCASE_RANGE.includes(charCodeValue)) return charCodeValue - 96;
    return 0;
  }

  export default getCharValue