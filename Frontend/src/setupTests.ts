import '@testing-library/jest-dom';
const ORIGINAL_WARN = console.warn
const IGNORED_PATTERNS = [
  /React Router Future Flag Warning/
]

console.warn = (...args: any[]) => {
  const [first] = args
  if (typeof first === 'string' && IGNORED_PATTERNS.some(re => re.test(first))) {
    return
  }
  ORIGINAL_WARN(...args)
}