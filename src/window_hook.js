const version = { major: 0, minor: 0, rev: 1 };
const versionStr = `${version.major}.${version.minor}.${version.rev}`;
const scriptContent = `
window.__TRACE_EXTENSION_HOOK__ = {
    getVersion: () => (JSON.parse('${JSON.stringify(version)}')),
    getVersionStr: () => ('${versionStr}'),
}
`;

const script = document.createElement('script');
script.textContent = scriptContent;

document.documentElement.appendChild(script);
script.parentNode.removeChild(script);

console.log(`TRACE Browser Extension v${versionStr}`);
