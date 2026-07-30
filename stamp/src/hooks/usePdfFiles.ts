import { useState, useCallback } from 'react';

export interface PdfFile {
  id: string;
  file: File;
  name: string;
  pageCount?: number;
  error?: string;
}

export function usePdfFiles() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [password, setPassword] = useState('');

  const addFiles = useCallback((newFiles: File[]) => {
    const valid = newFiles.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name + f.file.size));
      const toAdd = valid
        .filter(f => !existing.has(f.name + f.size))
        .map(f => ({
          id: Math.random().toString(36).slice(2),
          file: f,
          name: f.name,
        }));
      return [...prev, ...toAdd];
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
  }, []);

  return { files, password, setPassword, addFiles, removeFile, clearAll };
}
