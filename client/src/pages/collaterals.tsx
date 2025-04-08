import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CollateralIcon } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function CollateralsPage() {
  const { data: collaterals, isLoading } = useQuery({
    queryKey: ['/api/collaterals'],
  });

  const formatCurrency = (amount: number, currency = 'NPR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatCrypto = (amount: number, symbol: string) => {
    return `${amount.toFixed(8)} ${symbol}`;
  };

  const getCollateralStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'liquidated':
        return 'bg-red-500';
      case 'released':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Crypto Collaterals</h1>
          <p className="text-muted-foreground">Manage your collateral assets for loans</p>
        </div>
        <Button>Add Collateral</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Collaterals</CardTitle>
            <CollateralIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : collaterals?.filter(c => c.status === 'active').length || 0}</div>
            <p className="text-xs text-muted-foreground">Current locked collaterals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <CollateralIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : formatCurrency(collaterals?.reduce((sum, c) => sum + c.value_in_npr, 0) || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total collateral value (NPR)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loan-to-Value Ratio</CardTitle>
            <CollateralIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">Maximum LTV ratio</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collateral Assets</CardTitle>
          <CardDescription>Your locked and historical collateral assets</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : collaterals?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Value (NPR)</TableHead>
                  <TableHead>LTV</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(collaterals || []).map((collateral) => (
                  <TableRow key={collateral.id}>
                    <TableCell className="font-medium">#{collateral.id}</TableCell>
                    <TableCell>{collateral.asset_symbol}</TableCell>
                    <TableCell>{formatCrypto(collateral.amount, collateral.asset_symbol)}</TableCell>
                    <TableCell>{formatCurrency(collateral.value_in_npr)}</TableCell>
                    <TableCell>{collateral.ltv_ratio}%</TableCell>
                    <TableCell>
                      <Badge className={getCollateralStatusColor(collateral.status)}>{collateral.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDistanceToNow(new Date(collateral.created_at), { addSuffix: true })}</TableCell>
                    <TableCell>
                      {collateral.status === 'active' && !collateral.loan_id && (
                        <Button variant="outline" size="sm">
                          Release
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <CollateralIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No collaterals yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add a collateral asset to secure loans with better terms
              </p>
              <Button className="mt-4">Add Collateral</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported Collateral Assets</CardTitle>
          <CardDescription>Assets accepted for collateral and their terms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Max LTV</TableHead>
                <TableHead>Liquidation Threshold</TableHead>
                <TableHead>Liquidation Penalty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">BNB</TableCell>
                <TableCell>70%</TableCell>
                <TableCell>75%</TableCell>
                <TableCell>10%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ETH</TableCell>
                <TableCell>65%</TableCell>
                <TableCell>70%</TableCell>
                <TableCell>10%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">BTC</TableCell>
                <TableCell>60%</TableCell>
                <TableCell>65%</TableCell>
                <TableCell>12.5%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}