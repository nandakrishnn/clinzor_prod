"use client";
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Card from '@mui/joy/Card';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PendingIcon from '@mui/icons-material/Pending';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/Receipt';

// Sample payment data
const initialPaymentData: {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  paymentMode: string;
  status: 'Completed' | 'Pending' | 'Failed';
  avatar: string;
  reference: string;
}[] = [
  {
    id: 'PMT-1001',
    patientName: 'Rahul Sharma',
    date: '2025-05-10',
    amount: 2000,
    paymentMode: 'Online',
    status: 'Completed',
    avatar: 'RS',
    reference: 'TXNID-87654321'
  },
  {
    id: 'PMT-1002',
    patientName: 'Priya Patel',
    date: '2025-05-09',
    amount: 1500,
    paymentMode: 'Cash',
    status: 'Completed',
    avatar: 'PP',
    reference: 'CASH-12345'
  },
  {
    id: 'PMT-1003',
    patientName: 'Amit Kumar',
    date: '2025-05-08',
    amount: 3000,
    paymentMode: 'Online',
    status: 'Pending',
    avatar: 'AK',
    reference: 'TXNID-76543210'
  },
  {
    id: 'PMT-1004',
    patientName: 'Sneha Gupta',
    date: '2025-05-07',
    amount: 1750,
    paymentMode: 'UPI',
    status: 'Completed',
    avatar: 'SG',
    reference: 'UPI-98765432'
  },
  {
    id: 'PMT-1005',
    patientName: 'Vikram Singh',
    date: '2025-05-06',
    amount: 2500,
    paymentMode: 'Online',
    status: 'Failed',
    avatar: 'VS',
    reference: 'TXNID-65432109'
  },
];

function descendingComparator(a: { [x: string]: number; }, b: { [x: string]: number; }, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function RowMenu({
  onDelete,
  onVerify,
  status,
}: {
  onDelete: () => void;
  onVerify: () => void;
  status: 'Pending' | 'Failed' | 'Completed';
}) {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        {status === 'Pending' && (
          <MenuItem onClick={onVerify}>Verify Payment</MenuItem>
        )}
        {status === 'Failed' && (
          <MenuItem onClick={onVerify}>Retry Payment</MenuItem>
        )}
        <MenuItem onClick={onDelete} color="danger">Delete Record</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function PaymentsTable() {
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [paymentModeFilter, setPaymentModeFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Add new payment modal
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openVerifyModal, setOpenVerifyModal] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<{
    id: string;
    patientName: string;
    date: string;
    amount: number;
    paymentMode: string;
    status: 'Completed' | 'Pending' | 'Failed';
    avatar: string;
    reference: string;
  } | null>(null);
  
  // Payment data state
  const [paymentData, setPaymentData] = React.useState(initialPaymentData);
  
  // New payment entry state
  const [newEntry, setNewEntry] = React.useState({
    patientName: '',
    date: '',
    amount: 0,
    paymentMode: 'Online',
    status: 'Pending',
    reference: ''
  });
  
  const handleRequestSort = (property: React.SetStateAction<string>) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleFormChange = (field: string, value: string | null) => {
    setNewEntry({ ...newEntry, [field]: value });
  };
  
  const handleAddEntry = () => {
    // Generate a new ID
    const newId = `PMT-${1006 + paymentData.length}`; // Simple ID generation for demo
    
    // Create avatar from initials
    const nameParts = newEntry.patientName.split(' ');
    const avatar = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : `${nameParts[0][0]}${nameParts[0][1] || ''}`;
    
    const newPayment = {
      ...newEntry,
      id: newId,
      avatar,
      status: newEntry.status as 'Completed' | 'Pending' | 'Failed',
    };
    
    setPaymentData([newPayment, ...paymentData]);
    
    // Reset form
    setNewEntry({
      patientName: '',
      date: '',
      amount: 0,
      paymentMode: 'Online',
      status: 'Pending',
      reference: ''
    });
    
    setOpenAddModal(false);
  };
  
  const handleVerifyPayment = () => {
    if (selectedPayment) {
      setPaymentData(
        paymentData.map((entry) =>
          entry.id === selectedPayment.id
            ? { ...entry, status: 'Completed' }
            : entry
        )
      );
      setOpenVerifyModal(false);
      setSelectedPayment(null);
    }
  };
  
  const handleDeleteEntry = (id: string) => {
    setPaymentData(paymentData.filter((entry) => entry.id !== id));
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckRoundedIcon />;
      case 'Pending':
        return <PendingIcon />;
      case 'Failed':
        return <CloseIcon />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'danger';
      default:
        return 'neutral';
    }
  };
  
  // Filter payments based on search and filters
  const filteredPayments = paymentData.filter((payment) => {
    const matchesSearch = payment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesPaymentMode = paymentModeFilter === 'all' || payment.paymentMode === paymentModeFilter;
    return matchesSearch && matchesStatus && matchesPaymentMode;
  });
  
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          value={statusFilter}
          onChange={(_, value) => setStatusFilter(value ?? 'all')}
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="all">All Statuses</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Failed">Failed</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Payment Mode</FormLabel>
        <Select
          size="sm"
          value={paymentModeFilter}
          onChange={(_, value) => setPaymentModeFilter(value ?? 'all')}
          placeholder="Filter by payment mode"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="all">All Modes</Option>
          <Option value="Online">Online</Option>
          <Option value="Cash">Cash</Option>
          <Option value="UPI">UPI</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  // Calculate total amounts
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const pendingAmount = filteredPayments
    .filter(payment => payment.status === 'Pending')
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  const completedAmount = filteredPayments
    .filter(payment => payment.status === 'Completed')
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography level="h3">Payments Management</Typography>
        <Button startDecorator={<AddIcon />} onClick={() => setOpenAddModal(true)}>
          Add Payment
        </Button>
      </Box>
      
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <Typography level="body-sm">Total Payments</Typography>
          <Typography level="h4">₹{totalAmount.toLocaleString()}</Typography>
          <Typography level="body-xs">{filteredPayments.length} transactions</Typography>
        </Card>
        <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <Typography level="body-sm">Completed Payments</Typography>
          <Typography level="h4" color="success">₹{completedAmount.toLocaleString()}</Typography>
          <Typography level="body-xs">
            {filteredPayments.filter(p => p.status === 'Completed').length} transactions
          </Typography>
        </Card>
        <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
          <Typography level="body-sm">Pending Payments</Typography>
          <Typography level="h4" color="warning">₹{pendingAmount.toLocaleString()}</Typography>
          <Typography level="body-xs">
            {filteredPayments.filter(p => p.status === 'Pending').length} transactions
          </Typography>
        </Card>
      </Box>
      
      {/* Mobile Search and Filters */}
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Search payments"
          startDecorator={<SearchIcon />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setFilterOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={filterOpen} onClose={() => setFilterOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setFilterOpen(false)}>
                Apply Filters
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>

      {/* Desktop Filters */}
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for payments</FormLabel>
          <Input 
            size="sm" 
            placeholder="Search by ID, patient name, or reference" 
            startDecorator={<SearchIcon />} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FormControl>
        {renderFilters()}
      </Box>

      {/* Payments Table */}
      <Sheet
        className="PaymentTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== filteredPayments.length
                  }
                  checked={selected.length === filteredPayments.length && filteredPayments.length > 0}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? filteredPayments.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === filteredPayments.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => handleRequestSort('id')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={[
                    {
                      fontWeight: 'lg',
                      '& svg': {
                        transition: '0.2s',
                        transform:
                          orderBy === 'id' && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                      },
                    },
                    orderBy === 'id' && order === 'desc'
                      ? { '& svg': { transform: 'rotate(0deg)' } }
                      : { '& svg': { transform: 'rotate(180deg)' } },
                  ]}
                >
                  Payment ID
                </Link>
              </th>
              <th style={{ width: 240, padding: '12px 6px' }}>Patient Name</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Date</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Amount</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Payment Mode</th>
              <th style={{ width: 200, padding: '12px 6px' }}>Reference</th>
              <th style={{ width: 100, padding: '12px 6px' }}>Status</th>
              <th style={{ width: 100, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              [...filteredPayments]
                .sort(getComparator(order, orderBy))
                .map((row) => (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', width: 48 }}>
                      <Checkbox
                        size="sm"
                        checked={selected.includes(row.id)}
                        color={selected.includes(row.id) ? 'primary' : undefined}
                        onChange={(event) => {
                          setSelected((ids) =>
                            event.target.checked
                              ? ids.concat(row.id)
                              : ids.filter((itemId) => itemId !== row.id),
                          );
                        }}
                        slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                        sx={{ verticalAlign: 'text-bottom' }}
                      />
                    </td>
                    <td>
                      <Typography level="body-xs">{row.id}</Typography>
                    </td>
                    <td>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar size="sm">{row.avatar}</Avatar>
                        <Typography level="body-sm" fontWeight="md">{row.patientName}</Typography>
                      </Box>
                    </td>
                    <td>
                      <Typography level="body-xs">{row.date}</Typography>
                    </td>
                    <td>
                      <Typography level="body-sm" fontWeight="md">₹{row.amount}</Typography>
                    </td>
                    <td>
                      <Chip
                        variant="soft"
                        size="sm"
                        color="neutral"
                      >
                        {row.paymentMode}
                      </Chip>
                    </td>
                    <td>
                      <Typography level="body-xs">{row.reference}</Typography>
                    </td>
                    <td>
                      <Chip
                        variant="soft"
                        size="sm"
                        startDecorator={getStatusIcon(row.status)}
                        color={getStatusColor(row.status)}
                      >
                        {row.status}
                      </Chip>
                    </td>
                    <td>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {row.status === 'Pending' && (
                          <IconButton
                            variant="plain"
                            color="success"
                            size="sm"
                            onClick={() => {
                              setSelectedPayment({
                                ...row,
                                status: row.status as 'Pending' | 'Failed' | 'Completed',
                              });
                              setOpenVerifyModal(true);
                            }}
                          >
                            <CheckRoundedIcon />
                          </IconButton>
                        )}
                        <IconButton
                          variant="plain"
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteEntry(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <RowMenu 
                          status={row.status} 
                          onVerify={() => {
                            setSelectedPayment(row);
                            setOpenVerifyModal(true);
                          }} 
                          onDelete={() => handleDeleteEntry(row.id)}
                        />
                      </Box>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '16px' }}>
                  <Typography level="body-sm">No payment entries found</Typography>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      {/* Mobile Payment List (shown on xs screens) */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 1 }}>
        {filteredPayments.length > 0 ? (
          filteredPayments.map((row) => (
            <Card key={row.id} sx={{ mb: 1, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar size="sm">{row.avatar}</Avatar>
                  <Typography level="title-md">{row.patientName}</Typography>
                </Box>
                <Chip
                  variant="soft"
                  size="sm"
                  startDecorator={getStatusIcon(row.status)}
                  color={getStatusColor(row.status)}
                >
                  {row.status}
                </Chip>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">ID:</Typography>
                <Typography level="body-xs">{row.id}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">Date:</Typography>
                <Typography level="body-xs">{row.date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">Amount:</Typography>
                <Typography level="body-sm" fontWeight="md">₹{row.amount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">Payment Mode:</Typography>
                <Typography level="body-xs">{row.paymentMode}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography level="body-xs">Reference:</Typography>
                <Typography level="body-xs">{row.reference}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                {row.status === 'Pending' && (
                  <Button
                    size="sm"
                    color="success"
                    variant="soft"
                    onClick={() => {
                      setSelectedPayment(row);
                      setOpenVerifyModal(true);
                    }}
                  >
                    Verify
                  </Button>
                )}
                <Button
                  size="sm"
                  color="danger"
                  variant="soft"
                  onClick={() => handleDeleteEntry(row.id)}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography level="body-sm">No payment entries found</Typography>
          </Card>
        )}
      </Box>

      {/* Bottom Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          bgcolor: 'background.level1',
          borderRadius: 'sm',
          mt: 1,
        }}
      >
        <Typography level="body-sm">
          {selected.length} of {filteredPayments.length} selected
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="soft"
            color="neutral"
            size="sm"
            onClick={() => setSelected([])}
          >
            Deselect All
          </Button>
          {selected.length > 0 && (
            <Button 
              variant="solid" 
              color="primary" 
              size="sm"
              startDecorator={<ReceiptIcon />}
              onClick={() => {
                // Mark all selected pending payments as completed
                setPaymentData(
                  paymentData.map((entry) =>
                    selected.includes(entry.id) && entry.status === 'Pending'
                      ? { ...entry, status: 'Completed' }
                      : entry
                  )
                );
                setSelected([]);
              }}
            >
              {selected.some(id => 
                paymentData.find(entry => entry.id === id)?.status === 'Pending'
              ) ? "Verify Selected" : "Process Selected"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Add Payment Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">Add New Payment</Typography>
          <Divider sx={{ my: 2 }} />
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Patient Name</FormLabel>
            <Input
              value={newEntry.patientName}
              onChange={(e) => handleFormChange('patientName', e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={newEntry.date}
              onChange={(e) => handleFormChange('date', e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Amount (₹)</FormLabel>
            <Input
              type="number"
              value={newEntry.amount}
              onChange={(e) => handleFormChange('amount', e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Payment Mode</FormLabel>
            <Select
              value={newEntry.paymentMode}
              onChange={(_, value) => handleFormChange('paymentMode', value)}
            >
              <Option value="Online">Online</Option>
              <Option value="Cash">Cash</Option>
              <Option value="UPI">UPI</Option>
            </Select>
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Reference Number</FormLabel>
            <Input
              value={newEntry.reference}
              onChange={(e) => handleFormChange('reference', e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Status</FormLabel>
            <Select
              value={newEntry.status}
              onChange={(_, value) => handleFormChange('status', value)}
            >
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="plain" color="neutral" onClick={() => setOpenAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>Add Payment</Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Verify Payment Modal */}

    </React.Fragment>
        );
}
