import { useState, useCallback } from 'react';
import type { QfzConfig, YzConfig } from '../lib/pdfProcessor';

export function useStamp() {
  const [stampBlob, setStampBlob] = useState<Blob | null>(null);
  const [stampUrl, setStampUrl] = useState<string | null>(null);
  const [stampName, setStampName] = useState('');

  const [qfzConfig, setQfzConfig] = useState<QfzConfig>({
    enabled: true,
    mode: 0,
    side: 'right',
    verticalPos: 50,
    maxfgs: 20,
    sizeMm: 40,
    opacity: 100,
    removeWhite: true,
    whiteThreshold: 230,
    multiply: true,
  });

  const [yzConfig, setYzConfig] = useState<YzConfig>({
    enabled: false,
    pages: 'custom',
    customPositions: {} as Record<string, Record<number, Array<{ posX: number; posY: number }>>>,
    sizeMm: 40,
    rotation: 0,
    opacity: 100,
    posX: 0.5,
    posY: 0.5,
    removeWhite: true,
    whiteThreshold: 230,
    random: false,
    multiply: true,
  });

  const loadStamp = useCallback(async (file: File) => {
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    const url = URL.createObjectURL(blob);
    setStampBlob(blob);
    setStampUrl(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
    setStampName(file.name);
  }, []);

  const clearStamp = useCallback(() => {
    if (stampUrl) URL.revokeObjectURL(stampUrl);
    setStampBlob(null);
    setStampUrl(null);
    setStampName('');
  }, [stampUrl]);

  const updateQfz = useCallback(<K extends keyof QfzConfig>(key: K, value: QfzConfig[K]) => {
    setQfzConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateYz = useCallback(<K extends keyof YzConfig>(key: K, value: YzConfig[K]) => {
    setYzConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    stampBlob, stampUrl, stampName,
    qfzConfig, yzConfig,
    loadStamp, clearStamp, updateQfz, updateYz,
  };
}
