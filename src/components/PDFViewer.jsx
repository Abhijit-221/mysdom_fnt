import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';

// ✅ CSS (optional but good)
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// ✅ Worker fix (THIS is the key)
import workerSrc from 'pdfjs-dist/build/pdf.worker?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFViewer({ url }) {
    const [numPages, setNumPages] = useState(0);

    return (
        <div style={{
            maxWidth: '100%',
            margin: 'auto',
            padding: '20px',
            background: '#f5f5f5',
            borderRadius: '10px',
            maxHeight: '300px',
            overflow: 'auto'
        }}>
            <Document
                file={url}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
                {Array.from({ length: numPages }, (_, index) => (
                    <Page
                        key={index}
                        pageNumber={index + 1}
                        width={600}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                ))}
            </Document>
        </div>
    );
}