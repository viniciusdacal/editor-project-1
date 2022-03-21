import { Editor, BaseOperation } from 'slate';
import { HistoryEditor } from 'slate-history';

type ApplyFN = (operation: BaseOperation) => void;

const withCollaboration = <T extends Editor>(
  editor: T,
  onChange: (operation: BaseOperation) => void
): [T, ApplyFN] => {
  const e = editor as T & HistoryEditor;
  const { apply } = e;

  e.apply = (operation) => {
    apply(operation);
    onChange(operation);
  };

  return [editor, apply] as [T, ApplyFN];
};

export default withCollaboration;
