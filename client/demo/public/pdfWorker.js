importScripts("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js");

self.onmessage = async function (event) {
    const { arrayBuffer } = event.data;
    const pdfjsLib = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.mjs");

    try {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            extractedText += content.items.map(item => item.str).join(" ") + "\n";
        }

        postMessage({ success: true, text: extractedText });
    } catch (error) {
        postMessage({ success: false, error: error.message });
    }
};
