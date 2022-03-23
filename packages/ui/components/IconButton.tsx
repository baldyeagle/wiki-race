import { IconButton as NBIconButton } from "native-base";

export const IconButton = ({ testID = 'iconButton', ...rest }) => <NBIconButton testID={testID} {...rest} />