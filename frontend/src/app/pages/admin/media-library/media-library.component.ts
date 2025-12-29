import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaService, Media } from '../../../services/media.service';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './media-library.component.html',
  styleUrls: ['./media-library.component.scss']
})
export class MediaLibraryComponent implements OnInit {
  mediaItems: Media[] = [];
  isLoading = false;
  isUploading = false;
  error = '';
  uploadError = '';

  constructor(private mediaService: MediaService) { }

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.isLoading = true;
    this.mediaService.getMedia().subscribe({
      next: (data) => {
        this.mediaItems = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load media';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    this.isUploading = true;
    this.uploadError = '';
    
    this.mediaService.uploadMedia(file).subscribe({
      next: (newItem) => {
        this.mediaItems.unshift(newItem); // Add to top
        this.isUploading = false;
      },
      error: (err) => {
        this.uploadError = 'Failed to upload file';
        this.isUploading = false;
        console.error(err);
      }
    });
  }

  deleteMedia(id: number): void {
    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      this.mediaService.deleteMedia(id).subscribe({
        next: () => {
          this.mediaItems = this.mediaItems.filter(m => m.id !== id);
        },
        error: (err) => {
          alert('Failed to delete media');
          console.error(err);
        }
      });
    }
  }

  copyUrl(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      // Could add a toast notification here
      alert('URL copied to clipboard');
    });
  }
}
