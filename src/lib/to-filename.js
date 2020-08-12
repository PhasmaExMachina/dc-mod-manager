export default  name =>
    name.replace(/[^a-zA-Z0-9\s]/g, '')
    .toLowerCase()
    .replace(/^\s*/, '')
    .replace(/\s*$/, '')
    .replace(/\s\s/g, ' ')
    .replace(/\s/g, '-')