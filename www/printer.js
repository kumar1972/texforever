/**
 * TEXFOREVER - Universal Printer Utility
 * Windows (Electron) / Android APK (Capacitor) / Browser
 */

// பிரிண்ட் CSS (பழைய document.write வரிகளில் இருந்த அதே styles)
const TEX_PRINT_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");
*{box-sizing:border-box; margin:0; padding:0; font-family:"Poppins",sans-serif;}
body{background:#ffffff !important; color:#1E2B23 !important; padding:10px;}
.main-card{width:100% !important; border:none !important; box-shadow:none !important; padding:0 !important; margin:0 !important;}
.hide-on-print, .no-print, .top-nav, .header-bar .print-btn, .header-bar .close-btn, .top-form-row-single{display:none !important;}
#warpDesignTitle, #weftDesignTitle{display:block !important; font-size:12px !important; font-weight:700 !important; color:#000000 !important; margin-bottom:4px !important;}
.company-header{text-align:center; border-bottom:2px solid #4A7C59; padding-bottom:5px; margin-bottom:7px;}
.company-header h1{font-size:16px; color:#DAA520; font-weight:700; text-transform:uppercase;}
.company-header p{font-size:9px; color:#DAA520; white-space:pre-line;}
.design-info-box, .weft-info-box{background:#FFF8E1 !important; border:2px solid #4A7C59; border-radius:6px; padding:9px 10px; display:grid; grid-template-columns:repeat(4,1fr); gap:6px; font-size:12px; font-weight:700; color:#1F2937 !important; margin-bottom:6px;}
.section-title{font-size:10px; color:#ffffff !important; background:#4A7C59 !important; padding:5px 8px; border-radius:6px; display:inline-block; margin:6px 0 4px; font-weight:700;}
table{width:100% !important; border-collapse:collapse !important; font-size:11px !important; text-align:center !important;}
th, td{padding:6px 4px !important; color:#1E2B23 !important; border:none !important;}
th{background:#EAF0EA !important; color:#2F4F38 !important; font-weight:700; font-size:10px; border-top:2px solid #4A7C59 !important; border-bottom:2px solid #4A7C59 !important;}
.col-set{border-left:1px dashed #CBD5CB !important;}
.summary-box{background:#F4F7F4 !important; border:1px dashed #CBD5CB; border-radius:6px; padding:6px 8px; text-align:center; font-size:10px; font-weight:600; color:#2F4F38 !important; margin:6px 0;}
.page-break{page-break-after:always; break-after:page;}
`;

// Page-ஓட <style> blocks-ஐ எடுக்கும் (@media print rules அதுல தான் இருக்கு)
function getPageStyles() {
  let css = '';
  document.querySelectorAll('style').forEach(function (s) {
    css += s.textContent + '\n';
  });
  return css;
}

function buildPrintHtml(jobName, content) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
         '<title>' + jobName + '</title>' +
         '<style>' + TEX_PRINT_CSS + '</style>' +
         '<style>' + getPageStyles() + '</style>' +
         '</head><body>' +
         // page-ஓட print CSS #previewModal-ஐ தான் visible ஆக்கும், அதனால் அதே structure
         '<div id="previewModal" class="overlay-modal show">' +
         '<div class="modal-content"><div class="modal-body">' +
         content +
         '</div></div></div>' +
         '</body></html>';

}

window.appPrint = async function (customContent) {
  const area = document.querySelector('.main-card, .invoice-container, .print-area, #printable-section') || document.body;
  const content = customContent || area.innerHTML;
  const jobName = document.title || 'TEXFOREVER Print';
  const html = buildPrintHtml(jobName, content);

  // 1. Windows desktop (Electron)
  if (window.desktopPrint) {
    try {
      await window.desktopPrint.printHtml(html, { silent: false });
    } catch (e) {
      alert('Print error: ' + e.message);
    }
    return;
  }

  // 2. Android APK (Capacitor) - Android system print dialog
  const cap = window.Capacitor;
  if (cap && cap.isNativePlatform && cap.isNativePlatform() &&
      cap.Plugins && cap.Plugins.PrintPlugin) {
    try {
      await cap.Plugins.PrintPlugin.printHtml({ html: html, jobName: jobName });
    } catch (e) {
      alert('Print error: ' + (e.message || e));
    }
    return;
  }

  // 3. Browser (Chrome போன்றவை) - window.open இல்லாம hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => iframe.remove(), 1000);
  }, 500);
};

// Print பட்டன்களை தானாக இணைப்பது
// (பெரிய container-களில் click ஆகாம, button/link மட்டும்)
document.addEventListener("DOMContentLoaded", () => {
  const bindPrintButtons = () => {
    const buttons = document.querySelectorAll('button, a, input[type="button"], .print-btn, [id*="print"]');

    buttons.forEach(btn => {
      if (btn.getAttribute('data-print-bound')) return;

      const text = (btn.innerText || btn.value || "").toLowerCase();
      const id = (btn.id || "").toLowerCase();
      const className = (typeof btn.className === 'string' ? btn.className : "").toLowerCase();

      if (text.includes('print') || id.includes('print') || className.includes('print')) {
        btn.setAttribute('data-print-bound', 'true');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

if (window._isPrintingInProgress) return;
  window._isPrintingInProgress = true;
  setTimeout(() => { window._isPrintingInProgress = false;
                   }, 2000);
               });
      }
    });
  };

  bindPrintButtons();

  const observer = new MutationObserver(() => bindPrintButtons());
  observer.observe(document.body, { childList: true, subtree: true });
});