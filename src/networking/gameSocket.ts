import { GameState, PlayerType } from '../types/game';

export class GameSocket {
  private socket: WebSocket | null = null;
  private gameId: string | null = null;
  private callbacks: {
    onGameState: (state: GameState) => void;
    onError: (error: string) => void;
    onConnect: () => void;
    onDisconnect: () => void;
  };

  constructor(callbacks: typeof GameSocket.prototype.callbacks) {
    this.callbacks = callbacks;
  }

  connect(gameId: string): void {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/game/${gameId}`;
    
    this.socket = new WebSocket(wsUrl);
    this.gameId = gameId;

    this.socket.onopen = () => {
      this.callbacks.onConnect();
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'gameState') {
          this.callbacks.onGameState(data.state);
        }
      } catch (error) {
        this.callbacks.onError('Invalid message received');
      }
    };

    this.socket.onclose = () => {
      this.callbacks.onDisconnect();
    };

    this.socket.onerror = () => {
      this.callbacks.onError('WebSocket error occurred');
    };
  }

  sendAction(action: {
    type: string;
    payload: any;
    player: PlayerType;
  }): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.callbacks.onError('Not connected to server');
      return;
    }

    this.socket.send(JSON.stringify({
      ...action,
      gameId: this.gameId
    }));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.gameId = null;
    }
  }
}