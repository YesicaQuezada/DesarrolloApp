import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

import { addIcons } from 'ionicons';
import { mic, micOff, trashBin } from 'ionicons/icons';
import { SearchbarInputEventDetail } from '@ionic/angular';

import { TipoMedio } from '../media-segment/media-segment.component';

/**
 * Lo que la página debe buscar: texto escrito y medio de la solapa.
 * Se emite completo en cada cambio, para que quien escucha no tenga que
 * recordar estado suelto de dos fuentes distintas.
 */
export interface PeticionBusqueda {
  texto: string;
  tipo: TipoMedio;
}

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss'],
  standalone: false,
})
export class SearchComponent implements OnDestroy {
  /** Emite la búsqueda completa cada vez que cambia el texto o la solapa. */
  @Output() buscar = new EventEmitter<PeticionBusqueda>();

  /** Solapa activa: mismo estándar que Home y Favoritos (Manga primero). */
  tipo: TipoMedio = 'manga';

  /** Último texto escrito: se reenvía intacto al cambiar de solapa. */
  texto = '';
  public isListening = false;
  public voiceSupported = false;
  private voiceListenerAttached = false;

  constructor() {
    addIcons({ trashBin, mic, micOff });
    this.voiceSupported = Capacitor.isNativePlatform();
    if (this.voiceSupported) {
      void this.checkVoiceAvailability();
    }
  }

  ngOnDestroy(): void {
    void SpeechRecognition.stop();
    void SpeechRecognition.removeAllListeners();
  }

  /**
   * @function alEscribir
   * @description Guarda el texto y notifica la búsqueda con la solapa actual.
   */
  alEscribir(event: CustomEvent<SearchbarInputEventDetail>): void {
    this.texto = event.detail?.value ?? '';
    this.notificar();
  }

  /**
   * @function alCambiarSegmento
   * @description Cambia de medio y reenvía la búsqueda con el texto que ya
   * había escrito el usuario, para que la solapa realmente discrimine.
   */
  alCambiarSegmento(tipo: TipoMedio): void {
    this.tipo = tipo;
    this.notificar();
  }

  private async checkVoiceAvailability(): Promise<void> {
    try {
      const result = await SpeechRecognition.available();
      this.voiceSupported = result.available;
    } catch {
      this.voiceSupported = false;
    }
  }

  async iniciarBusquedaPorVoz(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      alert('La búsqueda por voz está disponible en la app móvil.');
      return;
    }

    try {
      const available = await SpeechRecognition.available();
      if (!available.available) {
        alert('La voz no está disponible en este dispositivo.');
        return;
      }

      const permissions = await SpeechRecognition.checkPermissions();
      if (permissions.speechRecognition !== 'granted') {
        await SpeechRecognition.requestPermissions();
      }

      this.isListening = true;

      if (!this.voiceListenerAttached) {
        void SpeechRecognition.removeAllListeners();
        void SpeechRecognition.addListener('partialResults', (data: { matches?: string[] }) => {
          const transcript = data.matches?.[0]?.trim();
          if (!transcript) {
            return;
          }

          this.texto = transcript;
          this.notificar();
        });
        this.voiceListenerAttached = true;
      }

      const result = await SpeechRecognition.start({
        language: 'es-AR',
        maxResults: 1,
        prompt: 'Habla para buscar',
        partialResults: true,
      });

      const transcript = result?.matches?.[0]?.trim();
      if (transcript) {
        this.texto = transcript;
        this.notificar();
      }

      this.isListening = false;
    } catch (error) {
      console.error('Error al iniciar la búsqueda por voz:', error);
      this.isListening = false;
      alert('No se pudo iniciar la búsqueda por voz. (Nota: Los emuladores requieren servicios de Google y motor de voz; se recomienda probar en un dispositivo físico).');
    }
  }

  limpiarBusqueda(): void {
    this.texto = '';
    this.notificar();
  }

  private notificar(): void {
    this.buscar.emit({ texto: this.texto, tipo: this.tipo });
  }
}
