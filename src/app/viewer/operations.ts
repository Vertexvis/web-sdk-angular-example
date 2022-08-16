import type { ColorMaterial } from '@vertexvis/viewer';
import type { RootQuery } from '@vertexvis/viewer/dist/types/lib/scenes/queries';

interface IdItemQuery {
  type: 'item-ids';
  itemIds: string[];
}

interface MetadataItemQuery {
  type: 'metadata';
  key: string;
  value: string;
}

type ItemQuery = IdItemQuery | MetadataItemQuery;

interface SelectionOptions {
  query: ItemQuery;
  color?: string;
}

interface OverrideMaterialOptions {
  query: ItemQuery;
  material: ColorMaterial.ColorMaterial;
}

export async function selectItem(
  viewer: HTMLVertexViewerElement,
  { query, color }: SelectionOptions
): Promise<void> {
  const scene = await viewer.scene();
  await scene
    .items((op) => [
      op.where((q) => q.all()).deselect(),
      op.where(selectQuery(query)).select(),
    ])
    .execute();
}

export async function appendSelection(
  viewer: HTMLVertexViewerElement,
  { query, color }: SelectionOptions
): Promise<void> {
  const scene = await viewer.scene();
  await scene
    .items((op) => op.where(selectQuery(query)).select(color))
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
  { query, material }: OverrideMaterialOptions
): Promise<void> {
  const scene = await viewer.scene();
  await scene
    .items((op) => op.where(selectQuery(query)).materialOverride(material))
    .execute();
}

function selectQuery(query: ItemQuery): (query: RootQuery) => any {
  if (query.type === 'item-ids') {
    return (q) => q.withItemIds(query.itemIds);
  } else {
    return (q) => q.withMetadata(query.value, [query.key], true);
  }
}
