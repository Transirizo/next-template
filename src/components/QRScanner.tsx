"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QRScannerProps {
  onScanSuccess: (assetCode: string) => void;
  onScanError?: (error: string) => void;
}

declare global {
  interface Window {
    tt: any;
  }
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // 使用飞书扫码API
  const startFeishuScan = useCallback(() => {
    if (typeof window === 'undefined' || !window.tt) {
      toast.error('请在飞书环境中使用扫码功能');
      return;
    }

    setIsScanning(true);
    
    window.tt.scanCode({
      success: (res: any) => {
        console.log('扫码成功:', res);
        const result = res.result || res.code || res.text;
        
        if (result) {
          // 从二维码结果中提取资产编码
          // 假设二维码内容是直接的资产编码或包含资产编码的URL
          let assetCode = result;
          
          // 如果是URL格式，尝试提取参数
          try {
            const url = new URL(result);
            const codeParam = url.searchParams.get('code') || url.searchParams.get('assetCode');
            if (codeParam) {
              assetCode = codeParam;
            }
          } catch {
            // 如果不是URL格式，直接使用原始结果
          }
          
          toast.success('扫码成功');
          onScanSuccess(assetCode);
        } else {
          toast.error('未识别到有效的二维码');
          onScanError?.('未识别到有效的二维码');
        }
        setIsScanning(false);
      },
      fail: (error: any) => {
        console.error('扫码失败:', error);
        toast.error('扫码失败，请重试');
        onScanError?.(error.errMsg || '扫码失败');
        setIsScanning(false);
      },
      complete: () => {
        setIsScanning(false);
      }
    });
  }, [onScanSuccess, onScanError]);

  // 手动输入资产编码
  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      toast.error('请输入资产编码');
      return;
    }
    
    toast.success('编码输入成功');
    onScanSuccess(manualCode.trim());
    setManualCode('');
    setShowManualInput(false);
  };

  // Web端模拟扫码（开发用）
  const simulateScan = () => {
    const mockCodes = ['ZC-2025-001', 'ZC-2025-002', 'ZC-2025-003'];
    const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
    
    setIsScanning(true);
    setTimeout(() => {
      toast.success('模拟扫码成功');
      onScanSuccess(randomCode);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="text-center space-y-6">
        {/* 扫码图标 */}
        <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 4h4m12 0h2M4 20h4m12 0h2" />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">扫描资产二维码</h2>
          <p className="text-gray-600">请对准资产上的二维码进行扫描</p>
        </div>

        {/* 扫码按钮 */}
        <div className="space-y-3">
          <Button
            onClick={startFeishuScan}
            disabled={isScanning}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg"
          >
            {isScanning ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>扫描中...</span>
              </div>
            ) : (
              '开始扫码'
            )}
          </Button>

          {/* 手动输入选项 */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-sm"
            >
              手动输入资产编码
            </Button>
          </div>

          {/* 开发环境模拟按钮 */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outline"
              onClick={simulateScan}
              disabled={isScanning}
              className="w-full text-sm text-gray-500"
            >
              {isScanning ? '模拟扫描中...' : '模拟扫码 (开发用)'}
            </Button>
          )}
        </div>

        {/* 手动输入框 */}
        {showManualInput && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="请输入资产编码，如：ZC-2025-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
            <div className="flex space-x-2">
              <Button onClick={handleManualSubmit} className="flex-1">
                确认
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowManualInput(false);
                  setManualCode('');
                }}
                className="flex-1"
              >
                取消
              </Button>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>• 请确保二维码清晰可见</p>
          <p>• 保持手机稳定，避免抖动</p>
          <p>• 如有问题，可联系管理员</p>
        </div>
      </div>
    </div>
  );
}