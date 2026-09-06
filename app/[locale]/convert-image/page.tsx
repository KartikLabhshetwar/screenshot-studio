import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { buildToolMetadata } from "@/lib/seo/tool-metadata";
import { requireTool } from "@/lib/seo/tools";

const tool = requireTool("/convert-image");

export const metadata: Metadata = buildToolMetadata(tool);

export default function ConvertImagePage() {
  return <ToolPage tool={tool} />;
}
