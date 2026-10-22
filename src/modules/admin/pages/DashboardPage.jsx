import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminOverview } from '../../../components/admin/AdminOverview';
import { LowStockAlert } from '../components/LowStockAlert';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (tab) => {
    switch (tab) {
      case 'inventory':
        navigate('/admin/inventory');
        break;
      case 'add-product':
        navigate('/admin/add-product');
        break;
      case 'orders':
        navigate('/admin/orders');
        break;
      case 'banners':
        navigate('/admin/banners');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      default:
        navigate('/admin');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <LowStockAlert onFilterLowStock={() => navigate('/admin/inventory')} />
      <AdminOverview onNavigate={handleNavigate} />
    </div>
  );
};

export default DashboardPage;
