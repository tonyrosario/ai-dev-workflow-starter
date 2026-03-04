#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 1

RESULT=$(npx tsc --noEmit 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "TypeScript errors after editing $FILE_PATH:" >&2
  echo "$RESULT" | head -30 >&2
  exit 2
fi

exit 0
