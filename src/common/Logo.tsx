import { Box } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { siteConfigAtom } from '../atoms/SiteConfigAtom'

const LogoProps = {
  width: '30px',
}

export function Logo(props: typeof LogoProps = LogoProps) {
  const { logoUrl, name } = useRecoilValue(siteConfigAtom)
  if (logoUrl === '') return null
  return (
    <Box paddingLeft="10px" paddingRight="10px">
      <img src={logoUrl} alt={name} width={props.width} />
    </Box>
  )
}
