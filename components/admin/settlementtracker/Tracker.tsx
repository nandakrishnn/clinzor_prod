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
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
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
import BlockIcon from '@mui/icons-material/Block';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Sample settlement data
const initialSettlementData = [
  {
    id: 'SET-1234',
    patientName: 'Rahul Sharma',
    date: '2025-05-10',
    consultationFee: 200,
    sessionFee: 800,
    amountBooked: 200,
    pendingAmount: 800,
    status: 'Pending',
    avatar: 'RS'
  },
  {
    id: 'SET-1233',
    patientName: 'Priya Patel',
    date: '2025-05-09',
    consultationFee: 250,
    sessionFee: 750,
    amountBooked: 250,
    pendingAmount: 750,
    status: 'Pending',
    avatar: 'PP'
  },
  {
    id: 'SET-1232',
    patientName: 'Amit Kumar',
    date: '2025-05-08',
    consultationFee: 300,
    sessionFee: 900,
    amountBooked: 1200,
    pendingAmount: 0,
    status: 'Settled',
    avatar: 'AK'
  },
  {
    id: 'SET-1231',
    patientName: 'Sneha Gupta',
    date: '2025-05-07',
    consultationFee: 150,
    sessionFee: 600,
    amountBooked: 750,
    pendingAmount: 0,
    status: 'Settled',
    avatar: 'SG'
  },
  {
    id: 'SET-1230',
    patientName: 'Vikram Singh',
    date: '2025-05-06',
    consultationFee: 200,
    sessionFee: 600,
    amountBooked: 400,
    pendingAmount: 400,
    status: 'Pending',
    avatar: 'VS'
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function RowMenu({ onSettle, onDelete, status }: { onSettle: () => void, onDelete: () => void, status: string }) {
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
          <MenuItem onClick={onSettle}>Mark as Settled</MenuItem>
        )}
        <MenuItem onClick={onDelete} color="danger">Delete Entry</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function SettlementTracker() {
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Add new settlement modal
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openSettleModal, setOpenSettleModal] = React.useState(false);
  const [selectedSettlement, setSelectedSettlement] = React.useState<any>(null);
  
  // Settlement data state
  const [settlementData, setSettlementData] = React.useState(initialSettlementData);
  
  // New settlement entry state
  const [newEntry, setNewEntry] = React.useState({
    patientName: '',
    date: '',
    consultationFee: 0,
    sessionFee: 0,
    amountBooked: 0,
  });
  
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const calculatePendingAmount = () => {
    const { consultationFee, sessionFee, amountBooked } = newEntry;
    return (Number(consultationFee) + Number(sessionFee)) - Number(amountBooked);
  };
  
  const handleFormChange = (field: string, value: any) => {
    setNewEntry({ ...newEntry, [field]: value });
  };
  
  const handleAddEntry = () => {
    const pendingAmount = calculatePendingAmount();
    const status = pendingAmount <= 0 ? 'Settled' : 'Pending';
    
    // Generate a new ID
    const newId = `SET-${1229 - settlementData.length}`; // Simple ID generation for demo
    
    // Create avatar from initials
    const nameParts = newEntry.patientName.split(' ');
    const avatar = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : `${nameParts[0][0]}${nameParts[0][1] || ''}`;
    
    const newSettlement = {
      ...newEntry,
      id: newId,
      pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
      status,
      avatar,
    };
    
    setSettlementData([newSettlement, ...settlementData]);
    
    // Reset form
    setNewEntry({
      patientName: '',
      date: '',
      consultationFee: 0,
      sessionFee: 0,
      amountBooked: 0,
    });
    
    setOpenAddModal(false);
  };
  
  const handleSettleEntry = () => {
    if (selectedSettlement) {
      setSettlementData(
        settlementData.map((entry) =>
          entry.id === selectedSettlement.id
            ? { ...entry, status: 'Settled', pendingAmount: 0 }
            : entry
        )
      );
      setOpenSettleModal(false);
      setSelectedSettlement(null);
    }
  };
  
  const handleDeleteEntry = (id: string) => {
    setSettlementData(settlementData.filter((entry) => entry.id !== id));
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Settled':
        return <CheckRoundedIcon />;
      case 'Pending':
        return <HourglassEmptyIcon />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string): ColorPaletteProp => {
    switch (status) {
      case 'Settled':
        return 'success';
      case 'Pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };
  
  // Filter settlements based on search and status filter
  const filteredSettlements = settlementData.filter((settlement) => {
    const matchesSearch = settlement.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          settlement.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || settlement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          value={statusFilter}
          onChange={(_, value) => setStatusFilter(value as string)}
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="all">All Statuses</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Settled">Settled</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography level="h3">Settlement Tracker</Typography>
        <Button startDecorator={<AddIcon />} onClick={() => setOpenAddModal(true)}>
          Add Settlement
        </Button>
      </Box>
      
      {/* Mobile Search and Filters */}
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Search settlements"
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
          <FormLabel>Search for settlements</FormLabel>
          <Input 
            size="sm" 
            placeholder="Search by ID or patient name" 
            startDecorator={<SearchIcon />} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FormControl>
        {renderFilters()}
      </Box>

      {/* Settlement Table */}
      <Sheet
        className="SettlementTableContainer"
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
                    selected.length > 0 && selected.length !== filteredSettlements.length
                  }
                  checked={selected.length === filteredSettlements.length && filteredSettlements.length > 0}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? filteredSettlements.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === filteredSettlements.length
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
                  Settlement ID
                </Link>
              </th>
              <th style={{ width: 240, padding: '12px 6px' }}>Patient Name</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Date</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Consultation Fee</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Session Fee</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Amount Booked</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Pending Amount</th>
              <th style={{ width: 100, padding: '12px 6px' }}>Status</th>
              <th style={{ width: 100, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {filteredSettlements.length > 0 ? (
              [...filteredSettlements]
                .sort(getComparator(order, orderBy as keyof typeof filteredSettlements[0]))
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
                      <Typography level="body-xs">₹{row.consultationFee}</Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">₹{row.sessionFee}</Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">₹{row.amountBooked}</Typography>
                    </td>
                    <td>
                      <Typography level="body-xs" fontWeight="lg">
                        ₹{row.pendingAmount}
                      </Typography>
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
                              setSelectedSettlement(row);
                              setOpenSettleModal(true);
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
                          onSettle={() => {
                            setSelectedSettlement(row);
                            setOpenSettleModal(true);
                          }} 
                          onDelete={() => handleDeleteEntry(row.id)}
                        />
                      </Box>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '16px' }}>
                  <Typography level="body-sm">No settlement entries found</Typography>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      {/* Mobile Settlement List (shown on xs screens) */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 1 }}>
        {filteredSettlements.length > 0 ? (
          filteredSettlements.map((row) => (
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
                <Typography level="body-xs">Consultation Fee:</Typography>
                <Typography level="body-xs">₹{row.consultationFee}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">Session Fee:</Typography>
                <Typography level="body-xs">₹{row.sessionFee}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">Amount Booked:</Typography>
                <Typography level="body-xs">₹{row.amountBooked}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography level="body-sm" fontWeight="lg">Pending Amount:</Typography>
                <Typography level="body-sm" fontWeight="lg">₹{row.pendingAmount}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                {row.status === 'Pending' && (
                  <Button
                    size="sm"
                    color="success"
                    variant="soft"
                    onClick={() => {
                      setSelectedSettlement(row);
                      setOpenSettleModal(true);
                    }}
                  >
                    Settle
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
            <Typography level="body-sm">No settlement entries found</Typography>
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
          {selected.length} of {filteredSettlements.length} selected
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
              onClick={() => {
                // Mark all selected items as settled
                setSettlementData(
                  settlementData.map((entry) =>
                    selected.includes(entry.id)
                      ? { ...entry, status: 'Settled', pendingAmount: 0 }
                      : entry
                  )
                );
                setSelected([]);
              }}
            >
              {selected.some(id => 
                settlementData.find(entry => entry.id === id)?.status === 'Pending'
              ) ? "Settle Selected" : "Process Selected"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Add Settlement Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">Add New Settlement</Typography>
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
            <FormLabel>Consultation Fee (₹)</FormLabel>
            <Input
              type="number"
              value={newEntry.consultationFee}
              onChange={(e) => handleFormChange('consultationFee', e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Session Fee (₹)</FormLabel>
            <Input
              type="number"
              value={newEntry.sessionFee}
              onChange={(e) => handleFormChange('sessionFee', e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Amount Booked (₹)</FormLabel>
            <Input
              type="number"
              value={newEntry.amountBooked}
              onChange={(e) => handleFormChange('amountBooked', e.target.value)}
            />
          </FormControl>

          <Box sx={{ bgcolor: 'background.level1', p: 2, borderRadius: 'sm', mb: 2 }}>
            <Typography level="body-sm">Pending Amount: ₹{calculatePendingAmount()}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="plain" color="neutral" onClick={() => setOpenAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>Add Settlement</Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Settle Modal */}
      <Modal open={openSettleModal} onClose={() => setOpenSettleModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">Settle Payment</Typography>
          <Divider sx={{ my: 2 }} />
          {selectedSettlement && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography level="body-sm">Patient Name:</Typography>
                <Typography level="body-md" fontWeight="bold">
                  {selectedSettlement.patientName}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography level="body-sm">Pending Amount:</Typography>
                <Typography level="h4" color="primary">
                  ₹{selectedSettlement.pendingAmount}
                </Typography>
              </Box>
              <Typography level="body-sm" sx={{ mb: 2 }}>
                Are you sure you want to mark this settlement as complete?
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="plain" color="neutral" onClick={() => setOpenSettleModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSettleEntry} color="success">
                  Confirm Settlement
                </Button>
              </Box>
            </>
          )}
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}