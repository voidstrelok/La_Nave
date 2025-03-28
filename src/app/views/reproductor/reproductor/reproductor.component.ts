import { AfterViewInit, assertInInjectionContext, ChangeDetectionStrategy, Component, ElementRef, NgModule, OnInit, ViewChild} from '@angular/core';
import { db, Episodio } from '../../../model/db';
import { liveQuery, PromiseExtended } from 'dexie';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoadingIndicatorComponent } from "../../loading/loading.component";
import { LoadingService } from '../../loading/loadingservice';
import {MatIcon, MatIconModule} from '@angular/material/icon'
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DisqusModule } from 'ngx-disqus';
import { APIService } from '../../../service/api.service';
import { CapituloDTO,PodcastDTO,RefMusicalDTO } from '../../../model/DTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reproductor',
  imports: [CommonModule, LoadingIndicatorComponent,MatIcon,RouterLink,DisqusModule],
  templateUrl: 'reproductor.component.html',
  styleUrl: './reproductor.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ReproductorComponent implements AfterViewInit {

  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;
  listaEps: { id: number; num: number; }[] = [];
  temp$!: PromiseExtended<Episodio[]>;
  epId!:number
  cap$!:Observable<CapituloDTO>
  Capitulo!:Episodio
  CapituloInfo!:CapituloDTO
  playlistActual!:HTMLDivElement
  isPlaying = false;
  duration = 0;
  currentTime = 0;
  listaCapitulos : number [] = []

  constructor(
    public loadingService:LoadingService, 
    private route:ActivatedRoute, 
    private router: Router,
    private apiService:APIService) {
      loadingService.loadingOn()      
  }
  getEpNumber(){
    return Number.parseInt(this.route.snapshot.paramMap.get('idCap') as string)

  }
  async ngAfterViewInit()  {
      var casetes = await db.cassettes.toArray()
      casetes.forEach(element => {
        if(element.idPodcast == 1)
          {
           this.listaCapitulos= this.listaCapitulos.concat(element.eps)
          }
      });
      this.playCap(this.getEpNumber())
    } 
  
  
  async playCap(idCap : number){    
    this.loadingService.loadingOn()

    if(this.getEpNumber() == 0)
    {
      idCap = this.listaCapitulos[0]
    }

    if(!this.capituloIsLoaded(idCap)){
      window.alert("El capitulo no esta disponible")
      location.href = "/enter"
    }

    if(this.playlistActual != undefined){
      this.playlistActual.classList.remove("playing")
    }
    this.playlistActual = document.getElementById("cap-"+idCap.toString()) as HTMLDivElement
    if(this.playlistActual != null){
      this.playlistActual.classList.add("playing")
    }
   
    this.cap$ = this.apiService.API.GetCapitulo(idCap)
    this.cap$.subscribe(x=>{this.CapituloInfo = x})

    var ep = (await db.episodios.where("idCapitulo").equals(idCap).toArray())[0]
    if(ep != undefined){
      this.router.navigate(['/play/',idCap])
      this.audioPlayer.nativeElement.src ="data:audio/mp3;base64,"+ ep.file
      this.Capitulo = ep
      }else{
        location.href = "enter"

      }
    this.loadingService.loadingOff()
    this.isPlaying = false

    }

  togglePlay() {
    const audio = this.audioPlayer.nativeElement;
    if(audio.src == ""){
      this.getEpNumber()
      this.playCap(this.epId)
    }
    if (audio.paused) {
      audio.play();
      this.isPlaying = true;
    } else {
      audio.pause();
      this.isPlaying = false;
    }
  }

  pause(){
    this.audioPlayer.nativeElement.pause()
    this.isPlaying = false
  }

  play(){
    this.audioPlayer.nativeElement.play()
    this.isPlaying= true
  }
  next(){
    this.pause()
    var siguiente = this.listaCapitulos.indexOf(this.getEpNumber())+1
    if(this.listaCapitulos[siguiente] != undefined)
      this.playCap(this.listaCapitulos[siguiente])
    else
      this.playCap(this.listaCapitulos[0])
  }

  async capituloIsLoaded(idCap:number){
    return (await db.episodios.where("idCapitulo").equals(idCap).toArray()).length != 0
    
  }

  prev(){
    this.pause()
    var anterior = this.listaCapitulos.indexOf(this.getEpNumber())-1
    if(this.listaCapitulos[anterior] != undefined)
      this.playCap(this.listaCapitulos[anterior])
    else
      this.playCap(this.listaCapitulos.slice(-1)[0])
  }

  updateSeekBar() {
    this.currentTime = this.audioPlayer.nativeElement.currentTime;
  }

  seekAudio(event: Event) {
    const input = event.target as HTMLInputElement;
    this.audioPlayer.nativeElement.currentTime = parseFloat(input.value);
    this.updateSeekBar();
  }

  setDuration() {
    this.duration = this.audioPlayer.nativeElement.duration;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

}
