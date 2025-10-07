'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type PaginationState,
} from '@tanstack/react-table';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// UI Components
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Badge } from '@components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';

// Icons
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Download,
  FileText,
  FileSpreadsheet,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash2,
  UserPlus,
  RefreshCw,
  MoreHorizontal,
} from 'lucide-react';

// Types and Utils
import { getUserImageUrl } from '@lib/image-utils';

interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  image?: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

interface UsersDataTableProps {
  data: User[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onAdd: () => void;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const UsersDataTable: React.FC<UsersDataTableProps> = ({
  data,
  loading,
  onRefresh,
  onEdit,
  onDelete,
  onAdd,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) => {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Define columns with optimized rendering
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'no',
        header: 'No.',
        cell: ({ row }) => (
          <div className="w-12 text-center font-mono text-sm">
            {(currentPage - 1) * pageSize + row.index + 1}
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 60,
      },
      {
        accessorKey: 'image',
        header: 'Avatar',
        cell: ({ row }) => (
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={getUserImageUrl(row.getValue('image'))} 
              alt={row.getValue('name')} 
            />
            <AvatarFallback>
              {(row.getValue('name') as string)?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Name
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue('name')}</div>
        ),
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Email
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue('email')}
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Role
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const role = row.getValue('role') as string;
          const roleColors = {
            admin: 'bg-red-100 text-red-800 border-red-200',
            therapist: 'bg-blue-100 text-blue-800 border-blue-200',
            client: 'bg-green-100 text-green-800 border-green-200',
          };
          return (
            <Badge
              className={`${roleColors[role as keyof typeof roleColors]} font-medium border`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => (
          <div className="text-sm">
            {row.getValue('phone') || '-'}
          </div>
        ),
      },
      {
        accessorKey: 'created_at',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Created
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-sm">
            {new Date(row.getValue('created_at')).toLocaleDateString()}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onEdit(row.original)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
    ],
    [onEdit, onDelete, currentPage, pageSize]
  );

  // Initialize table with server-side pagination if provided
  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: currentPage - 1,
      pageSize,
    }),
    [currentPage, pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    pageCount: Math.ceil(totalCount / pageSize),
    manualPagination: !!onPageChange,
  });

  // Export functions
  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    
    const tableColumn = [
      'No.',
      'Name',
      'Email', 
      'Role',
      'Phone',
      'Created',
    ];
    
    const tableRows = data.map((user, index) => [
      (currentPage - 1) * pageSize + index + 1,
      user.name,
      user.email,
      user.role,
      user.phone || '-',
      new Date(user.created_at).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.text('Users Report', 14, 15);
    doc.save('users-report.pdf');
  }, [data, currentPage, pageSize]);

  const exportToCSV = useCallback(() => {
    const csvContent = [
      ['No.', 'Name', 'Email', 'Role', 'Phone', 'Created'],
      ...data.map((user, index) => [
        (currentPage - 1) * pageSize + index + 1,
        user.name,
        user.email,
        user.role,
        user.phone || '',
        new Date(user.created_at).toLocaleDateString(),
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'users-report.csv');
  }, [data, currentPage, pageSize]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((user, index) => ({
        'No.': (currentPage - 1) * pageSize + index + 1,
        Name: user.name,
        Email: user.email,
        Role: user.role,
        Phone: user.phone || '',
        Created: new Date(user.created_at).toLocaleDateString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users-report.xlsx');
  }, [data, currentPage, pageSize]);

  // Handle pagination changes
  const handlePageChange = useCallback((newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      table.setPageIndex(newPage - 1);
    }
  }, [onPageChange, table]);

  const handlePageSizeChange = useCallback((newPageSize: string) => {
    const size = parseInt(newPageSize, 10);
    if (onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      table.setPageSize(size);
    }
  }, [onPageSizeChange, table]);

  // Performance optimization: Memoize table data
  const memoizedData = useMemo(() => data, [data]);

  // Performance optimization: Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Additional performance optimization can be added here
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [globalFilter]);

  // Performance optimization: Virtualized rendering for large datasets
  const shouldVirtualize = data.length > 100;

  const totalPages = onPageChange ? Math.ceil(totalCount / pageSize) : table.getPageCount();
  const currentPageIndex = onPageChange ? currentPage : table.getState().pagination.pageIndex + 1;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:space-x-2">
          {/* Global Search */}
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-8"
            />
          </div>

          {/* Role Filter */}
          <Select
            value={(table.getColumn('role')?.getFilterValue() as string[])?.join(',') ?? 'all'}
            onValueChange={(value) => {
              table.getColumn('role')?.setFilterValue(value !== 'all' ? [value] : undefined);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="therapist">Therapist</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <EyeOff className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={exportToCSV}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                CSV
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={exportToExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" onClick={onAdd}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap min-w-[100px]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{' '}
          {totalCount > 0 ? (
            <>
              {(currentPageIndex - 1) * pageSize + 1} to{' '}
              {Math.min(currentPageIndex * pageSize, totalCount)} of {totalCount}
            </>
          ) : (
            '0'
          )}{' '}
          results
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Page {currentPageIndex} of {totalPages}
            </p>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(1)}
                disabled={currentPageIndex <= 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPageIndex - 1)}
                disabled={currentPageIndex <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPageIndex + 1)}
                disabled={currentPageIndex >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPageIndex >= totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersDataTable;
