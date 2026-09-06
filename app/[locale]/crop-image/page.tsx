import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { buildToolMetadata } from "@/lib/seo/tool-metadata";
import { requireTool } from "@/lib/seo/tools";

const tool = requireTool("/crop-image");

export const metadata: Metadata = buildToolMetadata(tool);

export default function CropImagePage() {
  return <ToolPage tool={tool} />;
}
