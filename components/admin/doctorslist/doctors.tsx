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
import Textarea from '@mui/joy/Textarea';

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

const doctorsData = [
  {
    id: 'DOC-1234',
    name: 'Dr. John Smith',
    specialty: 'Family Medicine',
    status: 'Active',
    clinic: 'Sunshine Medical Center',
    location: 'Los Angeles, CA',
    patients: 124,
    email: 'john.smith@sunshineclinic.com',
    phone: '(213) 555-6789',
    joinDate: 'Feb 3, 2023',
    avatar: 'JS'
  },
  {
    id: 'DOC-1233',
    name: 'Dr. Maria Rodriguez',
    specialty: 'Cardiology',
    status: 'On Leave',
    clinic: 'Urban Healthcare Clinic',
    location: 'New York, NY',
    patients: 87,
    email: 'maria.rodriguez@urbanclinic.com',
    phone: '(646) 555-1234',
    joinDate: 'Jan 15, 2023',
    avatar: 'MR'
  },
  {
    id: 'DOC-1232',
    name: 'Dr. Alex Johnson',
    specialty: 'Family Medicine',
    status: 'Inactive',
    clinic: 'Riverside Family Practice',
    location: 'Chicago, IL',
    patients: 0,
    email: 'alex.johnson@riversideclinic.com',
    phone: '(312) 555-9876',
    joinDate: 'Dec 22, 2022',
    avatar: 'AJ'
  },
  {
    id: 'DOC-1231',
    name: 'Dr. Emily Chang',
    specialty: 'Oncology',
    status: 'Active',
    clinic: 'Green Valley Medical Center',
    location: 'Seattle, WA',
    patients: 156,
    email: 'emily.chang@greenvalley.com',
    phone: '(206) 555-3456',
    joinDate: 'Nov 10, 2022',
    avatar: 'EC'
  },
  {
    id: 'DOC-1230',
    name: 'Dr. Roberto Martinez',
    specialty: 'Sports Medicine',
    status: 'Pending',
    clinic: 'Coastal Wellness Clinic',
    location: 'Miami, FL',
    patients: 42,
    email: 'roberto.martinez@coastalwellness.com',
    phone: '(305) 555-7890',
    joinDate: 'Oct 5, 2022',
    avatar: 'RM'
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

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>View Full Profile</MenuItem>
        <MenuItem>Edit Doctor</MenuItem>
        <MenuItem>View Schedule</MenuItem>
        <Divider />
        <MenuItem color="danger">Deactivate Doctor</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function AllDoctorsTable() {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [selectedDoctor, setSelectedDoctor] = React.useState<any>(null);

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="active">Active</Option>
          <Option value="onLeave">On Leave</Option>
          <Option value="inactive">Inactive</Option>
          <Option value="pending">Pending</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Specialty</FormLabel>
        <Select size="sm" placeholder="All Specialties">
          <Option value="all">All</Option>
          <Option value="familyMedicine">Family Medicine</Option>
          <Option value="cardiology">Cardiology</Option>
          <Option value="oncology">Oncology</Option>
          <Option value="sportsMedicine">Sports Medicine</Option>
          <Option value="pediatrics">Pediatrics</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Clinic</FormLabel>
        <Select size="sm" placeholder="All Clinics">
          <Option value="all">All</Option>
          <Option value="sunshine">Sunshine Medical Center</Option>
          <Option value="urban">Urban Healthcare Clinic</Option>
          <Option value="riverside">Riverside Family Practice</Option>
          <Option value="greenValley">Green Valley Medical Center</Option>
          <Option value="coastal">Coastal Wellness Clinic</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  const handleViewDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setOpenViewModal(true);
  };

  const handleEditDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setOpenEditModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckRoundedIcon />;
      case 'On Leave':
        return <HourglassEmptyIcon />;
      case 'Inactive':
        return <BlockIcon />;
      case 'Pending':
        return <BlockIcon />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string): ColorPaletteProp => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'On Leave':
        return 'warning';
      case 'Inactive':
        return 'danger';
      case 'Pending':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <React.Fragment>
      {/* Mobile Search and Filters */}
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Search doctors"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
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
          <FormLabel>Search for doctors</FormLabel>
          <Input size="sm" placeholder="Search" startDecorator={<SearchIcon />} />
        </FormControl>
        {renderFilters()}
      </Box>

      {/* Doctors Table */}
      <Sheet
        className="DoctorsTableContainer"
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
                    selected.length > 0 && selected.length !== doctorsData.length
                  }
                  checked={selected.length === doctorsData.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? doctorsData.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === doctorsData.length
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
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={[
                    {
                      fontWeight: 'lg',
                      '& svg': {
                        transition: '0.2s',
                        transform:
                          order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                      },
                    },
                    order === 'desc'
                      ? { '& svg': { transform: 'rotate(0deg)' } }
                      : { '& svg': { transform: 'rotate(180deg)' } },
                  ]}
                >
                  Doctor ID
                </Link>
              </th>
              <th style={{ width: 240, padding: '12px 6px' }}>Doctor Name</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Specialty</th>
              <th style={{ width: 110, padding: '12px 6px' }}>Status</th>
              <th style={{ width: 150, padding: '12px 6px' }}>Clinic</th>
              <th style={{ width: 100, padding: '12px 6px' }}>Patients</th>
              <th style={{ width: 140, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {[...doctorsData].sort(getComparator(order, 'id')).map((row) => (
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
                    <div>
                      <Typography level="body-xs" fontWeight="lg">
                        {row.name}
                      </Typography>
                      <Typography level="body-xs">
                        {row.email}
                      </Typography>
                    </div>
                  </Box>
                </td>
                <td>
                  <Typography level="body-xs">{row.specialty}</Typography>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={getStatusIcon(row.status)}
                    color={getStatusColor(row.status)}
                    sx={{ textTransform: 'capitalize' }}    
                  >                       
                    {row.status}
                  </Chip>     
                </td>   
                <td>
                  <Typography level="body-xs">{row.clinic}</Typography>
                </td>
                <td>
                  <Typography level="body-xs" fontWeight="lg">
                    {row.patients}
                  </Typography>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      variant="plain"
                      color="neutral"
                      size="sm"
                      onClick={() => handleViewDoctor(row)}
                    >
                      <VisibilityRoundedIcon />
                    </IconButton>
                    <IconButton
                      variant="plain"
                      color="neutral"
                      size="sm"
                      onClick={() => handleEditDoctor(row)}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                    <RowMenu />
                  </Box>                
                </td>   
              </tr>   
            ))} 
          </tbody>            
        </Table>    
      </Sheet>                
      <Box        
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          bgcolor: 'background.level1',
        }}      
      >
        <Typography level="body-sm">
          {selected.length} of {doctorsData.length} selected
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
          <Button variant="solid" color="danger" size="sm">
            Deactivate
          </Button>
        </Box>                          
      </Box>                                                      
      <Box
        className="Pagination-mobile"
        sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', py: 2 }} 
      >   
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ borderRadius: '50%' }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography level="body-sm">1</Typography>
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ borderRadius: '50%' }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>   
      </Box>
    </React.Fragment>
  );  
}