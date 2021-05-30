import { SocketService } from './socket.service';

describe('SocketService', () => {
  beforeEach(() => {
    SocketService.socket = undefined;
    localStorage.removeItem('token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initSocket', () => {
    it('should initialize socket', () => {
      localStorage.setItem('token', 'abc');

      SocketService.initSocket();

      expect(SocketService.socket).not.toBe(undefined);
    });

    it('should initialize socket', () => {
      SocketService.initSocket();

      expect(SocketService.socket).toBe(undefined);
    });
  });

  describe('getSocket', () => {
    it('should call init socket', () => {
      jest.spyOn(SocketService, 'initSocket').mockImplementation(() => null);

      SocketService.getSocket();

      expect(SocketService.initSocket).toHaveBeenCalled();
    });

    it('should initialize socket', () => {
      SocketService.socket = { someValue: true } as any;
      jest.spyOn(SocketService, 'initSocket').mockImplementation(() => null);

      SocketService.getSocket();

      expect(SocketService.initSocket).not.toHaveBeenCalled();
    });
  });

  describe('send', () => {
    it('should call send', () => {
      SocketService.socket = { emit: jest.fn() } as any;

      SocketService.send('some-event', {});

      expect(SocketService.socket.emit).toHaveBeenCalledWith('some-event', {});
    });
  });

  describe('onEvent', () => {
    it('should call on', () => {
      SocketService.socket = { on: jest.fn() } as any;

      SocketService.onEvent('some-event').subscribe();

      expect(SocketService.socket.on).toHaveBeenCalled();
    });
  });
});
