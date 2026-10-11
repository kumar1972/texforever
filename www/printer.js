/**
 * TEXFOREVER - Final Standalone Universal Printer Utility for All Pages (APK & Web)
 */

window.appPrint = function(customContent) {
    console.log("TEXFOREVER Standalone Print Initiated...");
    
    // பக்கத்தில் உள்ள மெயின் கன்டென்ட் அல்லது பாடியைத் தேர்ந்தெடுத்தல்
    const printableArea = document.querySelector('.main-card, .invoice-container, .print-area, #printable-section') || document.body;
    const printContent = customContent || printableArea.innerHTML;

    // ஆண்ட்ராய்டு ஆப் மற்றும் வெப் இரண்டிற்கும் பொருந்தும் வகையில் புதிய பிரிண்ட் விண்டோ உருவாக்கம்
    const printWindow = window.open('', '_blank', 'height=700,width=900');
    
    if (printWindow) {
        printWindow.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>TEXFOREVER Print</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");');
        printWindow.document.write('*{box-sizing:border-box; margin:0; padding:0; font-family:"Poppins",sans-serif;}');
        printWindow.document.write('body{background:#ffffff !important; color:#1E2B23 !important; padding:10px;}');
        printWindow.document.write('.main-card{width:100% !important; border:none !important; box-shadow:none !important; padding:0 !important; margin:0 !important;}');
        printWindow.document.write('.hide-on-print, .no-print, .top-nav, .header-bar .print-btn, .header-bar .close-btn, .top-form-row-single{display:none !important;}');
        printWindow.document.write('#warpDesignTitle, #weftDesignTitle{display:block !important; font-size:12px !important; font-weight:700 !important; color:#000000 !important; margin-bottom:4px !important;}');
        printWindow.document.write('.company-header{text-align:center; border-bottom:2px solid #4A7C59; padding-bottom:5px; margin-bottom:7px;}');
        printWindow.document.write('.company-header h1{font-size:16px; color:#DAA520; font-weight:700; text-transform:uppercase;}');
        printWindow.document.write('.company-header p{font-size:9px; color:#DAA520; white-space:pre-line;}');
        printWindow.document.write('.design-info-box, .weft-info-box{background:#FFF8E1 !important; border:2px solid #4A7C59; border-radius:6px; padding:9px 10px; display:grid; grid-template-columns:repeat(4,1fr); gap:6px; font-size:12px; font-weight:700; color:#1F2937 !important; margin-bottom:6px;}');
        printWindow.document.write('.section-title{font-size:10px; color:#ffffff !important; background:#4A7C59 !important; padding:5px 8px; border-radius:6px; display:inline-block; margin:6px 0 4px; font-weight:700;}');
        printWindow.document.write('table{width:100% !important; border-collapse:collapse !important; font-size:11px !important; text-align:center !important;}');
        printWindow.document.write('th, td{padding:6px 4px !important; color:#1E2B23 !important; border:none !important;}');
        printWindow.document.write('th{background:#EAF0EA !important; color:#2F4F38 !important; font-weight:700; font-size:10px; border-top:2px solid #4A7C59 !important; border-bottom:2px solid #4A7C59 !important;}');
        printWindow.document.write('.col-set{border-left:1px dashed #CBD5CB !important;}');
        printWindow.document.write('.summary-box{background:#F4F7F4 !important; border:1px dashed #CBD5CB; border-radius:6px; padding:6px 8px; text-align:center; font-size:10px; font-weight:600; color:#2F4F38 !important; margin:6px 0;}');
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    } else {
        window.print();
    }
};

// எல்லா பக்கங்களிலும் உள்ள Print பட்டன்களைத் தானாகவே இணைப்பது (Auto-bind)
document.addEventListener("DOMContentLoaded", () => {
    const bindPrintButtons = () => {
        const buttons = document.querySelectorAll('button, .print-btn, [id*="print"], [class*="print"]');
        
        buttons.forEach(btn => {
            const text = (btn.innerText || btn.value || "").toLowerCase();
            const id = (btn.id || "").toLowerCase();
            const className = (typeof btn.className === 'string' ? btn.className : "").toLowerCase();
            
            if (text.includes('print') || id.includes('print') || className.includes('print')) {
                if (!btn.getAttribute('data-print-bound')) {
                    btn.setAttribute('data-print-bound', 'true');
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (window._isPrintingInProgress) return;
                        window._isPrintingInProgress = true;

                        window.appPrint();

                        setTimeout(() => {
                            window._isPrintingInProgress = false;
                        }, 1000);
                    });
                }
            }
        });
    };

    bindPrintButtons();

    const observer = new MutationObserver(() => {
        bindPrintButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
