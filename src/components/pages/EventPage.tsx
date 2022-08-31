import {
    Button, ButtonGroup,
    Card,
    CardContent,
    CardHeader, Chip, Container,
    Grid, SvgIcon,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {ReactComponent as GoogleMapsIcon} from "./google-maps.svg"
import {ReactComponent as AppleMapsIcon} from "./apple-maps.svg"
import NavigationIcon from '@mui/icons-material/Navigation';
export function EventPage() {
    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="Heutige Termine"/>
                        <CardContent>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <img src="/hockey.jpg" height="100px"/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h5">Hockeymatch in</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <ButtonGroup
                                                    orientation="vertical"
                                                    aria-label="vertical outlined button group"
                                                    variant="outlined"
                                                >
                                                    <Button LinkComponent="button"
                                                            key="one"
                                                            onClick={event => window.open("http://maps.apple.com/?dirflg=d&t=m&daddr=Oberarnegg 554, 9212 Arnegg",'_blank')}
                                                            startIcon={<NavigationIcon/>}>
                                                        Navigation
                                                    </Button>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardHeader title="Meine offenen Termine"/>
                        <CardContent>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Termin
                                            </TableCell>
                                            <TableCell>
                                                Status
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Hockey Match
                                            </TableCell>
                                            <TableCell>
                                                <FormControl fullWidth>
                                                    <Select
                                                        id="demo-simple-select"
                                                        value={"outstanding"}
                                                        variant="standard"
                                                    >
                                                        <MenuItem value={"commitment"}>
                                                            <Chip color="success" size="small" label={"Zusage"}/>
                                                        </MenuItem>
                                                        <MenuItem value={"rejected"}>
                                                            <Chip color="error" size="small" label={"Rejected"}/>
                                                        </MenuItem>
                                                        <MenuItem value={"withreservation"}>
                                                            <Chip color="warning" size="small" label={"Mit Vorbehalt"}/>
                                                        </MenuItem>
                                                        <MenuItem value={"outstanding"}>
                                                            <Chip color="info" size="small" label={"Ausstehend"}/>
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>

                                            </TableCell>

                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardHeader title="Bevorstehende Termine"/>
                        <CardContent>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Termin
                                            </TableCell>
                                            <TableCell>
                                                Status
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Hockey Match
                                            </TableCell>
                                            <TableCell>
                                                <FormControl fullWidth>
                                                    <Select
                                                        id="demo-simple-select"
                                                        value={"outstanding"}
                                                        variant="standard"
                                                    >
                                                        <MenuItem value={"commitment"}>
                                                            <Chip color="success" size="small" label={"Zusage"}/>
                                                        </MenuItem>
                                                        <MenuItem value={"rejected"}>
                                                            <Chip color="error" size="small" label={"Rejected"}/>
                                                        </MenuItem>
                                                        <MenuItem value={"withreservation"}>
                                                            <Chip color="warning" size="small" label={"Mit Vorbehalt"}/>
                                                        </MenuItem>
                                                        <MenuItem value={"outstanding"}>
                                                            <Chip color="info" size="small" label={"Ausstehend"}/>
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>

                                            </TableCell>

                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}