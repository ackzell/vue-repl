import type { editor } from 'monaco-editor-core'
import { readonly, ref, type Ref } from 'vue'

type MonacoEditor = editor.IStandaloneCodeEditor

// TODO: Extend to support full Editor union type (Monaco | CodeMirror)
// Currently only Monaco editor is supported. Before contributing upstream:
// 1. Import CodeMirror types and create Editor union type
// 2. Update all function signatures to handle both editor types  
// 3. Add setEditor/clearEditor integration to CodeMirror.vue component
// 4. Test real-time sync with both editor modes
const currentEditor: Ref<MonacoEditor | undefined> = ref()

/**
 * Composable for managing the Monaco editor instance
 * This provides a clean way to access the editor for features like:
 * - Real-time collaboration
 * - Theme swapping
 * - Custom actions and commands
 * - Editor state management
 * 
 * ⚠️ LIMITATION: Currently only supports Monaco editor
 * TODO: Extend to support CodeMirror as well (see store.ts Editor type)
 */
export function useReplEditor() {
  /**
   * Get the current editor instance
   */
  function getEditor(): MonacoEditor | undefined {
    return currentEditor.value
  }

  /**
   * Set the current editor instance (called internally by Monaco component)
   */
  function setEditor(editorInstance: MonacoEditor): void {
    currentEditor.value = editorInstance
  }

  /**
   * Clear the editor reference (cleanup)
   */
  function clearEditor(): void {
    currentEditor.value = undefined
  }

  /**
   * Check if editor is available
   */
  function hasEditor(): boolean {
    return !!currentEditor.value
  }

  /**
   * Execute an action with the editor if available
   */
  function withEditor<T>(callback: (editor: MonacoEditor) => T): T | undefined {
    const editor = currentEditor.value
    if (editor) {
      return callback(editor)
    }
    return undefined
  }

  return {
    getEditor,
    setEditor,
    clearEditor,
    hasEditor,
    withEditor,
    
    // Reactive reference for watchers (read-only)
    editorRef: readonly(currentEditor) as Readonly<Ref<MonacoEditor | undefined>>
  }
}

/**
 * Type-only export for editor instance
 */
export type { MonacoEditor }
