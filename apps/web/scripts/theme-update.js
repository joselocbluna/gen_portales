const fs = require('fs');
const filepath = '/Users/joslop/Documents/CBLUNA/proyectos/gen_portales/apps/web/src/components/editor/SidebarRight.tsx';

if (!fs.existsSync(filepath)) {
    console.error('File not found:', filepath);
    process.exit(1);
}

let content = fs.readFileSync(filepath, 'utf8');

// Container & Header
content = content.replace(/className="w-72 bg-white border-l border-slate-200/g, 'className="w-72 bg-[#0f172a] border-l border-[#1e293b]');
content = content.replace(/className="h-14 border-b border-slate-200/g, 'className="h-14 border-b border-[#1e293b] bg-[#0b1120]');
content = content.replace(/text-slate-800/g, 'text-white');

// Dividers
content = content.replace(/border-slate-100/g, 'border-[#1e293b]');

// Inputs / Selects / Textareas generic styling
content = content.replace(/bg-white border border-slate-200/g, 'bg-[#1e293b] border-[#334155] text-slate-200');
content = content.replace(/bg-slate-50 border border-slate-200/g, 'bg-[#1e293b] border-[#334155] text-slate-200');

// Typography
content = content.replace(/text-slate-500/g, 'text-slate-400');
content = content.replace(/text-slate-600/g, 'text-slate-300');
content = content.replace(/text-slate-700/g, 'text-slate-200');

// Component specific background
content = content.replace(/bg-slate-50 border border-slate-200 rounded p-4/g, 'bg-[#0b1120] border border-[#1e293b] rounded-xl p-4');

// Swatches & Borders
content = content.replace(/border border-slate-200/g, 'border border-[#334155]');

// Re-write back
fs.writeFileSync(filepath, content);
console.log('SidebarRight.tsx updated for dark mode');
