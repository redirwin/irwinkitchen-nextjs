"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete this recipe? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
