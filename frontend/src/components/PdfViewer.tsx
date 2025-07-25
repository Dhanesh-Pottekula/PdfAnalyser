import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './PdfViewer.css';

type Props = {
    fileUrl: string;
};

const PDFViewerComponent = ({ fileUrl }: Props) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div className="flex-1 h-full bg-white rounded-lg shadow-soft overflow-hidden">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
};

export default PDFViewerComponent;
