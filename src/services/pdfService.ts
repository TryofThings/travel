import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TravelPlan } from '../types/travel';

export class PDFExportService {
  async exportItineraryToPDF(itinerary: TravelPlan): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Travel Itinerary: ${itinerary.destination}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Trip Overview
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Trip Overview', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Duration: ${itinerary.duration} days`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Total Budget: $${itinerary.totalBudget}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Travel Style: ${itinerary.preferences.travelStyle}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Group Size: ${itinerary.preferences.groupSize} people`, 20, yPosition);
    yPosition += 15;

    // Weather Summary
    if (itinerary.weatherSummary) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Weather Overview', 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const weatherLines = pdf.splitTextToSize(itinerary.weatherSummary, pageWidth - 40);
      pdf.text(weatherLines, 20, yPosition);
      yPosition += weatherLines.length * 4 + 10;
    }

    // Travel Tips
    if (itinerary.travelTips && itinerary.travelTips.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Travel Tips', 20, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      itinerary.travelTips.forEach((tip, index) => {
        const tipLines = pdf.splitTextToSize(`${index + 1}. ${tip}`, pageWidth - 40);
        if (yPosition + tipLines.length * 4 > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(tipLines, 20, yPosition);
        yPosition += tipLines.length * 4 + 2;
      });
      yPosition += 10;
    }

    // Daily Itinerary
    itinerary.days.forEach((day, dayIndex) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      // Day Header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Day ${day.day} - ${day.date}`, 20, yPosition);
      yPosition += 10;

      // Weather Info
      if (day.weather) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text(`Weather: ${day.weather.condition} (${day.weather.temperature.min}°-${day.weather.temperature.max}°C)`, 20, yPosition);
        yPosition += 6;
      }

      // Activities
      day.activities.forEach((activity, actIndex) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${activity.timeSlot.toUpperCase()}: ${activity.name}`, 25, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Activity details
        const descLines = pdf.splitTextToSize(activity.description, pageWidth - 50);
        pdf.text(descLines, 25, yPosition);
        yPosition += descLines.length * 4 + 2;

        pdf.text(`Location: ${activity.location}`, 25, yPosition);
        yPosition += 4;
        pdf.text(`Duration: ${activity.duration} | Cost: $${activity.estimatedCost}`, 25, yPosition);
        yPosition += 8;
      });

      // Day Notes
      if (day.notes) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        const noteLines = pdf.splitTextToSize(`Note: ${day.notes}`, pageWidth - 40);
        pdf.text(noteLines, 20, yPosition);
        yPosition += noteLines.length * 4 + 5;
      }

      yPosition += 10;
    });

    // Emergency Information
    if (itinerary.emergencyInfo) {
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Emergency Information', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Emergency Contacts:', 20, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      itinerary.emergencyInfo.contacts?.forEach(contact => {
        pdf.text(`• ${contact}`, 25, yPosition);
        yPosition += 4;
      });

      yPosition += 5;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Hospitals:', 20, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      itinerary.emergencyInfo.hospitals?.forEach(hospital => {
        pdf.text(`• ${hospital}`, 25, yPosition);
        yPosition += 4;
      });
    }

    // Footer
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated by TravelAI - Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Save the PDF
    const fileName = `${itinerary.destination.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.pdf`;
    pdf.save(fileName);
  }

  async exportItineraryFromHTML(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found for PDF export');
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF from HTML:', error);
      throw new Error('Failed to generate PDF');
    }
  }
}

export const pdfService = new PDFExportService();