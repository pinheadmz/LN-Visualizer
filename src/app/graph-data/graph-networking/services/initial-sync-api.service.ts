import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chunk, LndChannel, LndNode } from 'api/src/models';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { selectChunkInitSyncCommand } from 'src/app/renderer/graph-renderer/selectors';

@Injectable()
export class InitialSyncApiService {
    private subject: WebSocketSubject<Chunk<LndNode | LndChannel>>;

    private initSyncCommand: string;

    constructor(private store$: Store) {
        this.store$.select(selectChunkInitSyncCommand).subscribe((initSyncCommand) => {
            this.initSyncCommand = initSyncCommand;
        });
    }

    public createWsSubject() {
        if (environment.production) {
            const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
            const origin = location.origin.replace('http://', 'ws://').replace('https://', 'wss://');
            const wsUrl = `${origin}${baseHref}api/`;
            this.subject = webSocket(wsUrl);
        } else {
            this.subject = webSocket(`ws://127.0.0.1:5647`);
        }
    }

    public sendSyncCommand(overideSync) {
        this.createWsSubject();
        this.subject.next(
            overideSync || (this.initSyncCommand as unknown as Chunk<LndNode | LndChannel>),
        );
    }

    public completeRequest() {
        this.subject.complete();
    }

    public listenToStream(): Observable<Chunk<LndNode | LndChannel>> {
        return this.subject.asObservable();
    }
}
