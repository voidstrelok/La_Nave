// db.ts
import Dexie, { Table } from 'dexie';

export interface Episodio {
    id?:number,
    idCapitulo: number,
    numeroCapitulo:number,
    file: string
}


export interface Cassette {
  id?:number,
  idCassette:number,
  idPodcast:number,
  nombre:string
  eps:number[]
}

export interface Podcast{
  id?:number,
  idPodcast:number,
  nombre:string
}

export class AppDB extends Dexie {
    episodios!: Table<Episodio, number>;
    cassettes!: Table<Cassette, number>;
    podcast!: Table<Podcast,number>;
  constructor() {
    super('LaNave');
    this.version(3).stores({
      episodios:'++id,idCapitulo',
      cassettes:'++id',
      podcast:'++id,idPodcast'
    });
  }

}

export const db = new AppDB();

