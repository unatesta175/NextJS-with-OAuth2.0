'use client'

import React, { useState } from 'react'
import Image from 'next/image'
// DashboardLayout is now handled by layout.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Badge } from '@components/ui/badge'
import { Switch } from '@components/ui/switch'
import { Checkbox } from '@components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import { Label } from '@components/ui/label'
import { Textarea } from '@components/ui/textarea'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs' // Unused
import {
  MoreHorizontal,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  Grid3X3,
  List
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive'
  image?: string
  branchesAvailable: string[]
  salesCount: number
  revenue: number
}

// Sample data
const categoriesData = [
  { id: 'skincare', name: 'Skincare' },
  { id: 'haircare', name: 'Hair Care' },
  { id: 'bodycare', name: 'Body Care' },
  { id: 'makeup', name: 'Makeup' },
  { id: 'tools', name: 'Tools & Equipment' }
]

const branchesData = [
  { id: 'main', name: 'Main Branch' },
  { id: 'pj', name: 'Petaling Jaya' },
  { id: 'shah-alam', name: 'Shah Alam' }
]

const productsData: Product[] = [
  {
    id: 'P001',
    name: 'Hydrating Face Serum',
    description: 'Premium hydrating serum for all skin types',
    category: 'skincare',
    price: 89.90,
    stock: 25,
    status: 'active',
    branchesAvailable: ['main', 'pj'],
    salesCount: 45,
    revenue: 4045.50
  },
  {
    id: 'P002',
    name: 'Luxury Hair Treatment Oil',
    description: 'Nourishing hair oil with natural ingredients',
    category: 'haircare',
    price: 65.00,
    stock: 18,
    status: 'active',
    branchesAvailable: ['main', 'pj', 'shah-alam'],
    salesCount: 32,
    revenue: 2080.00
  },
  {
    id: 'P003',
    name: 'Body Moisturizing Cream',
    description: 'Rich moisturizing cream for smooth skin',
    category: 'bodycare',
    price: 45.00,
    stock: 0,
    status: 'active',
    branchesAvailable: ['pj'],
    salesCount: 28,
    revenue: 1260.00
  },
  {
    id: 'P004',
    name: 'Professional Jade Roller',
    description: 'Authentic jade roller for facial massage',
    category: 'tools',
    price: 35.00,
    stock: 12,
    status: 'inactive',
    branchesAvailable: ['main'],
    salesCount: 15,
    revenue: 525.00
  }
]

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [currentPage] = useState(1) // setCurrentPage removed as unused
  const [pageSize, setPageSize] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  // const [selectedProducts] = useState<string[]>([]) // Completely unused, commented out
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    status: 'active' as Product['status'],
    branchesAvailable: [] as string[]
  })


  // Filter products
  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil(filteredProducts.length / pageSize)

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      status: 'active',
      branchesAvailable: []
    })
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      branchesAvailable: product.branchesAvailable
    })
    setIsDialogOpen(true)
  }

  const handleSaveProduct = async () => {
    try {
      setIsSubmitting(true)
      console.log('Save product:', formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to save product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryName = (categoryId: string) => {
    return categoriesData.find(cat => cat.id === categoryId)?.name || categoryId
  }

  const getBranchNames = (branchIds: string[]) => {
    return branchIds.map(id => branchesData.find(branch => branch.id === id)?.name || id)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' }
  }

  const ProductGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedProducts.map((product) => (
        <div key={product.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            {product.image ? (
              <Image src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" width={192} height={192} />
            ) : (
              <Package className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold">RM {product.price.toFixed(2)}</span>
              <Badge className={getStockStatus(product.stock).color}>
                {product.stock} left
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {getCategoryName(product.category)}
              </Badge>
              <Badge className={statusConfig[product.status].color}>
                {statusConfig[product.status].label}
              </Badge>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" className="text-red-600">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const ProductTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox />
          </TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Branches</TableHead>
          <TableHead>Sales</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {product.image ? (
                    <Image src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" width={48} height={48} />
                  ) : (
                    <Package className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {getCategoryName(product.category)}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">RM {product.price.toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span>{product.stock}</span>
                <Badge className={getStockStatus(product.stock).color}>
                  {getStockStatus(product.stock).label}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {getBranchNames(product.branchesAvailable).slice(0, 2).map((branchName, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {branchName}
                  </Badge>
                ))}
                {product.branchesAvailable.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.branchesAvailable.length - 2}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{product.salesCount} sold</div>
                <div className="text-gray-500">RM {product.revenue.toFixed(2)}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge className={statusConfig[product.status].color}>
                  {statusConfig[product.status].label}
                </Badge>
                <Switch
                  checked={product.status === 'active'}
                />
              </div>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-600 mt-1">Manage spa products and inventory</p>
          </div>
          <Button onClick={handleAddProduct} className="bg-[#ff0a85] hover:bg-[#ff0a85]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesData.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Products Display */}
          {viewMode === 'grid' ? (
            <ProductGrid />
          ) : (
            <div className="border rounded-lg">
              <ProductTable />
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show</span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">of {filteredProducts.length} results</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1}>Previous</Button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages}>Next</Button>
            </div>
          </div>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update product information.' : 'Create a new product.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categoriesData.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value: Product['status']) => setFormData({...formData, status: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Price (RM)</Label>
                  <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="grid gap-2">
                  <Label>Stock Quantity</Label>
                  <Input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Branch Availability</Label>
                <div className="grid grid-cols-2 gap-2">
                  {branchesData.map((branch) => (
                    <div key={branch.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.branchesAvailable.includes(branch.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({...formData, branchesAvailable: [...formData.branchesAvailable, branch.id]})
                          } else {
                            setFormData({...formData, branchesAvailable: formData.branchesAvailable.filter(id => id !== branch.id)})
                          }
                        }}
                      />
                      <Label className="text-sm">{branch.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveProduct} loading={isSubmitting}>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
