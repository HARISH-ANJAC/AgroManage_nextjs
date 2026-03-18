"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pencil, Trash2, Eye, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchPlaceholder?: string;
  loading?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  onPrint?: (row: any) => void;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

export function DataTable({ 
  columns, 
  data, 
  searchPlaceholder = "Search...", 
  loading, 
  onEdit, 
  onDelete, 
  onView, 
  onPrint, 
  selectedRows = [], 
  onSelectionChange 
}: DataTableProps) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((row) =>
    columns.some((col) => {
      const val = row[col.key];
      return val && String(val).toLowerCase().includes(search.toLowerCase());
    })
  );

  const showActions = onEdit || onDelete || onView || onPrint;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (selectedRows.length === filtered.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filtered.map(row => row.id));
    }
  };

  const toggleRow = (id: string | number) => {
    if (!onSelectionChange) return;
    if (selectedRows.includes(id)) {
      onSelectionChange(selectedRows.filter(rowId => rowId !== id));
    } else {
      onSelectionChange([...selectedRows, id]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={searchPlaceholder} className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {onSelectionChange && (
              <TableHead className="w-[50px] text-center">
                <Checkbox 
                  checked={filtered.length > 0 && selectedRows.length === filtered.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
            )}
            {showActions && (
              <TableHead className="font-display text-xs uppercase tracking-wide text-center w-[140px]">Actions</TableHead>
            )}
            {columns.map((col) => (
              <TableHead key={col.key} className="font-display text-xs uppercase tracking-wide">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                {onSelectionChange && <TableCell><Skeleton className="h-5 w-5 mx-auto" /></TableCell>}
                {showActions && <TableCell><Skeleton className="h-5 w-16" /></TableCell>}
                {columns.map((col) => (
                  <TableCell key={col.key}><Skeleton className="h-5 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (showActions ? 1 : 0) + (onSelectionChange ? 1 : 0)} className="text-center py-12 text-muted-foreground">
                No records found. Create your first entry to get started.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((row, i) => (
              <TableRow key={row.id || i} className={`hover:bg-muted/30 ${selectedRows.includes(row.id) ? 'bg-primary/5' : ''}`}>
                {onSelectionChange && (
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={() => toggleRow(row.id)}
                    />
                  </TableCell>
                )}
                {showActions && (
                  <TableCell className="py-4 px-6 text-center">
                    <div className="flex gap-2 justify-center">
                      {onView && (
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:text-primary hover:bg-primary/10 transition-all active:scale-90" onClick={() => onView(row)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onPrint && (
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all active:scale-90" onClick={() => onPrint(row)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-90" onClick={() => onEdit(row)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all active:scale-90" onClick={() => onDelete(row)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key} className="py-4 px-6 font-semibold text-slate-900">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
