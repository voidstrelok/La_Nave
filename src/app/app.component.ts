import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { liveQuery } from 'dexie';
import {db, Episodio, Cassette} from "../app/model/db";
import * as JSZip from 'jszip';
import { LoadingIndicatorComponent } from "./views/loading/loading.component";
import { LoadingService } from './views/loading/loadingservice';
import { ReproductorComponent } from "./views/reproductor/reproductor/reproductor.component";
import { count } from 'rxjs';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoadingIndicatorComponent, ReproductorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{


  muestraRadio = true
  memoria = document.getElementById("memoria") as HTMLDivElement
  DivMensaje!: HTMLDivElement;
  
  episodios!:any
  cassettes!: Array<Cassette>


  eps$ = liveQuery(() => db.episodios.toArray());
  cas$ = liveQuery(() => db.cassettes.toArray());
  title = 'La_Nave';

  constructor(private loadingService: LoadingService) {
    loadingService.loadingOn()
  }
  async ngAfterViewInit(): Promise<void> {
    
    this.DivMensaje = document.getElementById("mensaje") as HTMLDivElement
    this.memoria = document.getElementById("memoria") as HTMLDivElement
    //db.episodios.clear()



    if(db.cassettes == null){
      this.memoria.innerHTML = "Sin carga"  
      this.loadingService.loadingOff()
      return
    }
    var promises = []
    promises.push(db.cassettes.toArray().then(x=>this.cassettes = x))
    await Promise.all(promises).then(()=>{
      if(this.cassettes.length >0 ){
        this.memoria.innerHTML = "Cassettes Cargados<br><br>"   
        this.cassettes.forEach((x : Cassette)=>{
          this.memoria.innerHTML += ">"+x.nombre+"<br>"
        })
      }else{
        this.memoria.innerHTML = "Sin carga"  
      }
      this.loadingService.loadingOff()
    })

    

  }
    
    async FPicker_OnChange(event:any){
      this.DivMensaje.innerHTML = ""

    this.DivMensaje = document.getElementById("mensaje") as HTMLDivElement

    this.loadingService.loadingOn()

    var MD5Casssette = [{"id":1,"nombre":"Tierra 2 T1","md5":"d41d8cd98f00b204e9800998ecf8427e"}]
    
    var promises: any[] = []
    var file =  event.target.files[0]

    var md5 = ""

    promises.push(new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(){
				return resolve(reader.result);
			}
			reader.readAsDataURL(file);
    }))

    await Promise.all(promises).then(x=> md5 = Md5.hashAsciiStr(x[0]))
    promises = []

    let cassetteLocal = MD5Casssette.filter((x)=> x["md5"] == md5)[0]

    if(cassetteLocal ==null || cassetteLocal["md5"] != md5){
      this.DivMensaje.innerHTML = "Cassette no válido..."
      this.loadingService.loadingOff()
      return
    }else{
      this.DivMensaje.innerHTML = "cargando..."
    }

    if(this.cassettes.filter((x:Cassette) => x.nombre = cassetteLocal.nombre).length > 0){
      this.DivMensaje.innerHTML = "El cassette ya está cargado..."
      this.loadingService.loadingOff()
      return
    }
      
    try{
      await JSZip.loadAsync(file).then((zip) => {      
        var casetera: { [x: string]: { [x: string]: any; }[]; };
        zip.file('cassette.json')?.async('string').then( x => {
          casetera = JSON.parse(x)
          var caset = casetera["cassette"].toString()        
          casetera["episodios"].forEach(async (x: any) => {
            promises.push(
              zip.file(x["file"])?.async("base64").then(async file =>{
                await db.episodios.add({
                  idPodcast:x["idPodcast"],
                  idCapitulo:x["idCapitulo"],
                  numeroCapitulo:x["numeroCapitulo"],
                  file:file
                });        
                this.DivMensaje.innerHTML = "cargado: "+caset+" - Ep."+x["numeroCapitulo"].toString()
                
              })
            )         
          })
          promises.push(db.cassettes.add({idPodcast: cassetteLocal.id,nombre:cassetteLocal.nombre}))

          Promise.all(promises).then(()=>{
            location.reload()
  
          })
        })
      })
  
    }catch(e)
    {
      this.DivMensaje.innerHTML = "NO SE RECONOCIÓ EL CASSETE"
    }

  }
  async ResetDB() {
      await db.episodios.clear();
      await db.cassettes.clear();
      location.reload();
    }

}
