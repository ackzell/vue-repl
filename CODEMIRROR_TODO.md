# CodeMirror Integration TODO

This file tracks the remaining work needed to complete CodeMirror support in the editor composable.

## Current Status
- ✅ Monaco editor fully supported in `useReplEditor()`
- ❌ CodeMirror editor not yet integrated
- ❌ Editor union type not implemented in composable

## Required Changes

### 1. Update Editor Types in `editor-composable.ts`
```typescript
// Current (Monaco only)
type MonacoEditor = editor.IStandaloneCodeEditor
const currentEditor: Ref<MonacoEditor | undefined> = ref()

// Required (Both editors)
import type { Editor } from './store'  // Already defined as union type
const currentEditor: Ref<Editor | undefined> = ref()
```

### 2. Add Integration to `codemirror/CodeMirror.vue`
Similar to how Monaco.vue integrates:
```typescript
import { useReplEditor } from '../editor-composable'

const { setEditor, clearEditor } = useReplEditor()

onMounted(() => {
  // After CodeMirror editor creation
  setEditor(editor)  // Register the CodeMirror editor instance
})

onBeforeUnmount(() => {
  clearEditor()
})
```

### 3. Update Function Signatures
Ensure all composable functions handle both editor types:
- `getEditor()`: Return `Editor | undefined`
- `setEditor()`: Accept `Editor` parameter
- `withEditor()`: Callback receives `Editor` parameter

### 4. Type Guards (if needed)
Add utility functions to distinguish editor types:
```typescript
function isMonacoEditor(editor: Editor): editor is editor.IStandaloneCodeEditor {
  return 'getModel' in editor
}

function isCodeMirrorEditor(editor: Editor): editor is CodeMirror.Editor {
  return 'getDoc' in editor
}
```

### 5. Testing Checklist
- [ ] Real-time sync works with CodeMirror mode
- [ ] Theme switching works with CodeMirror (if implemented)
- [ ] Editor state persistence works with both modes
- [ ] No type errors when switching between Monaco/CodeMirror
- [ ] Backward compatibility maintained

## Priority
**Medium** - Current Monaco-only implementation covers the primary use case, but CodeMirror support is needed for:
- Full feature parity
- Upstream contribution readiness
- User choice between editor types