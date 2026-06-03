import React from 'react';
import { Package, Layers, AlertTriangle, DollarSign } from 'lucide-react';
import { StatCard } from './StatCard';
import type { DashboardSummary } from '../../../shared/types/dashboard.types';

interface Props { data: DashboardSummary; }

export const StatsGrid: React.FC<Props> = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard label="Total Products"     value={data.totalProducts}                                            icon={Package}       accent="teal"  />
    <StatCard label="Total Units"        value={data.totalUnits.toLocaleString()}                              icon={Layers}        accent="blue"  />
    <StatCard label="Inventory Value"    value={`$${data.totalInventoryValue.toLocaleString()}`}               icon={DollarSign}    accent="amber" />
    <StatCard label="Low Stock Items"    value={data.lowStockCount} sublabel="Needs attention"                 icon={AlertTriangle} accent="red"   />
  </div>
);