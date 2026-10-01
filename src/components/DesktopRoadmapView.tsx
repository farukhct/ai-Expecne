import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  FolderTree,
  Cpu,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MASTER_PROMPT_TEXT, ROADMAP_SECTIONS } from '../data/roadmapAndMasterPrompt';

export const DesktopRoadmapView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'roadmap' | 'electron_files'>('prompt');

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(MASTER_PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleElectronMain = `// electron/main.ts
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import Database from 'better-sqlite3';

let mainWindow: BrowserWindow | null = null;
let db: Database.Database | null = null;

function initDatabase() {
  const dbDir = path.join(app.getPath('userData'), 'Data');
  const dbPath = path.join(dbDir, 'EXPANCE.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  // Run migrations from database/schema.sql
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1280,
    minHeight: 768,
    title: 'EXPANCE - Personal Finance & Bike Management System',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();
});

// IPC Handler example
ipcMain.handle('db:query', (event, { sql, params }) => {
  const stmt = db!.prepare(sql);
  return stmt.all(...(params || []));
});`;

  const sampleElectronPreload = `// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  queryDatabase: (sql: string, params: any[]) => ipcRenderer.invoke('db:query', { sql, params }),
  executeTransaction: (operations: any[]) => ipcRenderer.invoke('db:transaction', operations),
  saveBackup: () => ipcRenderer.invoke('db:backup'),
  restoreBackup: () => ipcRenderer.invoke('db:restore'),
  printDocument: () => ipcRenderer.invoke('window:print'),
});`;

  const sampleElectronBuilderYml = `# electron-builder.yml
appId: com.expance.desktop
productName: EXPANCE
directories:
  output: dist-electron
files:
  - out/**/*
  - electron/**/*
win:
  target:
    - target: nsis
      arch:
        - x64
  icon: public/favicon.ico
nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true
  shortcutName: EXPANCE Finance & Bike Management`;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-700" />
            Full-Stack Desktop Architecture & Synthesis
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Windows Desktop Application Master Blueprint
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive roadmap, master LLM prompt, and Electron + Next.js + SQLite integration files.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'prompt' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Master Prompt
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'roadmap' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            8-Phase Roadmap
          </button>
          <button
            onClick={() => setActiveTab('electron_files')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'electron_files' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Electron Scaffolding
          </button>
        </div>
      </div>

      {/* TAB 1: MASTER PROMPT */}
      {activeTab === 'prompt' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Ready-to-Use Master Prompt for AI & Desktop Engineers
              </h2>
              <p className="text-xs text-slate-500">
                Paste this master prompt into any AI agent, Claude, or ChatGPT to generate the Electron desktop application.
              </p>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Prompt!' : 'Copy Master Prompt'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs max-h-[500px] overflow-y-auto leading-relaxed border border-slate-800 selection:bg-emerald-700">
            <pre className="whitespace-pre-wrap">{MASTER_PROMPT_TEXT}</pre>
          </div>
        </div>
      )}

      {/* TAB 2: 8-PHASE ACTIONABLE ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 font-medium">
            Structured 8-week production schedule from local SQLite schema setup through NSIS Windows installer compilation.
          </div>

          <div className="space-y-3">
            {ROADMAP_SECTIONS.map((sec, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-emerald-600 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">{sec.phase}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {sec.duration}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {sec.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-slate-700 mb-1">Key Objectives:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {sec.goals.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700 mb-1">Generated Files & Artifacts:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {sec.artifacts.map((a, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded bg-slate-100 font-mono text-[11px] text-slate-700 border border-slate-200"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ELECTRON FILES */}
      {activeTab === 'electron_files' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-4 text-xs">
            <div>
              <div className="font-bold text-sm text-slate-900 mb-1">
                Electron Main Process (electron/main.ts)
              </div>
              <p className="text-slate-500 mb-2">
                Coordinates Windows desktop window, SQLite connection via better-sqlite3, and secure IPC.
              </p>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono overflow-x-auto">
                <pre>{sampleElectronMain}</pre>
              </div>
            </div>

            <div>
              <div className="font-bold text-sm text-slate-900 mb-1">
                Electron Preload Bridge (electron/preload.ts)
              </div>
              <p className="text-slate-500 mb-2">
                Exposes typed safe window.electronAPI to Next.js renderer without breaking contextIsolation.
              </p>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono overflow-x-auto">
                <pre>{sampleElectronPreload}</pre>
              </div>
            </div>

            <div>
              <div className="font-bold text-sm text-slate-900 mb-1">
                Windows NSIS Installer Packaging (electron-builder.yml)
              </div>
              <p className="text-slate-500 mb-2">
                Compiles standalone offline EXPANCE-Setup-x64.exe with desktop & start menu shortcuts.
              </p>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono overflow-x-auto">
                <pre>{sampleElectronBuilderYml}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
