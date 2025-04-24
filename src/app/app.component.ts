import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
interface Player {
  id: number;
  name: string;
  level: string;
  isPlaying: boolean;
  gamePlayed: number;
  lastGameTime?: Date;
}

interface Court {
  id: number;
  name: string;
  players: number[]; // 玩家ID列表
}
@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'queque-app';
  players: Player[] = [
    // {
    //   id: 1,
    //   name: '1',
    //   isPlaying: false,
    //   gamePlayed: 0,
    //   level: '0',
    //   lastGameTime: new Date(),
    // },
    // {
    //   id: 2,
    //   name: '2',
    //   isPlaying: false,
    //   gamePlayed: 0,
    //   level: '0',
    //   lastGameTime: new Date(),
    // },
    // {
    //   id: 3,
    //   name: '3',
    //   isPlaying: false,
    //   gamePlayed: 0,
    //   level: '1',
    //   lastGameTime: new Date(),
    // },
    // {
    //   id: 4,
    //   name: '4',
    //   isPlaying: false,
    //   gamePlayed: 0,
    //   level: '1',
    //   lastGameTime: new Date(),
    // },
    // {
    //   id: 5,
    //   name: '5',
    //   isPlaying: false,
    //   gamePlayed: 0,
    //   level: '2',
    //   lastGameTime: new Date(),
    // },
    // {
    //   id: 6,
    //   name: '6',
    //   isPlaying: false,
    //   gamePlayed: 0,
    //   level: '2',
    //   lastGameTime: new Date(),
    // },
    // {
    //   id: 7,
    //   name: '7',
    //   isPlaying: false,
    //   gamePlayed: 0,
    //   level: '3',
    //   lastGameTime: new Date(),
    // },
    // {
    //   id: 8,
    //   name: '8',
    //   isPlaying: false,
    //   gamePlayed: 0,
    //   level: '3',
    //   lastGameTime: new Date(),
    // },
  ];

  courts: Court[] = [{ id: 1, name: '場地 1', players: [] }];

  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    level: new FormControl('0', [Validators.required]),
  });

  levelOptions = [
    { value: '0', label: '初學者' },
    { value: '1', label: '中級' },
    { value: '2', label: '高級' },
    { value: '3', label: '專業' },
  ];

  // 添加新玩家
  addPlayer(): void {
    if (this.form.invalid) {
      return;
    }

    const newId =
      this.players.length > 0
        ? Math.max(...this.players.map((p) => p.id)) + 1
        : 1;

    this.players.push({
      id: newId,
      name: this.form.controls.name.value!,
      isPlaying: false,
      gamePlayed: 0,
      level: this.form.controls.level.value!,
      lastGameTime: new Date(),
    });

    this.form.reset({
      name: '',
      level: '0',
    });
  }

  // 移除玩家
  removePlayer(id: number): void {
    this.players = this.players.filter((player) => player.id !== id);

    // 如果玩家在場地上，也要從場地移除
    this.courts = this.courts.map((court) => ({
      ...court,
      players: court.players.filter((playerId) => playerId !== id),
    }));
  }

  // 將玩家加入場地
  addPlayerToCourt(courtId: number, playerId: number): void {
    const court = this.courts.find((c) => c.id === courtId);
    if (!court || court.players.length >= 4) return; // 最多四人

    // 更新場地
    this.courts = this.courts.map((c) => {
      if (c.id === courtId) {
        return { ...c, players: [...c.players, playerId] };
      }
      return c;
    });

    // 更新玩家狀態
    this.players = this.players.map((p) => {
      if (p.id === playerId) {
        return { ...p, isPlaying: true, lastGameTime: new Date() };
      }
      return p;
    });
  }

  // 移除場地上的玩家
  removePlayerFromCourt(courtId: number, playerId: number): void {
    // 更新場地
    this.courts = this.courts.map((c) => {
      if (c.id === courtId) {
        return { ...c, players: c.players.filter((id) => id !== playerId) };
      }
      return c;
    });

    // 更新玩家狀態
    this.players = this.players.map((p) => {
      if (p.id === playerId) {
        return { ...p, isPlaying: false, lastGameTime: new Date() };
      }
      return p;
    });
  }

  // 清空場地上的所有玩家
  clearCourt(courtId: number): void {
    // 找到當前場地上的所有玩家
    const court = this.courts.find((c) => c.id === courtId);
    if (!court || court.players.length === 0) return;

    // 更新玩家狀態
    this.players = this.players.map((p) => {
      if (court.players.includes(p.id)) {
        return { ...p, isPlaying: false, lastGameTime: new Date() };
      }
      return p;
    });

    // 清空場地
    this.courts = this.courts.map((c) => {
      if (c.id === courtId) {
        return { ...c, players: [] };
      }
      return c;
    });
  }

  // 清空場地上的所有玩家並累加場數
  completeGame(courtId: number): void {
    // 找到當前場地上的所有玩家
    const court = this.courts.find((c) => c.id === courtId);
    if (!court || court.players.length === 0) return;
    // 更新玩家狀態
    this.players = this.players.map((p) => {
      if (court.players.includes(p.id)) {
        return {
          ...p,
          isPlaying: false,
          gamePlayed: p.gamePlayed + 1,
          lastGameTime: new Date(),
        };
      }
      return p;
    });
    // 清空場地
    this.courts = this.courts.map((c) => {
      if (c.id === courtId) {
        return { ...c, players: [] };
      }
      return c;
    });
  }

  autoAssignPlayers(courtId: number): void {
    const court = this.courts.find((c) => c.id === courtId);
    if (!court) return;

    // 獲取場地上的玩家
    const playersInCourt = this.getCourtPlayers(courtId);

    let filteredWaitingPlayers: Player[] = [];

    if (playersInCourt.length === 0) {
      // 按等級分配
      const waitingPlayers = this.getWaitingPlayers();

      // 依照 等級排序 gamePlayed，lastGameTime， 等級排序
      filteredWaitingPlayers = waitingPlayers.sort((a, b) => {
        if (a.gamePlayed !== b.gamePlayed) {
          return a.gamePlayed - b.gamePlayed;
        } else if (a.level !== b.level) {
          return parseInt(a.level) - parseInt(b.level);
        } else if (a.lastGameTime && b.lastGameTime) {
          return a.lastGameTime.getTime() - b.lastGameTime.getTime();
        }
        return 0;
      });
    } else {
      // 場上玩家等級加總
      const totalLevel = playersInCourt.reduce((sum, player) => {
        return sum + parseInt(player.level);
      }, 0);
      // 平均等級
      const averageLevel = totalLevel / playersInCourt.length;
      // 獲取等待中的玩家
      const waitingPlayers = this.getWaitingPlayers();
      // 過濾出等級相近的玩家
      filteredWaitingPlayers = waitingPlayers.filter((player) => {
        return (
          Math.abs(parseInt(player.level) - averageLevel) <= 1 &&
          !playersInCourt.some((p) => p.id === player.id)
        );
      });
    }

    // 獲取場地的空位數量
    const emptySlots = this.getEmptySlots(courtId).length;
    // 如果場地已滿，則不進行分配
    if (playersInCourt.length >= 4) return;
    // 如果場地有空位，則自動分配玩家
    for (let i = 0; i < emptySlots; i++) {
      if (filteredWaitingPlayers[i]) {
        this.addPlayerToCourt(courtId, filteredWaitingPlayers[i].id);
      }
    }
    // 更新場地狀態
    this.courts = this.courts.map((c) => {
      if (c.id === courtId) {
        return { ...c, players: [...c.players] };
      }
      return c;
    });
  }

  // 刪除場地
  deleteCourt(courtId: number): void {
    // 先清空場地上的玩家
    this.clearCourt(courtId);

    // 刪除場地
    this.courts = this.courts.filter((c) => c.id !== courtId);
  }

  // 獲取場地上的玩家
  getCourtPlayers(courtId: number): Player[] {
    const court = this.courts.find((c) => c.id === courtId);
    return court
      ? court.players.map((id) => this.players.find((p) => p.id === id)!)
      : [];
  }

  // 獲取等待中的玩家，按照最後打球時間排序
  getWaitingPlayers(): Player[] {
    return this.players
      .filter((p) => !p.isPlaying)
      .sort((a, b) => {
        if (a.lastGameTime && b.lastGameTime) {
          return a.lastGameTime.getTime() - b.lastGameTime.getTime();
        }
        return 0;
      });
  }

  // 添加場地
  addCourt(): void {
    const newId =
      this.courts.length > 0
        ? Math.max(...this.courts.map((c) => c.id)) + 1
        : 1;

    this.courts.push({
      id: newId,
      name: `場地 ${newId}`,
      players: [],
    });
  }

  // 處理選擇場地事件
  onCourtSelect(event: Event, playerId: number): void {
    const select = event.target as HTMLSelectElement;
    const courtId = parseInt(select.value);

    if (courtId) {
      this.addPlayerToCourt(courtId, playerId);
      select.value = '';
    }
  }

  // 获取场地空位数组
  getEmptySlots(courtId: number): number[] {
    const court = this.courts.find((c) => c.id === courtId);
    const emptySlots = 4 - (court?.players.length || 0);
    return new Array(emptySlots > 0 ? emptySlots : 0);
  }

  getLevelDisplay(level: string): string {
    const levelOption = this.levelOptions.find(
      (option) => option.value === level
    );
    return levelOption ? levelOption.label : '未知';
  }
}
