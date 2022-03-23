import { Button as NBButton } from 'native-base';

export const Button = ({ testID = 'button', ...rest }) => <NBButton testID={testID} {...rest} />;
