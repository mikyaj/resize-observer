import {ElementRef, Inject, Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {share} from 'rxjs/operators';
import {RESIZE_OPTION_BOX} from '../tokens/resize-option-box';
import {RESIZE_OBSERVER_SUPPORT} from '../tokens/support';

// @dynamic
@Injectable()
export class ResizeObserverService extends Observable<
    ReadonlyArray<ResizeObserverEntry>
> {
    constructor(
        @Inject(ElementRef) {nativeElement}: ElementRef<Element>,
        @Inject(NgZone) ngZone: NgZone,
        @Inject(RESIZE_OBSERVER_SUPPORT) support: boolean,
        @Inject(RESIZE_OPTION_BOX) box: ResizeObserverOptions['box'],
    ) {
        let observer: ResizeObserver;

        super(subscriber => {
            if (!support) {
                subscriber.error('ResizeObserver is not supported in your browser');
            }

            observer = new ResizeObserver(entries => {
                ngZone.run(() => {
                    subscriber.next(entries);
                });
            });
            observer.observe(nativeElement, {box});

            return () => observer.disconnect;
        });

        return this.pipe(share());
    }
}
