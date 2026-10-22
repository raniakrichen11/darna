import { Injectable, inject } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ShoppingListService } from './shopping-list.service';
import { PreferencesService } from './preferences.service';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  private shoppingList = inject(ShoppingListService);
  private preferences = inject(PreferencesService);
  private i18n = inject(I18nService);

  printInBrowser(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  async exportToPdf(targetElementId: string = 'printable-export-container'): Promise<boolean> {
    const element = document.getElementById(targetElementId);
    if (!element) {
      console.error('Printable element not found:', targetElementId);
      // Fallback to browser print
      this.printInBrowser();
      return false;
    }

    try {
      // Temporarily reveal element if hidden
      const originalDisplay = element.style.display;
      element.style.display = 'block';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      element.style.display = originalDisplay;

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      const imgData = canvas.toDataURL('image/png');

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Add extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const bride = this.preferences.preferences().brideName;
      const fileName = bride
        ? `Darna_Trousseau_${bride.replace(/\s+/g, '_')}.pdf`
        : `Darna_Trousseau_${new Date().toISOString().slice(0, 10)}.pdf`;

      pdf.save(fileName);
      return true;
    } catch (err) {
      console.error('PDF export failed:', err);
      // Fallback to print
      this.printInBrowser();
      return false;
    }
  }
}
