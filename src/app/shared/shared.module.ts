import {NgModule} from "@angular/core";


import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {LocationPickerComponent} from "./pickers/location-picker/location-picker.component";
import {MapModelComponent} from "./map-model/map-model.component";



@NgModule({

  exports: [LocationPickerComponent,MapModelComponent],
  declarations: [LocationPickerComponent,MapModelComponent],
  imports: [CommonModule, IonicModule],
  providers: [],

})
export class SharedModule {}
