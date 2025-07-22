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
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';

// Icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

// Sample pending amounts data
const initialClinicData = [
  {
    id: 'CLN-1001',
    clinicName: 'Wellness Healthcare',
    contactPerson: 'Dr. Mehta',
    date: '2025-05-12',
    totalAmount: 5000,
    amountPaid: 2000,
    pendingAmount: 3000,
    status: 'Pending',
    avatar: 'WH',
    type: 'clinic'
  },
  {
    id: 'CLN-1002',
    clinicName: 'City Medical Center',
    contactPerson: 'Dr. Agarwal',
    date: '2025-05-11',
    totalAmount: 7500,
    amountPaid: 7500,
    pendingAmount: 0,
    status: 'Settled',
    avatar: 'CM',
    type: 'clinic'
  },
  {
    id: 'CLN-1003',
    clinicName: 'Sunshine Hospital',
    contactPerson: 'Dr. Khanna',
    date: '2025-05-10',
    totalAmount: 4500,
    amountPaid: 1500,
    pendingAmount: 3000,
    status: 'Pending',
    avatar: 'SH',
    type: 'clinic'
  },
  {
    id: 'CLN-1004',
    clinicName: 'LifeCare Clinic',
    contactPerson: 'Dr. Reddy',
    date: '2025-05-09',
    totalAmount: 3000,
    amountPaid: 1000,
    pendingAmount: 2000,
    status: 'Pending',
    avatar: 'LC',
    type: 'clinic'
  },
  {
    id: 'CLN-1005',
    clinicName: 'New Age Medicare',
    contactPerson: 'Dr. Joshi',
    date: '2025-05-08',
    totalAmount: 6000,
    amountPaid: 6000,
    pendingAmount: 0,
    status: 'Settled',
    avatar: 'NA',
    type: 'clinic'
  },
];

const initialUserData = [
  {
    id: 'USR-2001',
    userName: 'Ananya Shah',
    email: 'ananya.shah@email.com',
    date: '2025-05-12',
    totalAmount: 1200,
    amountPaid: 600,
    pendingAmount: 600,
    status: 'Pending',
    avatar: 'AS',
    type: 'user'
  },
  {
    id: 'USR-2002',
    userName: 'Raj Kumar',
    email: 'rajkumar@email.com',
    date: '2025-05-11',
    totalAmount: 1500,
    amountPaid: 1500,
    pendingAmount: 0,
    status: 'Settled',
    avatar: 'RK',
    type: 'user'
  },
  {
    id: 'USR-2003',
    userName: 'Meera Patel',
    email: 'meera.p@email.com',
    date: '2025-05-10',
    totalAmount: 900,
    amountPaid: 400,
    pendingAmount: 500,
    status: 'Pending',
    avatar: 'MP',
    type: 'user'
  },
  {
    id: 'USR-2004',
    userName: 'Vikram Desai',
    email: 'vikram.d@email.com',
    date: '2025-05-09',
    totalAmount: 2000,
    amountPaid: 1000,
    pendingAmount: 1000,
    status: 'Pending',
    avatar: 'VD',
    type: 'user'
  },
  {
    id: 'USR-2005',
    userName: 'Priya Singh',
    email: 'priya.s@email.com',
    date: '2025-05-08',
    totalAmount: 1800,
    amountPaid: 1800,
    pendingAmount: 0,
    status: 'Settled',
    avatar: 'PS',
    type: 'user'
  },
];

// Helper functions for sorting
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

// Row menu component for actions
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

export default function PendingAmountsTable() {
  // State variables
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState(0); // 0 for clinics, 1 for users
  
  // Modal states
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openSettleModal, setOpenSettleModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  
  // Data states
  const [clinicData, setClinicData] = React.useState(initialClinicData);
  const [userData, setUserData] = React.useState(initialUserData);
  
  // New entry state
  const [newEntry, setNewEntry] = React.useState({
    name: '',
    contactInfo: '',
    date: '',
    totalAmount: 0,
    amountPaid: 0,
  });
  
  // Combined data based on active tab
  const currentData = activeTab === 0 ? clinicData : userData;
  
  // Handle sorting
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Calculate pending amount for new entry
  const calculatePendingAmount = () => {
    const { totalAmount, amountPaid } = newEntry;
    return Math.max(0, Number(totalAmount) - Number(amountPaid));
  };
  
  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    setNewEntry({ ...newEntry, [field]: value });
  };
  
  // Add new clinic or user entry
  const handleAddEntry = () => {
    const pendingAmount = calculatePendingAmount();
    const status = pendingAmount <= 0 ? 'Settled' : 'Pending';
    
    // Generate new ID based on type
    const prefix = activeTab === 0 ? 'CLN-' : 'USR-';
    const baseNumber = activeTab === 0 ? 1006 : 2006;
    const type = activeTab === 0 ? 'clinic' : 'user';
    
    // Create avatar from name
    const nameParts = newEntry.name.split(' ');
    const avatar = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : `${nameParts[0][0]}${nameParts[0][1] || ''}`;
    
    if (activeTab === 0) {
      // Add clinic
      const newClinic = {
        id: `${prefix}${baseNumber - clinicData.length}`,
        clinicName: newEntry.name,
        contactPerson: newEntry.contactInfo,
        date: newEntry.date,
        totalAmount: Number(newEntry.totalAmount),
        amountPaid: Number(newEntry.amountPaid),
        pendingAmount,
        status,
        avatar,
        type
      };
      
      setClinicData([newClinic, ...clinicData]);
    } else {
      // Add user
      const newUser = {
        id: `${prefix}${baseNumber - userData.length}`,
        userName: newEntry.name,
        email: newEntry.contactInfo,
        date: newEntry.date,
        totalAmount: Number(newEntry.totalAmount),
        amountPaid: Number(newEntry.amountPaid),
        pendingAmount,
        status,
        avatar,
        type
      };
      
      setUserData([newUser, ...userData]);
    }
    
    // Reset form
    setNewEntry({
      name: '',
      contactInfo: '',
      date: '',
      totalAmount: 0,
      amountPaid: 0,
    });
    
    setOpenAddModal(false);
  };
  
  // Handle settling an entry
  const handleSettleEntry = () => {
    if (selectedItem) {
      if (selectedItem.type === 'clinic') {
        setClinicData(
          clinicData.map((item) =>
            item.id === selectedItem.id
              ? { ...item, status: 'Settled', pendingAmount: 0, amountPaid: item.totalAmount }
              : item
          )
        );
      } else {
        setUserData(
          userData.map((item) =>
            item.id === selectedItem.id
              ? { ...item, status: 'Settled', pendingAmount: 0, amountPaid: item.totalAmount }
              : item
          )
        );
      }
      setOpenSettleModal(false);
      setSelectedItem(null);
    }
  };
  
  // Handle deleting an entry
  const handleDeleteEntry = (id: string, type: string) => {
    if (type === 'clinic') {
      setClinicData(clinicData.filter((item) => item.id !== id));
    } else {
      setUserData(userData.filter((item) => item.id !== id));
    }
  };
  
  // Get icon for status
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
  
  // Get color for status
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
  
  // Filter data based on search and status
  const filteredData = currentData.filter((item) => {
    const nameField = activeTab === 0 ? 'clinicName' : 'userName';
    const matchesSearch = 
      (item[nameField as keyof typeof item]?.toString().toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Render filters component
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
  
  // Calculate total pending amount
  const totalPendingAmount = React.useMemo(() => {
    return currentData.reduce((sum, item) => sum + item.pendingAmount, 0);
  }, [currentData]);

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography level="h3">Pending Amounts</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end',
            pr: 2,
            borderRight: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography level="body-xs">Total Pending</Typography>
            <Typography level="title-lg" startDecorator={<CurrencyRupeeIcon fontSize="small" />}>
              {totalPendingAmount.toLocaleString()}
            </Typography>
          </Box>
          <Button startDecorator={<AddIcon />} onClick={() => setOpenAddModal(true)}>
            Add New
          </Button>
        </Box>
      </Box>
      
      {/* Tab switcher */}
      <Tabs value={activeTab} onChange={(_, value) => {
        setActiveTab(value as number);
        setSelected([]);
      }} sx={{ mb: 2 }}>
<Tabs>
  <TabList>
    <Tab>
      <BusinessIcon sx={{ mr: 1 }} />
      Clinics
    </Tab>
    <Tab>
      <PersonIcon sx={{ mr: 1 }} />
      Users
    </Tab>
  </TabList>

  <TabPanel value={0}>Clinics content here</TabPanel>
  <TabPanel value={1}>Users content here</TabPanel>
</Tabs>
      </Tabs>
      
      {/* Mobile Search and Filters */}
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder={`Search ${activeTab === 0 ? 'clinics' : 'users'}`}
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
          <FormLabel>Search</FormLabel>
          <Input 
            size="sm" 
            placeholder={`Search by ID or ${activeTab === 0 ? 'clinic name' : 'user name'}`}
            startDecorator={<SearchIcon />} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FormControl>
        {renderFilters()}
      </Box>

      {/* Table Display for Tablets and up */}
      <Sheet
        className="TableContainer"
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
                    selected.length > 0 && selected.length !== filteredData.length
                  }
                  checked={selected.length === filteredData.length && filteredData.length > 0}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? filteredData.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === filteredData.length
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
                    }
                  ]}
                >
                  ID
                </Link>
              </th>
              <th style={{ width: 240, padding: '12px 6px' }}>
                {activeTab === 0 ? 'Clinic Name' : 'User Name'}
              </th>
              <th style={{ width: 240, padding: '12px 6px' }}>
                {activeTab === 0 ? 'Contact Person' : 'Email'}
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>Date</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Total Amount</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Amount Paid</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Pending Amount</th>
              <th style={{ width: 100, padding: '12px 6px' }}>Status</th>
              <th style={{ width: 100, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              [...filteredData]
                .sort(getComparator(order, orderBy as keyof typeof filteredData[0]))
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
                        <Typography level="body-sm" fontWeight="md">
                          {activeTab === 0 ? (row as typeof initialClinicData[0]).clinicName : (row as typeof initialUserData[0]).userName}
                        </Typography>
                      </Box>
                    </td>
                    <td>
                      <Typography level="body-xs">
                        {activeTab === 0 ? (row as typeof initialClinicData[0]).contactPerson : (row as typeof initialUserData[0]).email}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">{row.date}</Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">₹{row.totalAmount}</Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">₹{row.amountPaid}</Typography>
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
                              setSelectedItem(row);
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
                          onClick={() => handleDeleteEntry(row.id, row.type)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <RowMenu 
                          status={row.status} 
                          onSettle={() => {
                            setSelectedItem(row);
                            setOpenSettleModal(true);
                          }} 
                          onDelete={() => handleDeleteEntry(row.id, row.type)}
                        />
                      </Box>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '16px' }}>
                  <Typography level="body-sm">
                    No pending amounts found for {activeTab === 0 ? 'clinics' : 'users'}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 1 }}>
        {filteredData.length > 0 ? (
          filteredData.map((row) => (
            <Card key={row.id} sx={{ mb: 1, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar size="sm">{row.avatar}</Avatar>
                  <Typography level="title-md">
                    {'clinicName' in row ? row.clinicName : row.userName}
                  </Typography>
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
                <Typography level="body-xs">
                  {activeTab === 0 ? 'Contact:' : 'Email:'}
                </Typography>
                <Typography level="body-xs">
                  {row.type === 'clinic' ? (row as typeof initialClinicData[0]).contactPerson : (row as typeof initialUserData[0]).email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">Date:</Typography>
                <Typography level="body-xs">{row.date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">Total Amount:</Typography>
                <Typography level="body-xs">₹{row.totalAmount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography level="body-xs">Amount Paid:</Typography>
                <Typography level="body-xs">₹{row.amountPaid}</Typography>
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
                      setSelectedItem(row);
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
                  onClick={() => handleDeleteEntry(row.id, row.type)}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Card sx={{ p: 2, textAlign: 'center' }}> 
            <Typography level="body-sm">
              No pending amounts found for {activeTab === 0 ? 'clinics' : 'users'}
            </Typography>
            </Card>
        )}      
        </Box>                                  

              {/* Add New Entry Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" component="h2">Add New {activeTab === 0 ? 'Clinic' : 'User'}</Typography>
          <Divider sx={{ my: 1 }} />
          <FormControl>
            <FormLabel>{activeTab === 0 ? 'Clinic Name' : 'User Name'}</FormLabel>
            <Input
              value={newEntry.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              placeholder={`Enter ${activeTab === 0 ? 'clinic' : 'user'} name`}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{activeTab === 0 ? 'Contact Person' : 'Email'}</FormLabel>
            <Input
              value={newEntry.contactInfo}
              onChange={(e) => handleFormChange('contactInfo', e.target.value)}
              placeholder={`Enter ${activeTab === 0 ? 'contact person' : 'email'}`}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={newEntry.date}
              onChange={(e) => handleFormChange('date', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Total Amount</FormLabel>
            <Input
              type="number"
              value={newEntry.totalAmount}
              onChange={(e) => handleFormChange('totalAmount', e.target.value)}
              placeholder="Enter total amount"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Amount Paid</FormLabel>
            <Input
              type="number"
              value={newEntry.amountPaid}
              onChange={(e) => handleFormChange('amountPaid', e.target.value)}
              placeholder="Enter amount paid"
            />
          </FormControl>
          <Button onClick={handleAddEntry} fullWidth color="primary" sx={{ mt: 2 }}>
            Save Entry
          </Button>
        </ModalDialog>
      </Modal>

      {/* Settle Confirmation Modal */}
      <Modal open={openSettleModal} onClose={() => setOpenSettleModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" component="h2">Confirm Settlement</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>
            Are you sure you want to mark this entry as <strong>Settled</strong>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={() => setOpenSettleModal(false)}>
              Cancel
            </Button>
            <Button color="success" onClick={handleSettleEntry}>
              Confirm
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

