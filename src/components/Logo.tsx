import GinLogo from './gin.svg'
import {Box} from "@mui/material";

export function Logo() {
    return (
        <Box paddingLeft="10px" paddingRight="10px">
            <img src={GinLogo} alt="Gin Logo" width="30px"/>
        </Box>
    )
}