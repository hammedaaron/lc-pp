import React from 'react';
import { CoinConfig } from '../types';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  coin: CoinConfig | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  coin,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !coin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-5 text-center">
        <div className="w-9 h-9 rounded-full bg-[#ff3b30]/10 dark:bg-[#ff453a]/20 text-[#ff3b30] dark:text-[#ff453a] flex items-center justify-center mx-auto mb-2.5">
          <AlertTriangle className="w-4 h-4" />
        </div>

        <h3 className="text-xs font-semibold text-[#1d1d1f] dark:text-white mb-1">
          Delete {coin.name}?
        </h3>
        <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mb-4">
          This will remove {coin.pair} from your saved watchlist.
        </p>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 text-xs text-[#1d1d1f] dark:text-white bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] rounded-md transition-colors font-medium min-h-[38px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 text-xs bg-[#ff3b30] hover:bg-[#d70015] text-white font-medium rounded-md transition-colors shadow-2xs min-h-[38px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
