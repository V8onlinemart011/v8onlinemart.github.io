import React from 'react';
import { InventoryTable } from '../../../components/admin/InventoryTable';
import { LowStockAlert } from '../components/LowStockAlert';

export const InventoryPage = () => {
  return (
    <div className="space-y-6">
      <LowStockAlert />
      <InventoryTable />
    </div>
  );
};

export default InventoryPage;
