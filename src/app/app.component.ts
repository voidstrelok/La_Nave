import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { liveQuery } from 'dexie';
import {db, Cassette} from "../app/model/db";
import * as JSZip from 'jszip';
import { LoadingIndicatorComponent } from "./views/loading/loading.component";
import { LoadingService } from './views/loading/loadingservice';
import { Md5 } from 'ts-md5';
import { ReproductorComponent } from "./views/reproductor/reproductor/reproductor.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{

  
}
