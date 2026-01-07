import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const CustomerStatement: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Statement</h1>
        <div className="flex items-center space-x-4">
          <Button>Print Statement</Button>
          <Button variant="outline">Export to Excel</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statement Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Customer No.</Label>
              <Input placeholder="Enter customer number" />
            </div>
            <div className="space-y-2">
              <Label>From Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button>Generate Statement</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Statement Details</CardTitle>
            <div className="text-sm text-gray-500">
              {date && endDate && (
                <span>
                  {format(date, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">Opening Balance</p>
                <p className="text-sm text-gray-500">As of {date && format(date, 'MMM d, yyyy')}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$0.00</p>
              </div>
            </div>

            {/* Transaction list would go here */}
            <div className="border rounded-md divide-y">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="font-medium">Invoice INV-{1000 + item}</p>
                    <p className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$1,234.56</p>
                    <p className="text-sm text-green-600">Paid</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
              <p className="font-medium">Ending Balance</p>
              <p className="font-bold">$3,703.68</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerStatement;
