// db.ts
import Dexie, { Table } from 'dexie';

export interface Episodio {
    id?:number,
    idPodcast:number,
    idCapitulo: number,
    numeroCapitulo:number,
    file: string
}


export interface Cassette {
  id?:number,
  idPodcast:number,
  nombre:string 
}


export class AppDB extends Dexie {
    episodios!: Table<Episodio, number>;
    cassettes!: Table<Cassette, number>;

  constructor() {
    super('LaNave');
    this.version(3).stores({
      episodios:'++id',
      cassettes:'++id',
    });
  }

}

export const db = new AppDB();

