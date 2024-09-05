import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv'; 
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const csvConfig = mkConfig({
  filename: 'Researchers_result',
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const MaterialTable = ({columns_value, data_table}) => {
    const navigate = useNavigate();
  //should be memoized or stable
  const columns = useMemo(
    () => columns_value,
    [columns_value],
  );
  const data = data_table;

    const handleExportData = () => {
      data.map((row) => {
        console.log(row)
        if(typeof(row.orcid_link) !== 'string')
          row.orcid_link = row.orcid_link.props.href
        if(typeof(row.personal_page_link) !== 'string')
          row.personal_page_link = row.personal_page_link.props.href
        if(typeof(row.research_group_link) !== 'string')
          row.research_group_link = row.research_group_link.props.href
      })
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const handleRowClick = (row,event) => {
    //navigate('/researcher-page', { state: { researcher_id: row.original.id } });
    if(!event.target.innerHTML.includes('.')){
        const url = `./researcher-page?researcher_id=${row.original.id}`;
        window.open(url, '_blank');
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { pagination: { pageSize: 30, pageIndex: 0 } },

    renderTopToolbarCustomActions: ({ table }) => (
        
      <Box
        sx={{
            display: 'flex',
            gap: '16px',
          padding: '8px',
            flexWrap: 'wrap',
        }}
      >
        <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
      </Box>
    ),

    initialState: { columnVisibility: { id: false } },

        muiTableBodyRowProps: ({row, staticRowIndex, table}) => ({
            onClick: (event) => {
                handleRowClick(row,event)
            },
            sx: {
              cursor: 'pointer',
            },
          }),
  });

  return <MaterialReactTable table={table}/>;
};

export default MaterialTable;
