import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf"; // react-pdf
import { FileText } from "lucide-react";

export default function DocumentPreview({ document }: { document: { file_path?: string } }) {
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);

    useEffect(() => {
        if (!document?.file_path) return;

        const fetchPdf = async () => {
            try {
                if (document?.file_path?.endsWith(".pdf")) {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_URL}/${document?.file_path}`);
                    const blob = await res.blob();
                    setPdfBlob(blob);
                } else {
                    setPdfBlob(null);
                }
            } catch (error) {
                console.error("Erreur chargement PDF:", error);
            }
        };

        fetchPdf();
    }, [document]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    if (!document?.file_path) {
        return (
            <div className="text-center text-gray-400 py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>Aucun document chargé</p>
            </div>
        );
    }

    return (
        <div className="p-2 flex items-center justify-center h-[500px] bg-white/70 rounded-2xl shadow-xl border border-white/50">
            {pdfBlob ? (
                <div className="w-full h-full overflow-auto">
                    <Document
                        file={pdfBlob}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex flex-col items-center gap-2 p-8 text-gray-500">
                                <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                                <span>Chargement PDF...</span>
                            </div>
                        }
                        error={<p className="text-red-500 text-center">Impossible de charger le PDF</p>}
                    >
                        {Array.from(new Array(numPages || 1), (_, i) => (
                            <Page
                                key={`page_${i + 1}`}
                                pageNumber={i + 1}
                                width={Math.min(window.innerWidth * 0.8, 800)}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                        ))}
                    </Document>
                </div>
            ) : (
                <img
                    src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${document.file_path}`}
                    className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                    alt="Document"
                />
            )}
        </div>
    );
}