'use client'

import React, { useState, useMemo, useCallback } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table'

// UI Components
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Badge } from '@components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar'
import { Skeleton } from '@components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'

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
} from 'lucide-react'

// Types and Utils
import { getServiceImageUrl } from '@lib/image-utils'

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  image?: string
  is_active: boolean
  category?: any
}

// Export libraries
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ServicesDataTableProps {
  data: Service[]
  loading: boolean
  onRefresh: () => void
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
  onAdd: () => void
  totalCount?: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

const ServicesDataTable: React.FC<ServicesDataTableProps> = ({
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
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  // Define columns with optimized rendering
  const columns = useMemo<ColumnDef<Service>[]>(
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
        header: 'Image',
        cell: ({ row }) => (
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={getServiceImageUrl(row.getValue('image'))} 
              alt={row.getValue('name') as string} 
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
            className="h-8 p-0 hover:bg-transparent"
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
          <div className="font-medium">
            {row.getValue('name')}
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
          const category = row.getValue('category') as any;
          return (
            <div className="text-sm">
              {category?.name || 'N/A'}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          const category = row.getValue(id) as any;
          return value.includes(category?.name || '');
        },
      },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 p-0 hover:bg-transparent"
          >
            Price
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
          <div className="font-medium">
            RM {parseFloat(row.getValue('price')).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: 'duration',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 p-0 hover:bg-transparent"
          >
            Duration
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
            {row.getValue('duration')} min
          </div>
        ),
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
          const isActive = row.getValue('is_active') as boolean;
          return (
            <Badge
              className={`${
                isActive 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-red-100 text-red-800 border-red-200'
              } font-medium border`}
            >
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          const isActive = row.getValue(id) as boolean;
          return value.includes(isActive ? 'active' : 'inactive');
        },
      },
      {
        accessorKey: 'created_at',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 p-0 hover:bg-transparent"
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
                Edit Service
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Service
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
  )

  // Initialize table with server-side pagination if provided
  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: currentPage - 1,
      pageSize,
    }),
    [currentPage, pageSize]
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  })

  // Export functions
  const exportToPDF = useCallback(() => {
    const doc = new jsPDF()
    
    const tableColumn = [
      'No.',
      'Name',
      'Category', 
      'Price',
      'Duration',
      'Status',
      'Created',
    ]
    
    const tableRows = data.map((service, index) => [
      (currentPage - 1) * pageSize + index + 1,
      service.name,
      service.category?.name || 'N/A',
      `RM ${service.price}`,
      `${service.duration} min`,
      service.is_active ? 'Active' : 'Inactive',
      new Date(service.created_at).toLocaleDateString(),
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    })

    doc.text('Services Report', 14, 15)
    doc.save('services-report.pdf')
  }, [data, currentPage, pageSize])

  const exportToCSV = useCallback(() => {
    const csvContent = [
      ['No.', 'Name', 'Category', 'Price', 'Duration', 'Status', 'Created'],
      ...data.map((service, index) => [
        (currentPage - 1) * pageSize + index + 1,
        service.name,
        service.category?.name || 'N/A',
        `RM ${service.price}`,
        `${service.duration} min`,
        service.is_active ? 'Active' : 'Inactive',
        new Date(service.created_at).toLocaleDateString(),
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'services-report.csv')
  }, [data, currentPage, pageSize])

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((service, index) => ({
        'No.': (currentPage - 1) * pageSize + index + 1,
        Name: service.name,
        Category: service.category?.name || 'N/A',
        Price: `RM ${service.price}`,
        Duration: `${service.duration} min`,
        Status: service.is_active ? 'Active' : 'Inactive',
        Created: new Date(service.created_at).toLocaleDateString(),
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Services')
    XLSX.writeFile(workbook, 'services-report.xlsx')
  }, [data, currentPage, pageSize])

  // Handle pagination changes
  const handlePageChange = useCallback((newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage)
    }
  }, [onPageChange])

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize)
    }
  }, [onPageSizeChange])

  // Loading skeleton
  if (loading && data.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:space-x-2">
          {/* Global Search */}
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-8"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={(table.getColumn('is_active')?.getFilterValue() as string[])?.join(',') ?? 'all'}
            onValueChange={(value) => {
              table.getColumn('is_active')?.setFilterValue(value !== 'all' ? [value] : undefined)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
                  )
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
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToCSV}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onAdd} size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id}
                      className="whitespace-nowrap"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className="whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? 'Loading services...' : 'No services found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to{' '}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} services
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
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
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">
                Page {currentPage} of {Math.ceil(totalCount / pageSize)}
              </span>
            </div>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalCount / pageSize)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(Math.ceil(totalCount / pageSize))}
              disabled={currentPage >= Math.ceil(totalCount / pageSize)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesDataTable
