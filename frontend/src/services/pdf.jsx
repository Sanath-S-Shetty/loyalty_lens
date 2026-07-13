import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportElementToPDF = async (element, filename = 'document.pdf', bgColor = '#0a0a0a') => {
  if (!element) return false;

  try {
    // 1. We temporarily reset height and overflow so the DOM can expand completely to show all its children.
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;
    
    element.style.height = 'auto';
    element.style.overflow = 'visible';

    // 2. We use windowHeight and windowWidth matching the element's actual scrolled dimensions.
    // We set scrollY: -window.scrollY to correct for any user scrolling offsetting the top margin.
    const canvas = await html2canvas(element, {
      scale: 2, 
      useCORS: true, 
      backgroundColor: bgColor,
      scrollY: -window.scrollY,
      windowHeight: element.scrollHeight,
      windowWidth: element.scrollWidth,
    });
    
    // 3. Restore the element's styling immediately
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;

    const imgData = canvas.toDataURL('image/png');
    
    // 4. PDF Generation
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    let pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Handle multipage PDFs if the content is extremely long!
    const pageHeight = pdf.internal.pageSize.getHeight();
    let heightLeft = pdfHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight; 
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    
    return true; 
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw error;
  }
};