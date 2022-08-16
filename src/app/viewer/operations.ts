import type { ColorMaterial } from '@vertexvis/viewer';

export async function selectItem(
  viewer: HTMLVertexViewerElement,
  itemIds: string[]
): Promise<void> {
  const scene = await viewer.scene();
  await scene
    .items((op) => [
      op.where((q) => q.all()).deselect(),
      op.where((q) => q.withItemIds(itemIds)).select(),
    ])
    .execute();
}

export async function appendSelection(
  viewer: HTMLVertexViewerElement,
  itemIds: string[]
): Promise<void> {
  const scene = await viewer.scene();
  await scene
    .items((op) => op.where((q) => q.withItemIds(itemIds)).select())
    .execute();
}

export async function clearSelection(
  viewer: HTMLVertexViewerElement
): Promise<void> {
  const scene = await viewer.scene();
  await scene.items((op) => op.where((q) => q.all()).deselect()).execute();
}

export async function clearMaterialOverrides(
  viewer: HTMLVertexViewerElement
): Promise<void> {
  const scene = await viewer.scene();
  await scene
    .items((op) => op.where((q) => q.all()).clearMaterialOverrides())
    .execute();
}

export async function overrideMaterial(
  viewer: HTMLVertexViewerElement,
  itemIds: string[],
  material: ColorMaterial.ColorMaterial
): Promise<void> {
  const scene = await viewer.scene();
  await scene
    .items((op) =>
      op.where((q) => q.withItemIds(itemIds)).materialOverride(material)
    )
    .execute();
}
