import React from 'react';
import { AdminOverview } from '../../../components/admin/AdminOverview';
import { LowStockAlert } from '../components/LowStockAlert';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <LowStockAlert onFilterLowStock={() => navigate('/admin/inventory')} />
      <AdminOverview />
    </div>
  );
};

export default DashboardPage;
