import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ANIME_STATUS, MANGA_STATUS } from '../../../models/filters/filter.model';
import { FilterSelection } from '../../../interfaces/common/filter-selection/filter-selection.interface';
import { JikanGenre } from '../../../interfaces/common/jikan-genre/jikan-genre.interface';
import { FilterService } from '../../../services/api/filter.service';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  standalone: false,
})
export class FilterModalComponent implements OnInit {
  @Input() type: 'manga' | 'anime' = 'manga';
  @Input() currentFilters: FilterSelection = {
    genreId: null,
    demographicId: null,
    status: null,
  };

  genres: JikanGenre[] = [];
  demographics: JikanGenre[] = [];

  // 👇 Tipado explícito para que TS no infiera el tipo del primer array
  statuses: ReadonlyArray<{ readonly value: string; readonly label: string }> =
    [];

  selectedGenreId: number | null = null;
  selectedDemographicId: number | null = null;
  selectedStatus: string | null = null;

  loading = true;

  private modalCtrl = inject(ModalController);
  private filterService = inject(FilterService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // 👇 Acá se asigna según el @Input() type, ya con this disponible
    this.statuses = this.type === 'manga' ? MANGA_STATUS : ANIME_STATUS;

    this.selectedGenreId = this.currentFilters.genreId;
    this.selectedDemographicId = this.currentFilters.demographicId;
    this.selectedStatus = this.currentFilters.status;

    this.filterService.getGenres(this.type).subscribe({
      next: (genres) => {
        this.genres = genres;
        this.cdr.detectChanges();
      },
    });

    this.filterService.getDemographics(this.type).subscribe({
      next: (demographics) => {
        this.demographics = demographics;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  selectGenre(id: number | null): void {
    this.selectedGenreId = this.selectedGenreId === id ? null : id;
  }

  selectDemographic(id: number | null): void {
    this.selectedDemographicId = this.selectedDemographicId === id ? null : id;
  }

  selectStatus(value: string | null): void {
    this.selectedStatus = this.selectedStatus === value ? null : value;
  }

  clearAll(): void {
    this.selectedGenreId = null;
    this.selectedDemographicId = null;
    this.selectedStatus = null;
  }

  apply(): void {
    const filters: FilterSelection = {
      genreId: this.selectedGenreId,
      demographicId: this.selectedDemographicId,
      status: this.selectedStatus,
    };
    this.modalCtrl.dismiss(filters, 'apply');
  }

  close(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // 👇 Agregar dentro de la clase FilterModalComponent

  // Grupos expandidos por defecto (podés dejar [] para todos cerrados, o ['genre'] para abrir uno)
  expandedGroups: string[] = [];

  // Helper: nombre del género seleccionado (para mostrarlo en el header del acordeón)
  getGenreName(id: number): string {
    const g = this.genres.find((x) => x.mal_id === id);
    return g ? g.name : '';
  }

  // Helper: nombre de la demografía seleccionada
  getDemographicName(id: number): string {
    const d = this.demographics.find((x) => x.mal_id === id);
    return d ? d.name : '';
  }

  // Helper: label del status seleccionado
  getStatusLabel(value: string): string {
    const s = this.statuses.find((x) => x.value === value);
    return s ? s.label : '';
  }
}
