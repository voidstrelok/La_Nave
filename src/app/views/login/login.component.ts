import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { liveQuery } from 'dexie';
import {db, Cassette} from "../../model/db";
import * as JSZip from 'jszip';
import { LoadingIndicatorComponent } from "../../views/loading/loading.component";
import { LoadingService } from '../../views/loading/loadingservice';
import { Md5 } from 'ts-md5';
import { ReproductorComponent } from "../../views/reproductor/reproductor/reproductor.component";
@Component({
  selector: 'app-login',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LoadingIndicatorComponent, ReproductorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterViewInit{
    logged = false;
  
    memoria = document.getElementById("memoria") as HTMLDivElement
    DivMensaje!: HTMLDivElement;
    
    cassetteraLocal!:any[]

    episodios!:any
    cassettes!: Array<Cassette>
  
    eps$ = liveQuery(() => db.episodios.toArray());
    cas$ = liveQuery(() => db.cassettes.toArray());
    title = 'La_Nave';
  
    constructor(private loadingService: LoadingService) {
      loadingService.loadingOn()
      this.cassetteraLocal = []
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
          this.logged=true 
          this.cassettes.forEach((x : Cassette)=>{
            this.memoria.innerHTML += ">"+x.nombre+"<br>"
            this.cassetteraLocal.push([x.nombre,x.idCassette])
          })
        }else{
          this.logged=false
          this.memoria.innerHTML = "Sin carga"  
        }
        this.loadingService.loadingOff()
      })
  
      
  
    }
      
    async FPicker_OnChange(event:any){
        this.DivMensaje.innerHTML = ""
  
      this.DivMensaje = document.getElementById("mensaje") as HTMLDivElement
  
      this.loadingService.loadingOn()
  
      /*var MD5Casssette = [
        {"id":1,"nombre":"Tierra 2 T1","md5":"1dd921a493154f373d10f2c6bf06a78d"},
        
      ]*/
      
        var ListaPodcast = [
          ["Tierra 2",1],
          ["Vendetta Radio",2]
        ]
      var promises: any[] = []
      const file =  event.target.files[0]
      var md5 = ""
  
      /*
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          console.log(reader.result);
      };

    
  
      await Promise.all(promises).then(x=>{ 

        md5 = Md5.hashAsciiStr(x[0])
        console.log(x)
      })
      promises = []
  
      let cassetteLocal = MD5Casssette.filter((x)=> x["md5"] == md5)[0]
   
      if(cassetteLocal ==null || cassetteLocal["md5"] != md5){
        this.DivMensaje.innerHTML = "Cassette no válido..."
        this.loadingService.loadingOff()
        return
      }else{
        this.DivMensaje.innerHTML = "cargando..."
      }
   
      this.DivMensaje.innerHTML = "Favor espera, cargando: "

      if(this.cassettes.filter((x:Cassette) => x.nombre = cassetteLocal.nombre).length > 0){
        this.DivMensaje.innerHTML = "El cassette ya está cargado..."
        this.loadingService.loadingOff()
        return
      }
        */
      this.DivMensaje.innerHTML = "Favor espera, cargando: "

      try {
        await JSZip.loadAsync(file).then(async (zip) => {
          var casetera: { [x: string]: { [x: string]: any }[] };
          await zip
            .file('cassette.json')
            ?.async('string')
            .then(async (x) => {
              casetera = JSON.parse(x);
              var caset = casetera['cassette'].toString();
              var nepisodios: number[] = [];
              var idPodcast: number = parseInt(
                casetera['idPodcast'].toString()
              );
              var idCassette: number = parseInt(
                casetera['idCassette'].toString()
              );
              var pod = this.cassetteraLocal.filter(
                (x) => x[1] == idPodcast
              )[0];
              if (pod != undefined) {
              }
              casetera['episodios'].forEach((x) => {
                nepisodios.push(x['idCapitulo']);
              });
              if (this.cassetteraLocal.filter((x) => x == caset).length != 0) {
                this.DivMensaje.innerHTML = 'El cassette ya está cargado...';
                this.loadingService.loadingOff();
                return;
              }

              casetera['episodios'].forEach(async (x: any) => {
                promises.push(
                  zip
                    .file(x['file'])
                    ?.async('base64')
                    .then(async (file) => {
                      await db.episodios.add({
                        idCapitulo: x['idCapitulo'],
                        numeroCapitulo: x['numeroCapitulo'],
                        file: file,
                      });
                      this.DivMensaje.innerHTML =
                        'cargado: ' +
                        caset +
                        ' - Ep.' +
                        x['numeroCapitulo'].toString();
                    })
                );
              });
              Promise.all(promises).then(async () => {
                if (
                  (await db.podcast
                    .where('idPodcast')
                    .equals(idPodcast)
                    .first()) == undefined
                ) {
                  var pod = ListaPodcast.filter((x) => x[1] == idPodcast)[0];
                  if (pod != undefined) {
                    await db.podcast.add({ nombre: '', idPodcast: idPodcast });
                    await db.cassettes.add({
                      idCassette: idCassette,
                      idPodcast: idPodcast,
                      nombre: caset,
                      eps: nepisodios,
                    });
                    console.log(pod);
                    location.reload();
                  }
                }
              });
            });
        });
      } catch (e) {
        this.DivMensaje.innerHTML = 'eso no es un cassette heribertus...';
        //console.log(e);
        this.loadingService.loadingOff();
      }
    }
      
    async ResetDB() {
        await db.episodios.clear();
        await db.cassettes.clear();
        location.reload();
      }
  
 }
