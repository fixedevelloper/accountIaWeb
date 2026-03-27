
import {FileText} from "lucide-react";
import {DocumentExtraction,Document} from "../../types/types";

export const DocumentPreviewCard = ({ document }: { document: Document }) => {

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Aperçu du document
                </h2>
            </div>

            <div className="bg-gray-50 p-2 border-b border-gray-100 flex items-center justify-center h-72 sm:h-80 md:h-96">
                {document?.file_path ? (
                    document.file_path.endsWith(".pdf") ? (
                        <iframe
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${document.file_path}`}
                            className="w-full h-full rounded-lg shadow-sm border border-gray-200"
                        />
                    ) : (
                        <img
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${document.file_path}`}
                            className="max-h-full max-w-full object-contain rounded-lg shadow-md border border-gray-200"
                            alt="Document"
                        />
                    )
                ) : (
                    <div className="text-center text-gray-400 py-8">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Aucun document chargé</p>
                    </div>
                )}
            </div>
        </div>
    );
};