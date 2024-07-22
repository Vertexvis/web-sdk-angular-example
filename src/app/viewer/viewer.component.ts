import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { clearSelection, selectItem } from './operations';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
})
export class ViewerComponent implements OnInit, AfterViewInit {
  /**
   * The URN of the scene to load. Supports loading by a stream key and an
   * optional scene view state.
   *
   * Examples:
   *
   *  * Load a scene: urn:vertexvis:stream-key:AH7v0jg5aN5_thkhU-XTzB_29aqW89EjyOH8
   *  * Load a scene with a scene view state: urn:vertexvis:stream-key:AH7v0jg5aN5_thkhU-XTzB_29aqW89EjyOH8?scene-view-state=123
   */
  @Input() public src: string =
    'urn:vertexvis:stream-key:AH7v0jg5aN5_thkhU-XTzB_29aqW89EjyOH8';

  @ViewChild('viewer') private viewer?: ElementRef<HTMLVertexViewerElement>;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    const script = this.document.createElement('script');
    script.type = 'module';
    script.src =
      'https://cdn.jsdelivr.net/npm/@vertexvis/viewer@0.15.x/dist/viewer/viewer.esm.js';

    this.document.body.append(script);
  }

  ngAfterViewInit(): void {
    if (this.viewer != null) {
      this.viewer.nativeElement.addEventListener(
        'tap',
        this.handleTap(this.viewer?.nativeElement)
      );
      this.viewer.nativeElement.featureLines = { width: 0.5, color: '#444444' };
    }
  }

  private handleTap(viewer: HTMLVertexViewerElement): (event: Event) => void {
    return async (event: Event) => {
      const { detail } = event as CustomEvent;
      const scene = await viewer.scene();
      const raycaster = scene.raycaster();

      const res = await raycaster.hitItems(detail.position);
      const itemId = res?.hits?.[0]?.itemId?.hex;

      if (itemId != null) {
        await selectItem(viewer, {
          query: { type: 'item-ids', itemIds: [itemId] },
        });
      } else {
        await clearSelection(viewer);
      }
    };
  }
}
