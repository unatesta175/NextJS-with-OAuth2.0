'use client'

import React, { useState } from 'react'
// DashboardLayout is now handled by layout.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Badge } from '@components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { Label } from '@components/ui/label'
import { Textarea } from '@components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { MoreHorizontal, Search, Download, Star, MessageSquare, ThumbsUp, ThumbsDown, Eye, Reply } from 'lucide-react'

interface Review {
  id: string
  customer: {
    name: string
    avatar?: string
    email: string
  }
  staff: {
    name: string
    avatar?: string
  }
  service: string
  branch: string
  rating: number
  comment: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  response?: {
    message: string
    respondedBy: string
    respondedAt: string
  }
  helpful: number
  notHelpful: number
}

const reviewsData: Review[] = [
  {
    id: 'R001',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah@email.com'
    },
    staff: {
      name: 'Maya Chen'
    },
    service: 'Deep Cleansing Facial',
    branch: 'Main Branch',
    rating: 5,
    comment: 'Absolutely amazing service! Maya was so professional and my skin feels incredible. The facial was relaxing and the results are visible immediately. Will definitely book again!',
    date: '2024-01-20',
    status: 'approved',
    response: {
      message: 'Thank you so much for your wonderful review, Sarah! We\'re thrilled that you loved your facial experience with Maya. We look forward to seeing you again soon!',
      respondedBy: 'Kapas Beauty Team',
      respondedAt: '2024-01-20'
    },
    helpful: 8,
    notHelpful: 0
  },
  {
    id: 'R002',
    customer: {
      name: 'Maria Lim',
      email: 'maria@email.com'
    },
    staff: {
      name: 'Lisa Wong'
    },
    service: 'Body Massage',
    branch: 'Petaling Jaya',
    rating: 4,
    comment: 'Great massage session! Lisa has magic hands. The only downside was the room was a bit cold, but overall a good experience.',
    date: '2024-01-19',
    status: 'approved',
    helpful: 5,
    notHelpful: 1
  },
  {
    id: 'R003',
    customer: {
      name: 'John Doe',
      email: 'john@email.com'
    },
    staff: {
      name: 'Amy Tan'
    },
    service: 'Hair Treatment',
    branch: 'Main Branch',
    rating: 3,
    comment: 'Service was okay but I expected more for the price. The hair treatment didn\'t show much difference.',
    date: '2024-01-18',
    status: 'pending',
    helpful: 2,
    notHelpful: 3
  },
  {
    id: 'R004',
    customer: {
      name: 'Lisa Chen',
      email: 'lisa@email.com'
    },
    staff: {
      name: 'Sarah Lee'
    },
    service: 'Nail Care',
    branch: 'Shah Alam',
    rating: 5,
    comment: 'Perfect manicure! Sarah is very skilled and attentive to detail. The nail art was exactly what I wanted.',
    date: '2024-01-17',
    status: 'approved',
    helpful: 6,
    notHelpful: 0
  },
  {
    id: 'R005',
    customer: {
      name: 'David Wong',
      email: 'david@email.com'
    },
    staff: {
      name: 'Maya Chen'
    },
    service: 'Eye Treatment',
    branch: 'Main Branch',
    rating: 2,
    comment: 'Not satisfied with the service. The treatment was rushed and didn\'t feel relaxing at all.',
    date: '2024-01-16',
    status: 'rejected',
    helpful: 1,
    notHelpful: 4
  }
]

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' }
}

const ratingColors = {
  5: 'text-green-500',
  4: 'text-green-400',
  3: 'text-yellow-500',
  2: 'text-orange-500',
  1: 'text-red-500'
}

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [branchFilter, setBranchFilter] = useState<string>('all')
  const [currentPage] = useState(1) // setCurrentPage removed as unused
  const [pageSize, setPageSize] = useState(10)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isResponseOpen, setIsResponseOpen] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)


  const filteredReviews = reviewsData.filter(review => {
    const matchesSearch = review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
    const matchesBranch = branchFilter === 'all' || review.branch === branchFilter
    
    return matchesSearch && matchesStatus && matchesRating && matchesBranch
  })

  const paginatedReviews = filteredReviews.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil(filteredReviews.length / pageSize)

  const averageRating = reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length
  const totalReviews = reviewsData.length
  const approvedReviews = reviewsData.filter(r => r.status === 'approved').length
  const pendingReviews = reviewsData.filter(r => r.status === 'pending').length

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviewsData.filter(r => r.rating === rating).length,
    percentage: (reviewsData.filter(r => r.rating === rating).length / totalReviews) * 100
  }))

  const handleViewReview = (review: Review) => {
    setSelectedReview(review)
    setIsDetailsOpen(true)
  }

  const handleRespondToReview = (review: Review) => {
    setSelectedReview(review)
    setResponseText('')
    setIsResponseOpen(true)
  }

  const handleApproveReview = (review: Review) => {
    console.log('Approve review:', review.id)
  }

  const handleRejectReview = (review: Review) => {
    console.log('Reject review:', review.id)
  }

  const handleSubmitResponse = async () => {
    setIsSubmittingResponse(true)
    try {
      // TODO: Implement submit response logic
      console.log('Submit response:', responseText)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsResponseOpen(false)
      setResponseText('')
    } catch (error) {
      console.error('Failed to submit response:', error)
    } finally {
      setIsSubmittingResponse(false)
    }
  }

  const renderStars = (rating: number, className: string = '') => {
    return (
      <div className={`flex items-center ${className}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-current' : ''} ${ratingColors[rating as keyof typeof ratingColors]}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}</span>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
            <p className="text-gray-600 mt-1">Manage customer reviews and feedback</p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                {renderStars(Math.round(averageRating))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{totalReviews}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-green-600">{approvedReviews}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-yellow-600">{pendingReviews}</span>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-16">{count} ({percentage.toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Reviews Table */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="Main Branch">Main Branch</SelectItem>
                  <SelectItem value="Petaling Jaya">Petaling Jaya</SelectItem>
                  <SelectItem value="Shah Alam">Shah Alam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service & Staff</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.customer.avatar} />
                          <AvatarFallback>
                            {review.customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{review.customer.name}</div>
                          <div className="text-xs text-gray-500">{review.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{review.service}</div>
                        <div className="text-xs text-gray-500">with {review.staff.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderStars(review.rating)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{review.comment}</p>
                        {review.helpful > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{review.helpful}</span>
                            </div>
                            {review.notHelpful > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <ThumbsDown className="h-3 w-3" />
                                <span>{review.notHelpful}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{review.branch}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(review.date)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[review.status].color}>
                        {statusConfig[review.status].label}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleViewReview(review)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRespondToReview(review)}>
                            <Reply className="h-4 w-4 mr-2" />
                            Respond
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {review.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleApproveReview(review)} className="text-green-600">
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRejectReview(review)} className="text-red-600">
                                <ThumbsDown className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
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
              <span className="text-sm text-gray-500">of {filteredReviews.length} results</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1}>Previous</Button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages}>Next</Button>
            </div>
          </div>
        </div>

        {/* Review Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedReview && (
              <>
                <DialogHeader>
                  <DialogTitle>Review Details</DialogTitle>
                  <DialogDescription>Review ID: {selectedReview.id}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedReview.customer.avatar} />
                      <AvatarFallback>
                        {selectedReview.customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedReview.customer.name}</div>
                      <div className="text-sm text-gray-500">{selectedReview.customer.email}</div>
                      <div className="text-sm text-gray-500">{formatDate(selectedReview.date)}</div>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-gray-200 pl-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {renderStars(selectedReview.rating)}
                        <Badge className={statusConfig[selectedReview.status].color}>
                          {statusConfig[selectedReview.status].label}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Service:</strong> {selectedReview.service} with {selectedReview.staff.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Branch:</strong> {selectedReview.branch}
                      </div>
                      <p className="mt-3">{selectedReview.comment}</p>
                      
                      {selectedReview.helpful > 0 && (
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{selectedReview.helpful} found this helpful</span>
                          </div>
                          {selectedReview.notHelpful > 0 && (
                            <div className="flex items-center gap-1">
                              <ThumbsDown className="h-4 w-4" />
                              <span>{selectedReview.notHelpful} found this not helpful</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedReview.response && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-[#ff0a85]" />
                        <span className="font-medium text-sm">Response from {selectedReview.response.respondedBy}</span>
                        <span className="text-xs text-gray-500">{formatDate(selectedReview.response.respondedAt)}</span>
                      </div>
                      <p className="text-sm">{selectedReview.response.message}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Response Dialog */}
        <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Respond to Review</DialogTitle>
              <DialogDescription>Write a professional response to this customer review.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Your Response</Label>
                <Textarea
                  placeholder="Thank you for your feedback..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSubmitResponse}
                disabled={isSubmittingResponse}
              >
                {isSubmittingResponse ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div>
                ) : (
                  'Submit Response'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
