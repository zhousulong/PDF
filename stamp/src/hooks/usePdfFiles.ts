import { useState, useCallback } from 'react';
import { convertToPdf, detectSourceKind, type SourceKind } from '../lib/documentToPdf';

export interface PdfFile {
  id: string;
  file: File;
  name: string;
  pageCount?: number;
  error?: string;
  sourceKind: SourceKind;
  originalName: string;
  converting?: boolean;
}

function fileKey(file: File): string {
  return file.name + file.size;
}

export function usePdfFiles() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [password, setPassword] = useState('');

  const addFiles = useCallback((newFiles: File[]) => {
    const incoming = newFiles.map((file) => {
      const sourceKind = detectSourceKind(file);
      const needsConvert = sourceKind !== 'pdf';
      const entry: PdfFile = {
        id: Math.random().toString(36).slice(2),
        file,
        name: file.name,
        sourceKind,
        originalName: file.name,
        converting: needsConvert && sourceKind !== 'legacy_office' && sourceKind !== 'unsupported',
        error:
          sourceKind === 'legacy_office'
            ? 'legacy_office'
            : sourceKind === 'unsupported'
              ? 'unsupported_format'
              : undefined,
      };
      return entry;
    });

    setFiles((prev) => {
      const existing = new Set(prev.map((f) => fileKey(f.file) + f.originalName));
      return [...prev, ...incoming.filter((f) => !existing.has(fileKey(f.file) + f.originalName))];
    });

    incoming.forEach((entry) => {
      if (!entry.converting) return;
      void convertToPdf(entry.file)
        .then((pdfFile) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, file: pdfFile, name: pdfFile.name, converting: false }
                : f
            )
          );
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : 'convert_failed';
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id ? { ...f, converting: false, error: message } : f
            )
          );
        });
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
  }, []);

  return { files, password, setPassword, addFiles, removeFile, clearAll };
}
