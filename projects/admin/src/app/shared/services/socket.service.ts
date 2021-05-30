import socketIo, { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { DefaultConfig } from '../../default-config';

const SERVER_URL = DefaultConfig.socketsUrl;

export class SocketService {
  public static socket: Socket;

  public static initSocket(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.socket = socketIo(SERVER_URL, {
        query: { token },
        transports: ['websocket']
      });
    }
  }

  public static getSocket(): any {
    if (!SocketService.socket) {
      SocketService.initSocket();
    }
    return this;
  }

  public static send(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  public static onEvent(event: any): Observable<any> {
    return new Observable((observer): any => {
      return this.socket.on(event, (data: any) => observer.next(data));
    });
  }
}
