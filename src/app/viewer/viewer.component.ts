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
  @Input() public src?: string;

  @ViewChild('viewer') private viewer?: ElementRef<HTMLVertexViewerElement>;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    const script = this.document.createElement('script');
    script.type = 'module';
    script.src =
      'https://unpkg.com/@vertexvis/viewer@0.15.x/dist/viewer/viewer.esm.js';

    this.document.body.append(script);
  }

  ngAfterViewInit(): void {
    if (this.viewer != null) {
      this.viewer.nativeElement.addEventListener(
        'tap',
        this.handleTap(this.viewer?.nativeElement)
      );
      this.viewer.nativeElement.featureLines = { width: 0.25 };
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
        await selectItem(viewer, [itemId]);
      } else {
        await clearSelection(viewer);
      }
    };
  }
}
