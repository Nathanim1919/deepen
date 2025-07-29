export const PDFViewer = ({ pdfUrl }: { pdfUrl: string }) => {
    return (
      <div className="w-full h-screen">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          title="Embedded PDF"
        />
      </div>
    );
  };
  