import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { db } from '../../../model/db';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-reproductor',
  imports: [],
  templateUrl: 'reproductor.component.html',
  styleUrl: './reproductor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproductorComponent implements AfterViewInit {
  
  
  ngAfterViewInit(): void {
      var audio = document.getElementById("audio") as HTMLAudioElement

      var aaa 
      Promise.resolve(aaa = db.episodios.get(1))
      console.log(aaa)
      audio.src = "data:audio/mp3;base64,"

    } 

    eps$ = liveQuery(() => db.episodios.toArray());


}
