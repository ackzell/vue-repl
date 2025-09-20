# Vue REPL Customizations

This document tracks the customizations made to the official @vue/repl for yehyecoa-vue integration.

## Key Customizations

### package.json
- **Name**: Changed from `@vue/repl` to `@calmecac-vue/repl`
- **Dependencies**: Updated to specific alpha versions for vue language tools
- **Monaco**: Pinned `monaco-editor-core` to exact version `0.52.2`

### src/store.ts (Major Enhancements)
- **Enhanced File class**: Added version tracking, lastModified timestamps, editorViewState
- **New exports**:
  - `Editor` type (union of Monaco and CodeMirror editors)
  - Enhanced `File` class with state management
  - `BatchUpdateOperation` type for bulk file operations
  - Generic type support for `ReplStore<E extends Editor>`
- **Store state exposure**: Better external control and state management patterns
- **Editor integration**: Improved Monaco/CodeMirror editor state handling

### src/monaco-editor.ts
- **New file**: Added dedicated Monaco editor export for external consumption

### Added Files
- **CUSTOMIZATIONS.md**: This documentation file
- **dist/** files: Built distribution files for package consumption
- **src/editor-composable.ts**: New composable for clean editor access patterns

### Editor Access Patterns
- **Legacy pattern**: Access via `store.editor` (maintained for backward compatibility)
- **New composable pattern**: Use `useReplEditor()` for cleaner separation of concerns
  - `getEditor()`: Get current editor instance
  - `setEditor(editor)`: Register editor instance
  - `clearEditor()`: Clear editor reference
  - `hasEditor()`: Check if editor is available
  - `withEditor(callback)`: Execute callback with editor if available
  - `editorRef`: Reactive readonly reference for watchers

#### ⚠️ **INCOMPLETE**: CodeMirror Integration
**Status**: The `useReplEditor()` composable currently only supports Monaco editor. 

**TODO before upstream contribution**:
1. **Extend editor types**: Update composable to handle `Editor` union type (Monaco | CodeMirror)
2. **CodeMirror component integration**: Add `setEditor()`/`clearEditor()` calls to `src/codemirror/CodeMirror.vue`
3. **Type safety**: Ensure composable methods work with both editor types
4. **Testing**: Verify real-time sync works with both Monaco and CodeMirror modes

**Current limitation**: Real-time collaboration and theme switching only work in Monaco mode.

### Dependencies
- **Vue Language Tools**: Using alpha versions (3.0.7-alpha.1) vs stable (3.0.7)
- **Monaco Editor**: Exact version pinning for stability

## API Migration Guide

### Editor Access Migration

For clean separation of concerns, prefer the new composable pattern over direct store access:

```typescript
// ❌ Legacy (still supported)
import { store } from '@calmecac-vue/repl'
const editor = store.editor

// ✅ New recommended pattern
import { useReplEditor } from '@calmecac-vue/repl'
const { getEditor, withEditor, hasEditor } = useReplEditor()

// Safe editor access with type checking
withEditor((editor) => {
  editor.getModel()?.setValue('new content')
})

// Check availability
if (hasEditor()) {
  const editor = getEditor()
  // Use editor safely
}
```

### Benefits of New Pattern
- **Separation of concerns**: Editor logic separate from store
- **Type safety**: Better TypeScript integration  
- **Reactive**: Built on Vue's composition API
- **Cleaner**: No direct store dependencies
- **Future-proof**: Enables advanced features like theme switching

## Conflict Resolution Guide

When merging upstream updates:

1. **Always preserve**:
   - Package name `@calmecac-vue/repl`
   - Enhanced File class with version tracking
   - New export types (Editor, BatchUpdateOperation)
   - Generic type parameters in store interfaces
   - New editor composable exports

2. **Review carefully**:
   - Dependencies - keep our alpha versions if needed
   - Store.ts - preserve our state management enhancements
   - New methods and properties in File class
   - Editor composable integration points

3. **Safe to merge**:
   - Bug fixes in compilation logic
   - New Vue features and improvements

4. **Before contributing upstream**:
   - Complete CodeMirror integration in editor composable
   - Test both Monaco and CodeMirror modes thoroughly
   - Update type definitions to handle Editor union type
   - Performance optimizations

## Last Upstream Sync
- Date: 2025-09-20
- Upstream version: 4.7.0
- Our base: forked from expose-editor branch
- Total diff: ~586 lines of changes in store.ts alone