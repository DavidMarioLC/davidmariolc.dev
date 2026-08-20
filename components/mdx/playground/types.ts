import type {
  SandpackFiles,
  SandpackPredefinedTemplate,
} from "@codesandbox/sandpack-react";

export type PlaygroundTemplate = Extract<
  SandpackPredefinedTemplate,
  "static" | "react" | "vanilla"
>;

export interface PlaygroundProps {
  files: SandpackFiles;
  showPreview?: boolean;
  template?: PlaygroundTemplate;
  title?: string;
}
