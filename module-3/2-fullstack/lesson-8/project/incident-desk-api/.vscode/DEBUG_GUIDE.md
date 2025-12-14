# VS Code Debugging Guide

This guide explains how to use the debugging configurations in `launch.json` for the Incident Desk API.

## What is Debugging?

Debugging allows you to:

- Pause your code at specific lines (breakpoints)
- Inspect variable values
- Step through code line by line
- Find and fix bugs more easily

## Available Debug Configurations

### 1. 🔌 Attach to Debug

**When to use:** Your server is already running in a terminal

**How it works:**

- Your app must be running with the debug flag enabled (usually port 9229)
- VS Code connects to the running process
- You can debug without restarting the server

**Steps:**

1. Start your server in a terminal: `npm run dev` (if configured with debug mode)
2. In VS Code, go to Run & Debug (⌘+Shift+D)
3. Select "Attach to Debug" from the dropdown
4. Click the green play button ▶️
5. VS Code attaches to your running server

**Configuration Details:**

```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Debug",
  "port": 9229,
  "restart": true
}
```

- **Port 9229:** The default Node.js debug port
- **restart: true:** Automatically reconnects when server restarts

---

### 2. 🚀 Launch Debug

**When to use:** You want VS Code to start and debug the server for you

**How it works:**

- VS Code starts your server automatically
- Runs the `npm run debug` command
- Everything happens in VS Code's integrated terminal

**Steps:**

1. In VS Code, go to Run & Debug (⌘+Shift+D)
2. Select "Launch Debug" from the dropdown
3. Click the green play button ▶️
4. VS Code starts your server with debugging enabled

**Configuration Details:**

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Debug",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "debug"]
}
```

- **runtimeExecutable: npm:** Uses npm to run commands
- **runtimeArgs:** Executes `npm run debug`

---

## Common Settings (Both Configs)

### Skip Node Internals

```json
"skipFiles": ["<node_internals>/**"]
```

Prevents stepping into Node.js internal code. Keeps you focused on YOUR code.

### Source Maps

```json
"sourceMaps": true
```

Allows debugging TypeScript files directly instead of compiled JavaScript.

### Resolve Source Map Locations

```json
"resolveSourceMapLocations": [
  "${workspaceFolder}/**",
  "!**/node_modules/**"
]
```

Only use source maps from your project, not from dependencies.

---

## How to Set Breakpoints

1. Open any TypeScript file in `src/`
2. Click in the gutter (left of line numbers)
3. A red dot appears = breakpoint is set
4. When code reaches that line, execution pauses

## Debug Controls

When debugging is active:

- **Continue (F5):** Resume execution until next breakpoint
- **Step Over (F10):** Execute current line and move to next
- **Step Into (F11):** Go inside function calls
- **Step Out (⇧F11):** Exit current function
- **Restart (⇧⌘F5):** Restart the debugging session
- **Stop (⇧F5):** Stop debugging

## Debugging Variables

When paused at a breakpoint:

- **Variables panel:** View all local variables
- **Watch panel:** Add expressions to monitor
- **Call Stack:** See function call history
- **Debug Console:** Execute code in current context

---

## Quick Start

### Option 1: Quick Debug (Recommended for beginners)

1. Press **F5**
2. Choose "Launch Debug"
3. Start debugging immediately!

### Option 2: Attach to Running Server

1. Terminal: `npm run dev` (with inspect flag)
2. VS Code: Select "Attach to Debug"
3. Press **F5**

---

## Tips & Tricks

✅ **Use "Launch Debug"** when starting fresh  
✅ **Use "Attach to Debug"** when server is already running  
✅ **Add logpoints** instead of `console.log()` (right-click breakpoint)  
✅ **Use conditional breakpoints** (right-click → Edit Breakpoint)

---

## Troubleshooting

### Can't attach to debug?

- Make sure your server is running with `--inspect` flag
- Check that port 9229 is not blocked
- Verify no other process is using the debug port

### Source maps not working?

- Ensure `tsconfig.json` has `"sourceMap": true`
- Rebuild your project: `npm run build`

### Breakpoints not hitting?

- Make sure you're debugging the TypeScript files, not the compiled JS
- Check that source maps are enabled
- Verify your code is actually being executed

---

## Need Help?

- Press **⌘+Shift+P** and type "Debug" to see all debug commands
- Check [VS Code Debugging Docs](https://code.visualstudio.com/docs/editor/debugging)
- Review your `package.json` for debug scripts


